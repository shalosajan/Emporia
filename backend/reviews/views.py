from rest_framework import generics, permissions, filters
from rest_framework.exceptions import PermissionDenied
from rest.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Review
from store.models import Product
from .serializers import ReviewSerializer
from users.permissions import IsSupport

class ProductReviewListCreateView(generics.ListCreateAPIView):
    """
    GET: List all published reviews for a product.
    POST: Authenticated users can create a review for a product.
    """
    serializer_class = ReviewSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        product_id = self.kwargs.get('product_id')
        return Review.objects.filter(
            product_id=product_id, 
            status=Review.Status.PUBLISHED
        ).order_by('-created_at')

    def perform_create(self, serializer):
        import traceback
        try:
            product_id = self.kwargs.get('product_id')
            print(f"DEBUG: Reviewing product_id: {product_id}")
            product = get_object_or_404(Product, id=product_id)
            print(f"DEBUG: Found product: {product}")
            
            # Check if user already reviewed this product?
            existing = Review.objects.filter(user=self.request.user, product=product).exists()
            if existing:
                 # Depending on policy, might allow update or block. For now block.
                 raise PermissionDenied("You have already reviewed this product.")

            # Check if verified purchase (Bonus implementation)
            # We can optimize this later, simply check OrderItems
            from orders.models import OrderItem
            print(f"DEBUG: Checking for verified purchase...")
            is_verified = OrderItem.objects.filter(
                order__customer=self.request.user, 
                order__paid=True, 
                product=product
            ).exists()
            print(f"DEBUG: Verified: {is_verified}")

            print(f"DEBUG: Saving review...")
            serializer.save(
                user=self.request.user, 
                product=product,
                is_verified_purchase=is_verified
            )
            print(f"DEBUG: Review saved!")
        except Exception as e:
            print(f"ERROR in perform_create: {e}")
            traceback.print_exc()
            raise e

# --- Admin Views ---

class AdminReviewListView(generics.ListAPIView):
    """
    Staff can view all reviews (Pending, Published, Hidden).
    Support/Managers/SuperAdmins.
    """
    permission_classes = [IsSupport] # Minimum Support
    serializer_class = ReviewSerializer
    queryset = Review.objects.all().order_by('-created_at')
    filter_backends = [filters.SearchFilter]
    search_fields = ['comment', 'user__username', 'product__name']

class AdminReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Staff can moderate reviews (Change status, Delete).
    """
    permission_classes = [IsSupport]
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def perform_update(self, serializer):
        # Support can hide, but maybe not edit content?
        # For simplicity, they can update everything effectively.
        serializer.save()
