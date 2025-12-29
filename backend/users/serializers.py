# users/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser

class UserRegistrationSerializer(serializers.ModelSerializer):
    # We add 'password2' to make the user confirm their password
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        # These are the fields our API will accept for registration
        fields = ['email', 'username', 'password', 'password2', 'role']
        extra_kwargs = {
            'password': {'write_only': True}, # 'write_only' means it's used for creation/update,
                                            # but not included when we send user data back.
        }

    def validate(self, data):
        """
        Check that the two password entries match.
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """
        Create and return a new user.
        This method handles hashing the password correctly.
        """
        # We don't want to save 'password2' to the database
        validated_data.pop('password2')
        
        # Use the custom model's create_user method
        # which correctly hashes the password.
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=validated_data.get('role', CustomUser.Role.CUSTOMER) # Defaults to Customer
        )
        return user
    
from rest_framework import exceptions

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Public Login: BLOCKS SuperUsers.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['role'] = user.role
        
        # Staff Level might be needed for Staff redirection, but SuperUser is blocked.
        if hasattr(user, 'staffprofile'):
            token['staff_level'] = user.staffprofile.role_level
        else:
            token['staff_level'] = None
            
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # BLOCK SUPERUSER
        if self.user.is_superuser:
            raise exceptions.PermissionDenied("Superusers must use the Admin Entry Point.")
            
        return data

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Admin Login: ALLOWS SuperUsers.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['username'] = user.username
        token['role'] = user.role
        
        if user.is_superuser:
            token['staff_level'] = 'SUPER_ADMIN'
        elif hasattr(user, 'staffprofile'):
            token['staff_level'] = user.staffprofile.role_level
        else:
            token['staff_level'] = None
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        # STRICTLY BLOCK NON-SUPERUSERS
        # Staff must use the public login portal.
        if not self.user.is_superuser:
             raise exceptions.PermissionDenied("This portal is restricted to Super Administrators only.")
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'address', 'city', 'postal_code']
        read_only_fields = ['id', 'email', 'username'] # Email/Username shouldn't be changed here easily

class AdminUserSerializer(serializers.ModelSerializer):
    seller_approved = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role', 'is_active', 'date_joined', 'seller_approved']

    def get_seller_approved(self, obj):
        if obj.role == 'SELLER' and hasattr(obj, 'sellerprofile'):
            return obj.sellerprofile.is_approved
        return None

# --- New Staff Serializers ---
from .models import StaffProfile

class StaffProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffProfile
        fields = ['role_level', 'department']

class StaffUserSerializer(serializers.ModelSerializer):
    staff_profile = StaffProfileSerializer(source='staffprofile', read_only=True)
    role_level = serializers.ChoiceField(choices=StaffProfile.Level.choices, write_only=True)
    department = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'password', 'is_active', 'date_joined', 'staff_profile', 'role_level', 'department']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role_level = validated_data.pop('role_level', StaffProfile.Level.SUPPORT)
        department = validated_data.pop('department', '')
        password = validated_data.get('password')
        
        # Force the role to STAFF
        validated_data['role'] = CustomUser.Role.STAFF
        
        # Create user using the manager method (handles hashing)
        # Note: create_user expects positional args or kwargs. 
        # We need to manually handle what create_user expects if we pass **validated_data directly
        # But CustomUser.objects.create_user signature is (email, username, password=None, **extra_fields)
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=password,
            role=CustomUser.Role.STAFF
        )
        
        # Create profile
        StaffProfile.objects.create(user=user, role_level=role_level, department=department)
        return user

class StaffUpdateSerializer(serializers.ModelSerializer):
    role_level = serializers.ChoiceField(choices=StaffProfile.Level.choices, required=False)
    department = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['is_active', 'role_level', 'department']

    def update(self, instance, validated_data):
        # Update User fields
        if 'is_active' in validated_data:
            instance.is_active = validated_data['is_active']
            instance.save()
            
        # Update Profile fields if they exist
        if hasattr(instance, 'staffprofile'):
            profile = instance.staffprofile
            if 'role_level' in validated_data:
                profile.role_level = validated_data['role_level']
            if 'department' in validated_data:
                profile.department = validated_data['department']
            profile.save()
        
        return instance