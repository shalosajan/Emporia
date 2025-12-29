# users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, SellerProfile, StaffProfile, AuditLog

# This class customizes how the CustomUser is displayed
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Add 'role' to the list of fields displayed in the admin
    list_display = ('email', 'username', 'role', 'is_staff')
    # Add 'role' to the fields editable in the admin
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),
    )

# This class customizes how the SellerProfile is displayed
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'store_name', 'is_approved')
    # Make 'is_approved' a filterable field
    list_filter = ('is_approved',)
    # Make the store name searchable
    search_fields = ('store_name',)

# Register your models here
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(SellerProfile, SellerProfileAdmin)