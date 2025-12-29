import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from users.models import CustomUser
from orders.models import Order
from store.models import Product

def check_counts():
    user_count = CustomUser.objects.count()
    order_count = Order.objects.count()
    product_count = Product.objects.count()
    
    print(f"----- DB COUNTS -----")
    print(f"Users: {user_count}")
    print(f"Orders: {order_count}")
    print(f"Products: {product_count}")
    
    if order_count > 0:
        print("\nFirst 3 Orders:")
        for o in Order.objects.all()[:3]:
            print(f"- ID: {o.id}, Total: {o.total_price}, Status: {o.status}")

if __name__ == "__main__":
    check_counts()
