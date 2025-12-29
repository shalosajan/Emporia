# users/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, UserRegistrationSerializer, UserProfileSerializer
from .models import CustomUser
from rest_framework import generics, permissions

class UserRegistrationView(generics.CreateAPIView):
    """
    A public endpoint for registering new users.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    
    # This is a public endpoint, so we allow anyone to access it.
    permission_classes = [permissions.AllowAny]
    
class MyTokenObtainPairView(TokenObtainPairView):
    """
    This custom view uses our custom serializer to include
    user data (email, role) in the token.
    """
    serializer_class = MyTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Endpoint for users to view and update their profile details.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Return the currently authenticated user
        return self.request.user

# --- Admin Views ---

from .serializers import AdminUserSerializer

class AdminUserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]

class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_update(self, serializer):
        user = serializer.save()
        # Handle Seller Approval separately if passed in context or if we want to handle it here
        # For simplicity, let's assume specific actions might be efficient, but generic update works for is_active.
        
        # Check if we need to update seller approval
        if user.role == CustomUser.Role.SELLER and 'seller_approved' in self.request.data:
            approved = self.request.data['seller_approved']
            if hasattr(user, 'sellerprofile'):
                user.sellerprofile.is_approved = approved
                user.sellerprofile.save()

from rest_framework.views import APIView
from rest_framework.response import Response
from orders.models import Order
from django.db.models import Sum

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = CustomUser.objects.count()
        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(paid=True).aggregate(Sum('total_cost'))['total_cost__sum'] or 0

        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_revenue": total_revenue
        })