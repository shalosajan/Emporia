from django.db import models
from users.models import CustomUser
from store.models import Product
from cloudinary.models import CloudinaryField

class Review(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PUBLISHED = 'PUBLISHED', 'Published'
        HIDDEN = 'HIDDEN', 'Hidden'

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    comment = models.TextField()
    # Simple single photo for MVP, or JSON if we really need multiple without extra table. 
    # User said "Photos" (plural), but creates complexity. Let's go with single ImageField for now 
    # as MVP standard in Django, or let's do a JSON list of URLs if we want to be fancy?
    # No, stick to standard Django ImageField 'photo' for now.
    photo = CloudinaryField('photo', blank=True, null=True)
 
    
    is_verified_purchase = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PUBLISHED)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        # Prevent spam: One review per user per product? 
        # Or allow multiple? Usually 1 per product.
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name} ({self.rating}★)"
