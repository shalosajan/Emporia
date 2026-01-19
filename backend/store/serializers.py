# store/serializers.py

from rest_framework import serializers
from .models import Category, Product
from users.models import SellerProfile

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.store_name', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    image = serializers.SerializerMethodField()

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
            'category',
            'category_name',
            'seller',
            'seller_name',
            'average_rating',
            'review_count',
        ]
        read_only_fields = ['seller', 'slug']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url   # 👈 THIS is the key
        return None
