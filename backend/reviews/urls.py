from django.urls import path
from .views import ProductReviewListCreateView, AdminReviewListView, AdminReviewDetailView

urlpatterns = [
    # Public / Customer: Get reviews for a product or Post new review
    path('product/<int:product_id>/', ProductReviewListCreateView.as_view(), name='product-reviews'),
    
    # Staff: Manage reviews
    path('admin/', AdminReviewListView.as_view(), name='admin-reviews-list'),
    path('admin/<int:pk>/', AdminReviewDetailView.as_view(), name='admin-reviews-detail'),
]
