from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    product_name = serializers.ReadOnlyField(source='product.name')
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'user', 'product', 'product_name', 
            'rating', 'comment', 'photo', 
            'is_verified_purchase', 
            'status', 'created_at'
        ]
        read_only_fields = ['status', 'is_verified_purchase', 'user', 'product', 'product_name']
    
    def get_photo(self, obj):
        if obj.photo:
            return obj.photo.url
        return None
    
    def create(self, validated_data):
        # User and product are passed via context/save in view
        return Review.objects.create(**validated_data)
