from rest_framework.generics import get_object_or_404, GenericAPIView, UpdateAPIView, RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from accounts.models import CustomUser
from accounts.serializers import RegisterSerializer, UserSerializer, GetProfileSerializer, UpdateUserSerializer, ChangePasswordSerializer, NotificationSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

# Create your views here.

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 5

# Register API
class RegisterView(GenericAPIView):
    """
    Resgister a user
    """
    serializer_class = RegisterSerializer

    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "message": "User Created Successfully",
        })


# Logout API
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args,  **kwargs):
        return Response({
            "message": "User logout succesful",
        })


# Edit Profile API
class UpdateUserView(RetrieveAPIView, UpdateAPIView):
    serializer_class = UpdateUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


# Change Password API
class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args,  **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Password Updated Sucessfully"})

# Get Profile View
class GetProfileView(RetrieveAPIView):
    serializer_class = GetProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(CustomUser, pk=self.kwargs['pk'])

# Get User Notifications View
class GetNotificationView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.notification.get_queryset().order_by('-created_at')