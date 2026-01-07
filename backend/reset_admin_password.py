import os
import django
import sys

sys.path.append(r'c:\dev\Emporia\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from users.models import CustomUser

def reset_password():
    try:
        u = CustomUser.objects.get(email='superuser@test.com')
        u.set_password('admin123')
        u.save()
        print("Password reset to 'admin123' SUCCESS")
    except CustomUser.DoesNotExist:
        print("User not found")

if __name__ == '__main__':
    reset_password()
