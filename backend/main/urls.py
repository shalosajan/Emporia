# main/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Force Reload

# 1. --- Update this import ---
# We are removing the default view and importing our custom one
from users.views import MyTokenObtainPairView # <-- Import this
from rest_framework_simplejwt.views import TokenRefreshView,TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- API Authentication Endpoints ---
    path('api/auth/', include('users.urls')),
    
    # 2. --- Change this line ---
    # It now points to our new view
    path('api/auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # --- Store & Orders Apps ---
    path('api/', include('store.urls')), 
    path('api/orders/', include('orders.urls')),
    path('api/reviews/', include('reviews.urls')), # <-- Reviews App
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)