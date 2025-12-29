from django.urls import path
from .views import UserRegistrationView, UserProfileView, AdminUserListView, AdminUserDetailView, AdminStatsView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user_register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Admin Endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('admin/users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
]