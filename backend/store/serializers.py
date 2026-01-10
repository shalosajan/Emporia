# store/serializers.py

from rest_framework import serializers
from .models import Category, Product
from users.models import SellerProfile

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    # We want to show the seller's store name, not just their ID.
    # 'read_only=True' means we just display it, not expect it on input.
    # 'source' tells DRF to look at the 'store_name' field on the 'seller' object.
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)
    
    # We also want to show the category name
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 
            'name', 
            'slug',
            'description', 
            'price', 
            'stock', 
            'image', 
            'category',       # We send the category ID for filtering
            'category_name',  # And the name for display
            'seller',         # We send the seller ID
            'seller_name',    # And the store name for display
            'average_rating',
            'review_count',
        ]
        
        # We protect these fields from being edited directly by the API consumer
        # 'seller' will be set automatically based on the logged-in user.
        read_only_fields = ['seller', 'slug']