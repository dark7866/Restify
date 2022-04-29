from django.contrib import admin
from restaurants.models import Restaurant, Menu, FoodItem, Blog, PostImage
# Register your models here.
admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(FoodItem)
admin.site.register(Blog)
admin.site.register(PostImage)
