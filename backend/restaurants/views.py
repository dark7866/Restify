from rest_framework.generics import get_object_or_404, GenericAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework import status
from restaurants.models import FoodItem, PostImage, Restaurant, Menu, Blog
from restaurants.serializers import CreateRestaurantSerializer, UpdateRestaurantSerializer, AddPostImageSerializer, PostImageSerializer, GetRestaurantSerializer, CreateMenuSerializer, UpdateFoodItemSerializer, AddFoodItemSerializer, CreateBlogSerializer, UpdateBlogSerializer, GetBlogSerializer, GetMenuSerializer
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

# Create your views here.

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 3

class StandardMenuResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 6

##### Restaurant APIS ####
class GetRestaurantView(RetrieveAPIView):
    serializer_class = GetRestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Restaurant, pk=self.kwargs['pk'])

class CreateRestaurantView(GenericAPIView):
    serializer_class = CreateRestaurantSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        restaurant = serializer.save()
        return Response({
            "restaurant": CreateRestaurantSerializer(restaurant, context=self.get_serializer_context()).data,
            "message": "Restaurant Created Successfully",
        })
    
class UpdateRestaurantView(RetrieveAPIView, UpdateAPIView):
    serializer_class = UpdateRestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Restaurant, owner=self.request.user)
    
##### Menu APIS ####
class GetMenuView(ListAPIView):
    pagination_class = StandardMenuResultsSetPagination
    serializer_class = GetMenuSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, pk=self.kwargs['pk'])
        return restaurant.menu.food_items.all().order_by('id')

class CreateMenuView(GenericAPIView):
    serializer_class = CreateMenuSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        menu = serializer.save()
        return Response({
            "menu": CreateMenuSerializer(menu, context=self.get_serializer_context()).data,
            "message": "Menu Created Successfully",
        })
    
class UpdateFoodItemView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    serializer_class = UpdateFoodItemSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(FoodItem, pk=self.kwargs['pk'])
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        restaurant = get_object_or_404(Restaurant, owner=self.request.user)
        if not instance in restaurant.menu.food_items.all():
            return Response({"Error": "You cannot delete this food item"}, status=status.HTTP_401_UNAUTHORIZED)
        self.perform_destroy(instance)
        return Response({
            "message":"Food item deleted successfully"}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.delete()
    
class AddFoodItemView(GenericAPIView):
    queryset = Menu.objects.all()
    serializer_class = AddFoodItemSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        menu = serializer.save()
        return Response({
            "menu": AddFoodItemSerializer(menu, context=self.get_serializer_context()).data,
            "message": "Added Items Successfully",
        })

##### Blog APIS ####
class GetAllRestaurantBlogsView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = GetBlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, pk=self.kwargs['pk'])
        return Blog.objects.filter(restaurant=restaurant).order_by('-created_date')


class GetBlogView(RetrieveAPIView):
    serializer_class = GetBlogSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Blog, pk=self.kwargs['pk'])

class AddBlogView(GenericAPIView):
    serializer_class = CreateBlogSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        menu = serializer.save()
        return Response({
            "menu": CreateBlogSerializer(menu, context=self.get_serializer_context()).data,
            "message": "Created blog Successfully",
        })

class UpdateBlogView(RetrieveAPIView, UpdateAPIView, DestroyAPIView):
    serializer_class = UpdateBlogSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Blog, pk=self.kwargs['pk'])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        restaurant = get_object_or_404(Restaurant, owner=self.request.user)
        if instance.restaurant != restaurant:
            return Response({"Error": "You cannot delete this blog"}, status=status.HTTP_401_UNAUTHORIZED)
        self.perform_destroy(instance)
        return Response({
            "message":"Blog deleted successfully"}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.delete()

class AddRestaurantGalleryView(GenericAPIView):
    serializer_class = AddPostImageSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args,  **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({
            "message": "Added Image Successfully",
        })

class UpdateRestaurantGalleryView(RetrieveAPIView, DestroyAPIView):
    serializer_class = PostImageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(PostImage, pk=self.kwargs['pk'])

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        restaurant = get_object_or_404(Restaurant, owner=self.request.user)
        if not instance in restaurant.gallery.all():
            return Response({"Error": "You cannot delete this image"}, status=status.HTTP_401_UNAUTHORIZED)
        self.perform_destroy(instance)
        return Response({
            "message":"Image deleted successfully"}, status=status.HTTP_200_OK)

    def perform_destroy(self, instance):
        instance.delete()

class GetRestaurantGalleryView(ListAPIView):
    pagination_class = StandardMenuResultsSetPagination
    serializer_class = PostImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, pk=self.kwargs['pk'])
        return restaurant.gallery.get_queryset().order_by('-uploaded_at')