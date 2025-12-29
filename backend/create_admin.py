import os
import django

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
