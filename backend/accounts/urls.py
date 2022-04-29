from django.urls import path
from accounts.views import ChangePasswordView, RegisterView, LogoutView, UpdateUserView, GetProfileView, GetNotificationView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,)

app_name = 'accounts'

urlpatterns = [
    path('profile/<pk>/', GetProfileView.as_view()),
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('login/refresh/', TokenRefreshView.as_view(), name='login_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('edit/', UpdateUserView.as_view(), name='edit'),
    path('change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('notification/', GetNotificationView.as_view(), name='noti'),
]
