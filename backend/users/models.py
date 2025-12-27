# users/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

# 1. --- CustomUser Model ---
# This model extends Django's default User, adding a 'role' field.

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "CUSTOMER", "Customer"
        SELLER = "SELLER", "Seller"

    # We use email as the unique identifier for login
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, choices=Role.choices, default=Role.CUSTOMER)
    
    # Profile Fields
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)

    # Tell Django to use 'email' as the login field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username'] # 'username' is still required for createsuperuser

    def __str__(self):
        return self.email

# 2. --- SellerProfile Model ---
# This model stores extra data for users with the 'SELLER' role.

class SellerProfile(models.Model):
    # This is the core of our multi-vendor system.
    # Each SellerProfile is linked to one and only one CustomUser.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='sellerprofile'
    )
    store_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False) # Admin must approve this
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.store_name if self.store_name else f"Profile for {self.user.email}"

# 3. --- Signal ---
# We use a signal to automatically create a SellerProfile
# whenever a new CustomUser is created with the 'SELLER' role.

@receiver(post_save, sender=CustomUser)
def create_seller_profile(sender, instance, created, **kwargs):
    if created and instance.role == CustomUser.Role.SELLER:
        SellerProfile.objects.create(user=instance)