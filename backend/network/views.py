from django.shortcuts import render
from rest_framework import filters
from rest_framework.generics import get_object_or_404, UpdateAPIView, ListAPIView
from rest_framework.response import Response
from accounts.models import CustomUser
from restaurants.models import Restaurant, Blog
from django.db.models import Count
from network.serializers import LikeRestaurantSerializer, FollowRestaurantSerializer, FeedBlogSerializer, RestaurantSerializer, LikeFollowSerializer, LikeBlogSerializer, AddCommentSerializer, CommentSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 5

# Create your views here.
class LikeRestaurantView(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = LikeRestaurantSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args,  **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Restaurant status updated"})
    
class FollowRestaurantView(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = FollowRestaurantSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args,  **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Restaurant status updated"})

class LikeBlogView(UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = LikeBlogSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args,  **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Blog status changed"})
    
class AddRestaurantCommentView(UpdateAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = AddCommentSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args,  **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Added comment sucessfully"})
    
class GetRestaurantCommentView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, pk=self.kwargs['pk'])
        return restaurant.comments.get_queryset().order_by('-created_at')

class GetRestarurantFollowsView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = LikeFollowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, pk=self.kwargs['pk'])
        return restaurant.followed_by.get_queryset().order_by('id')

class GetRestarurantLikesView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = LikeFollowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, pk=self.kwargs['pk'])
        return restaurant.liked_by.get_queryset().order_by('id')

class GetBlogLikesView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = LikeFollowSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        blog = get_object_or_404(Blog, pk=self.kwargs['pk'])
        return blog.liked_by.get_queryset().order_by('id')

class GetUserFeedView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    serializer_class = FeedBlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        followed_restaurant = self.request.user.follows
        allBlogs = []
        for restaurant in followed_restaurant.all():
            restaurant_blogs = Blog.objects.filter(restaurant=restaurant)
            allBlogs += restaurant_blogs

        allBlogs.sort(key=lambda date: date.created_date, reverse=True)
        return allBlogs

class SearchRestaurantView(ListAPIView):
    pagination_class = StandardResultsSetPagination
    search_fields = ['name', 'address', 'menu__food_items__name']
    filter_backends = (filters.SearchFilter,)
    serializer_class = RestaurantSerializer
    
    def get_queryset(self):
        queryset = Restaurant.objects.all()
        return queryset
    
    def filter_queryset(self, queryset):
        queryset = super().filter_queryset(queryset)
        return queryset.annotate(followed_count=Count('followed_by')).order_by('-followed_count')