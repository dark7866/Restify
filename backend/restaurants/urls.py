from django.urls import path
from restaurants.views import CreateRestaurantView, UpdateRestaurantView, UpdateRestaurantGalleryView, AddRestaurantGalleryView, GetRestaurantGalleryView, GetRestaurantView, GetMenuView, GetBlogView, CreateMenuView, UpdateFoodItemView, AddFoodItemView, AddBlogView, UpdateBlogView, GetAllRestaurantBlogsView

app_name = 'restaurant'

urlpatterns = [
    path('view/<pk>/', GetRestaurantView.as_view()),
    path('create/', CreateRestaurantView.as_view()),
    path('update/', UpdateRestaurantView.as_view()),
    path('menu/add/', CreateMenuView.as_view()),
    path('food/edit/<pk>/', UpdateFoodItemView.as_view()),
    path('food/add/', AddFoodItemView.as_view()),
    path('blog/add/', AddBlogView.as_view()),
    path('blog/<pk>/', GetBlogView.as_view()),
    path('blog/edit/<pk>/', UpdateBlogView.as_view()),
    path('blogs/<pk>/', GetAllRestaurantBlogsView.as_view()),
    path('menu/<pk>/', GetMenuView.as_view()),
    path('gallery/add/', AddRestaurantGalleryView.as_view()),
    path('gallery/delete/<pk>/', UpdateRestaurantGalleryView.as_view()),
    path('gallery/<pk>/', GetRestaurantGalleryView.as_view()),

]