# users/views.py

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, AdminTokenObtainPairSerializer, UserRegistrationSerializer, UserProfileSerializer
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
    Public Login: BLOCKS SuperUsers.
    """
    serializer_class = MyTokenObtainPairSerializer

class AdminTokenObtainPairView(TokenObtainPairView):
    """
    Admin Login: ALLOWS SuperUsers.
    """
    serializer_class = AdminTokenObtainPairSerializer

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
    # Filter to show only Customers and Sellers (Exclude Staff/Admins from this view)
    queryset = CustomUser.objects.filter(role__in=[CustomUser.Role.CUSTOMER, CustomUser.Role.SELLER]).order_by('-date_joined')
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
from orders.models import Order, OrderItem
from django.db.models import Sum, F, DecimalField

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_users = CustomUser.objects.count()
        total_orders = Order.objects.count()
        # Calculate revenue by summing (price * quantity) of all items in PAID orders
        total_revenue = OrderItem.objects.filter(order__paid=True).aggregate(
            revenue=Sum(F('price') * F('quantity'), output_field=DecimalField())
        )['revenue'] or 0

        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_revenue": total_revenue
        })

# --- Staff Management Views ---
from .models import StaffProfile, AuditLog
from .serializers import StaffUserSerializer, StaffUpdateSerializer
from .permissions import IsSuperAdmin
from rest_framework.exceptions import PermissionDenied

class StaffListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsSuperAdmin] # Only Super Admins can manage staff
    serializer_class = StaffUserSerializer
    
    def get_queryset(self):
        return CustomUser.objects.filter(role=CustomUser.Role.STAFF).order_by('-date_joined')

    def perform_create(self, serializer):
        user = serializer.save()
        # Audit Log
        AuditLog.objects.create(
            actor=self.request.user,
            action="CREATED_STAFF",
            target=user.email,
            details=f"Role: {user.staffprofile.role_level}"
        )

class StaffDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsSuperAdmin]
    queryset = CustomUser.objects.filter(role=CustomUser.Role.STAFF)
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return StaffUpdateSerializer
        return StaffUserSerializer

    def perform_update(self, serializer):
        instance = self.get_object()
        # Self-Protection
        if instance.id == self.request.user.id:
            raise PermissionDenied("You cannot modify your own staff account.")
            
        serializer.save()
        
        # Audit Log
        AuditLog.objects.create(
            actor=self.request.user,
            action="UPDATED_STAFF",
            target=instance.email,
            details=f"Data: {serializer.validated_data}"
        )

    def perform_destroy(self, instance):
        # Self-Protection
        if instance.id == self.request.user.id:
            raise PermissionDenied("You cannot delete your own staff account.")
        
        email = instance.email
        # Deactivate instead of hard delete (soft delete)? 
        # Requirement said "Deactivate Account: A 'Kill Switch'".
        # But method is destroy. Let's do hard delete or deactivation?
        # Standard destroy is delete. Let's stick to delete for now as 'Kill Switch' usually implies Deactivate.
        # But if the user clicks Delete, they expect Delete.
        # Let's Implement Deactivation via UPDATE (is_active=False).
        # This view allows DELETE http verb which does hard delete.
        # We can keep hard delete for cleanup.
        
        instance.delete()
        
        # Audit Log
        AuditLog.objects.create(
            actor=self.request.user,
            action="DELETED_STAFF",
            target=email
        )