import os
import django
import sys

sys.path.append(r'c:\dev\Emporia\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.test import override_settings
from users.models import StaffProfile

User = get_user_model()

@override_settings(ALLOWED_HOSTS=['*'])
def verify_staff_access():
    print("--- Verifying Staff Data Access ---")
    
    # 1. Get/Create Staff User (Support Role)
    email = 'staff_support@test.com'
    try:
        user = User.objects.get(email=email)
        print(f"User {email} found.")
    except User.DoesNotExist:
        user = User.objects.create_user(email=email, username='staff_supp', password='password123', role='STAFF')
        StaffProfile.objects.create(user=user, role_level='SUPPORT')
        print(f"User {email} created.")

    # 2. Authenticate
    client = APIClient()
    client.force_authenticate(user=user)
    
    # 3. Test Categories Access (Admin View)
    print("\nTesting Categories Access (/api/admin/categories/)...")
    resp = client.get('/api/admin/categories/')
    if resp.status_code == 200:
        print(f"SUCCESS: Categories Access Granted. Count: {len(resp.data)}")
    else:
        print(f"FAILED: {resp.status_code}")
        try: print(resp.content.decode())
        except: print(resp.content)

    # 4. Test Admin Orders Access
    print("\nTesting Admin Orders Access (/api/orders/admin-orders/)...")
    resp = client.get('/api/orders/admin-orders/')
    if resp.status_code == 200:
        print(f"SUCCESS: Orders Access Granted. Count: {len(resp.data)}")
    else:
        print(f"FAILED: {resp.status_code}")
        try: print(resp.content.decode())
        except: print(resp.content)

if __name__ == '__main__':
    verify_staff_access()
