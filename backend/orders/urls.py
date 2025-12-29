# orders/urls.py

from django.urls import path
from . import views

urlpatterns = [
    # 1. POST to this to create an order in our DB
    path('create/', views.OrderCreateView.as_view(), name='order-create'),
    
    # 2. POST to this (with an 'order_id') to create a Razorpay order
    path('pay/', views.StartPaymentView.as_view(), name='start-payment'),
    
    # 3. POST to this with Razorpay IDs to verify payment
    path('verify-payment/', views.PaymentVerificationView.as_view(), name='verify-payment'),

    # 4. GET this to see logged-in user's orders
    path('my-orders/', views.MyOrdersListView.as_view(), name='my-orders'),

    # 5. GET this to see all orders (admin only)
    path('admin-orders/', views.AdminOrderListView.as_view(), name='admin-orders'),
]