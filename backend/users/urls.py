from django.urls import path
from .views import (
    UserRegistrationView, UserProfileView, 
    AdminUserListView, AdminUserDetailView, AdminStatsView,
    StaffListCreateView, StaffDetailView, AdminTokenObtainPairView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('admin-login/', AdminTokenObtainPairView.as_view(), name='admin_login'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Admin Endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('admin-dashboard-stats/', AdminStatsView.as_view(), name='admin_stats'),
    
    # Staff Management
    path('admin/staff/', StaffListCreateView.as_view(), name='admin_staff_list'),
    path('admin/staff/<int:pk>/', StaffDetailView.as_view(), name='admin_staff_detail'),
]