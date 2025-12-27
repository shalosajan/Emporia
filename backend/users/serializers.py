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
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # This is the default method, which creates the token
        token = super().get_token(user)

        # --- Add custom claims ---
        # We add the user's data to the token
        token['email'] = user.email
        token['username'] = user.username
        token['role'] = user.role
        
        return token

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'address', 'city', 'postal_code']
        read_only_fields = ['id', 'email', 'username'] # Email/Username shouldn't be changed here easily