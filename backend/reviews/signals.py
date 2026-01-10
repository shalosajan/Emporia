from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review
from store.models import Product

@receiver(post_save, sender=Review)
@receiver(post_delete, sender=Review)
def update_product_stats(sender, instance, **kwargs):
    """
    Recalculate average rating and review count for the product
    whenever a review is saved or deleted.
    ONLY counts PUBLISHED reviews.
    """
    product = instance.product
    
    # Calculate stats
    stats = Review.objects.filter(product=product, status=Review.Status.PUBLISHED).aggregate(
        avg_rating=Avg('rating'),
        count=Count('id')
    )
    
    # Update product fields
    product.average_rating = stats['avg_rating'] or 0.0
    product.review_count = stats['count'] or 0
    product.save()
