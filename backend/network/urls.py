from django.urls import path
from network.views import LikeRestaurantView, FollowRestaurantView, LikeBlogView, SearchRestaurantView, GetUserFeedView, GetRestarurantFollowsView, GetRestarurantLikesView, GetBlogLikesView, AddRestaurantCommentView, GetRestaurantCommentView

app_name = 'network'

urlpatterns = [
    path('like/restaurant/<pk>/', LikeRestaurantView.as_view()),
    path('follow/restaurant/<pk>/', FollowRestaurantView.as_view()),
    path('like/blog/<pk>/', LikeBlogView.as_view()),
    path('comment/restaurant/<pk>/', AddRestaurantCommentView.as_view()),
    path('user/feed/', GetUserFeedView.as_view()),
    path('restaurant/follows/<pk>/', GetRestarurantFollowsView.as_view()),
    path('restaurant/comments/<pk>/', GetRestaurantCommentView.as_view()),
    path('restaurant/likes/<pk>/', GetRestarurantLikesView.as_view()),
    path('blog/likes/<pk>/', GetBlogLikesView.as_view()),
    path('search/restaurant/', SearchRestaurantView.as_view()),
]
