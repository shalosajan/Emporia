import sys
import os
import django

# Add parent directory to path so we can import 'main' and 'users'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from users.models import CustomUser

def create_admin():
    email = 'superuser@test.com'
    password = 'adminpass123'
    
    if not CustomUser.objects.filter(email=email).exists():
        CustomUser.objects.create_superuser(
            email=email,
            username='superuser',
            password=password
        )
        print(f"Superuser {email} created.")
    else:
        print(f"Superuser {email} already exists.")

if __name__ == "__main__":
    create_admin()
