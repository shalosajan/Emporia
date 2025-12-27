# store/models.py

from django.db import models
from django.conf import settings
from users.models import SellerProfile # <-- We need to link to our SellerProfile

# 1. --- Category Model ---

class Category(models.Model):
    name = models.CharField(max_length=255)
    # The 'slug' is the URL-friendly version of the name
    slug = models.SlugField(max_length=255, unique=True)
    
    class Meta:
        # This makes it look nice in the admin panel
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

# 2. --- Product Model ---

class Product(models.Model):
    # --- Cross-App Interaction ---
    # This is the ForeignKey link to the Seller who owns this product.
    # We link to SellerProfile, not CustomUser, because only approved
    # sellers can post products.
    seller = models.ForeignKey(
        SellerProfile, 
        on_delete=models.CASCADE, 
        related_name='products'
    )
    
    # --- Product Details ---
    category = models.ForeignKey(
        Category, 
        on_delete=models.SET_NULL, # If category is deleted, set product's category to NULL
        null=True, 
        related_name='products'
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    
    # --- Media Uploads ---
    # The 'upload_to' path will be relative to your MEDIA_ROOT
    image = models.ImageField(upload_to='products/%Y/%m/%d/', blank=True, null=True)

    # --- Slug Field ---
    slug = models.SlugField(max_length=255, unique=True)
    
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
         ordering = ('-created_at',) # Show newest products first

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name