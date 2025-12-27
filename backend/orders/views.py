# orders/views.py

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from django.conf import settings
import razorpay
from django.shortcuts import get_object_or_404
import hmac
import hashlib
import json

# Initialize Razorpay client
razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

# --- 1. View for Creating an Order ---

class OrderCreateView(generics.CreateAPIView):
    """
    Creates a new order in the database.
    This is the first step of the checkout process.
    The user must be authenticated.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        """Pass request context to the serializer."""
        return {'request': self.request}

# --- 2. View for Starting the Payment ---

class StartPaymentView(APIView):
    """
    Takes an Order ID, creates a Razorpay order,
    and returns the Razorpay order ID and details.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Get the 'order_id' from the request body
        order_id = request.data.get('order_id')
        if not order_id:
            return Response(
                {"error": "Order ID is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get the order from our database
        try:
            order = Order.objects.get(id=order_id, customer=request.user, paid=False)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found or already paid."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Get total cost in the smallest currency unit (e.g., paise)
        # Razorpay expects the amount in integers
        amount_in_paise = int(order.get_total_cost() * 100)

        # --- Create Razorpay Order ---
        try:
            razorpay_order = razorpay_client.order.create({
                "amount": amount_in_paise,
                "currency": "INR", # Change as needed
                "receipt": f"order_rcptid_{order.id}",
                "payment_capture": 1 # Auto-capture payment
            })
            
            # Save the Razorpay Order ID to our model
            order.razorpay_order_id = razorpay_order['id']
            order.save()

            # Return the Razorpay order details to the frontend
            return Response({
                "razorpay_order_id": razorpay_order['id'],
                "amount": razorpay_order['amount'],
                "currency": razorpay_order['currency'],
                "key": settings.RAZORPAY_KEY_ID,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# --- 4. View for Listing User's Orders ---

class MyOrdersListView(generics.ListAPIView):
    """
    Returns a list of orders made by the currently authenticated user.
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter orders where the 'customer' matches the current user
        return Order.objects.filter(customer=self.request.user).order_by('-created_at')

# --- 3. View for Verifying the Payment ---

class PaymentVerificationView(APIView):
    """
    Verifies the payment signature from Razorpay.
    If successful, marks the order as 'paid'.
    """
    # This view can be public, but we verify the signature
    # Alternatively, you can make it a webhook from Razorpay
    permission_classes = [permissions.AllowAny] 

    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            razorpay_order_id = data['razorpay_order_id']
            razorpay_payment_id = data['razorpay_payment_id']
            razorpay_signature = data['razorpay_signature']

            # --- Verify the Signature ---
            # This is the crucial security step
            params_dict = f'{razorpay_order_id}|{razorpay_payment_id}'
            signature = hmac.new(
                bytes(settings.RAZORPAY_KEY_SECRET, 'utf-8'),
                msg=bytes(params_dict, 'utf-8'),
                digestmod=hashlib.sha256
            ).hexdigest()

            if not hmac.compare_digest(signature, razorpay_signature):
                return Response(
                    {"error": "Invalid payment signature."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # --- Signature is Valid ---
            # Get the order and mark it as paid
            try:
                order = Order.objects.get(razorpay_order_id=razorpay_order_id)
                
                order.paid = True
                order.razorpay_payment_id = razorpay_payment_id
                order.razorpay_signature = razorpay_signature
                order.save()
                
                # We'll send back the serialized order data as confirmation
                serializer = OrderSerializer(order)
                return Response(serializer.data, status=status.HTTP_200_OK)

            except Order.DoesNotExist:
                return Response(
                    {"error": "Order not found."}, 
                    status=status.HTTP_404_NOT_FOUND
                )

        except KeyError:
            return Response(
                {"error": "Missing Razorpay data."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )