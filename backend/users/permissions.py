from rest_framework import permissions

class IsStaffUser(permissions.BasePermission):
    """
    Allows access only to users with role='STAFF'.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'STAFF')

class IsSuperAdmin(permissions.BasePermission):
    """
    Allows access only to SUPER_ADMIN staff.
    """
    def has_permission(self, request, view):
        if request.user and request.user.is_superuser:
            return True
        if not (request.user and request.user.is_authenticated and request.user.role == 'STAFF'):
            return False
        return hasattr(request.user, 'staffprofile') and request.user.staffprofile.role_level == 'SUPER_ADMIN'

class IsManager(permissions.BasePermission):
    """
    Allows access to MANAGER and SUPER_ADMIN.
    """
    def has_permission(self, request, view):
        if request.user and request.user.is_superuser:
            return True
        if not (request.user and request.user.is_authenticated and request.user.role == 'STAFF'):
            return False
        if not hasattr(request.user, 'staffprofile'):
            return False
        
        allowed_roles = ['SUPER_ADMIN', 'MANAGER']
        return request.user.staffprofile.role_level in allowed_roles

class IsSupport(permissions.BasePermission):
    """
    Allows access to SUPPORT, MANAGER, and SUPER_ADMIN.
    """
    def has_permission(self, request, view):
        if request.user and request.user.is_superuser:
            return True
        if not (request.user and request.user.is_authenticated and request.user.role == 'STAFF'):
            return False
        return hasattr(request.user, 'staffprofile') # All staff have at least Support level access
