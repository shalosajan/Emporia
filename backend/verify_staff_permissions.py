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
def verify_staff_permissions():
    print("--- Verifying Staff Permissions ---")
    
    # 1. Create/Get Staff User
    email = 'staff_test@test.com'
    password = 'password123'
    try:
        user = User.objects.get(email=email)
        print(f"User {email} found.")
        # Ensure role is set
        if user.role != 'STAFF':
            user.role = 'STAFF'
            user.save()
            print("Fixed role to STAFF")
    except User.DoesNotExist:
        user = User.objects.create_user(email=email, username='staff_test', password=password, role='STAFF')
        StaffProfile.objects.create(user=user, role_level='SUPPORT')
        print(f"User {email} created.")

    # 2. Check is_staff status
    print(f"is_staff status: {user.is_staff}")
    print(f"Role: {user.role}")
    if hasattr(user, 'staffprofile'):
        print(f"Profile Role: {user.staffprofile.role_level}")
    else:
        print("WARNING: No StaffProfile found!")

    if user.is_staff:
        print("WARNING: is_staff is True! This user has Admin Panel access.")
    else:
        print("SUCCESS: is_staff is False. Django Admin is blocked.")

    # 3. Test API Access (Dashboard Stats)
    client = APIClient()
    client.force_authenticate(user=user)
    
    print("\nTesting /api/auth/admin-dashboard-stats/ (Requires IsSupport)...")
    resp = client.get('/api/auth/admin-dashboard-stats/')
    if resp.status_code == 200:
        print("SUCCESS: Access Granted.")
        print(resp.json())
    else:
        print(f"FAILED: {resp.status_code}")
        # Try to print content safely
        try:
             print(resp.content.decode())
        except:
             print(resp.content)

    # 4. Test User List Access
    print("\nTesting /api/auth/admin/users/ (Requires IsSupport)...")
    resp = client.get('/api/auth/admin/users/')
    if resp.status_code == 200:
        print(f"SUCCESS: Access Granted. Count: {len(resp.data)}")
    else:
         print(f"FAILED: {resp.status_code}")
         try:
             print(resp.content.decode())
         except:
             print(resp.content)

    # 5. Test Block User (Requires IsManager - Should FAIL for Support)
    print("\nTesting PATCH /api/auth/admin/users/1/ (Requires IsManager)...")
    # Taking a random user target
    target = User.objects.exclude(id=user.id).first()
    if target:
        resp = client.patch(f'/api/auth/admin/users/{target.id}/', {'is_active': False})
        if resp.status_code == 403:
            print("SUCCESS: Access Denied (Correctly blocked for Support role).")
        elif resp.status_code == 200:
            print("FAILED: Support User WAS able to block user!")
        else:
            print(f"Unexpected: {resp.status_code}")

if __name__ == '__main__':
    verify_staff_permissions()
