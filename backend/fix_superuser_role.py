import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')
django.setup()

from users.models import CustomUser, StaffProfile

def fix_superuser():
    email = "superuser@test.com"
    print(f"Checking user {email}...")
    
    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        print("User not found!")
        return

    print(f"Current Role: {user.role}")
    
    # 1. Update Role
    if user.role != CustomUser.Role.STAFF:
        print("Updating role to STAFF...")
        user.role = CustomUser.Role.STAFF
        user.save()
        print("Role updated.")
    else:
        print("Role is already STAFF.")

    # 2. Update/Create Profile
    profile, created = StaffProfile.objects.get_or_create(user=user)
    if created:
        print("Created new StaffProfile.")
    
    if profile.role_level != StaffProfile.Level.SUPER_ADMIN:
        print(f"Updating level from {profile.role_level} to SUPER_ADMIN...")
        profile.role_level = StaffProfile.Level.SUPER_ADMIN
        profile.save()
        print("Level updated.")
    else:
        print("Profile level is already SUPER_ADMIN.")

    print("--- User Fixed ---")
    print(f"User: {user.email}")
    print(f"Role: {user.role}")
    print(f"Level: {user.staffprofile.role_level}")

if __name__ == "__main__":
    fix_superuser()
