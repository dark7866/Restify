from asyncore import read
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from restaurants.models import FoodItem, Menu, Restaurant, Blog, PostImage
from accounts.models import Notification


class GetRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'desc', 'address', 'owner',
                  'menu', 'logo', 'postal_code', 'phone_number']


class CreateRestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'desc',
                  'logo', 'postal_code', 'phone_number']

    def create(self, validated_data):
        if Restaurant.objects.filter(owner=self.context["request"].user).exists():
            raise serializers.ValidationError("User already has a restaurant.")

        if ('logo' in validated_data):
            restaurant = Restaurant.objects.create(name=validated_data['name'], address=validated_data['address'], desc=validated_data['desc'], postal_code=validated_data['postal_code'],
                                                   phone_number=validated_data['phone_number'], owner=self.context['request'].user, logo=validated_data['logo'])
        else:
            restaurant = Restaurant.objects.create(name=validated_data['name'], address=validated_data['address'], desc=validated_data['desc'], postal_code=validated_data['postal_code'],
                                                   phone_number=validated_data['phone_number'], owner=self.context['request'].user)
        return restaurant


class UpdateRestaurantSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    address = serializers.CharField(required=False)
    postal_code = serializers.CharField(required=False)

    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'desc', 'address',
                  'menu', 'logo', 'postal_code', 'phone_number']
        extra_kwargs = {'phone_number': {'required': False}}

    def update(self, instance, validated_data):
        if('name' in validated_data):
            instance.name = validated_data['name']
        if('address' in validated_data):
            instance.address = validated_data['address']
        if('postal_code' in validated_data):
            instance.postal_code = validated_data['postal_code']
        if('phone_number' in validated_data):
            instance.phone_number = validated_data['phone_number']
        if ('logo' in validated_data):
            instance.logo = validated_data['logo']
        if ('desc' in validated_data):
            instance.desc = validated_data['desc']

        instance.save()

        return instance


class FoodItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'description', 'type', 'price']


class CreateMenuSerializer(serializers.ModelSerializer):
    food_items = FoodItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = ['id', 'food_items']

    def create(self, validated_data):
        restaurant = get_object_or_404(
            Restaurant, owner=self.context["request"].user)
        if restaurant.menu != None:
            raise serializers.ValidationError(
                {"Error": "Restaurant already has a menu"})

        food_data = validated_data.pop('food_items')
        menu = Menu.objects.create(**validated_data, restaurant=restaurant)
        for food in food_data:
            food_item = FoodItem.objects.create(name=food.get("name"), description=food.get(
                "description"), type=food.get("type"), price=food.get("price"))
            menu.food_items.add(food_item)

        restaurant.menu = menu
        restaurant.save()
        return menu


class UpdateFoodItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    description = serializers.CharField(required=False)
    type = serializers.CharField(required=False)
    price = serializers.FloatField(required=False)

    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'description', 'type', 'price']

    def update(self, instance, validated_data):
        restaurant = get_object_or_404(
            Restaurant, owner=self.context["request"].user)
        menu = restaurant.menu
        if not instance in menu.food_items.all():
            res = serializers.ValidationError(
                {"Error": "You cannot edit this food item"})
            res.status_code = 401
            raise res

        for followed_user in restaurant.followed_by.all():
            restaurant_noti = Notification.objects.create(
                restaurant=restaurant, type="Menu")
            if(followed_user != restaurant.owner):
                followed_user.notification.add(restaurant_noti)
            followed_user.save()

        if('name' in validated_data):
            instance.name = validated_data['name']
        if('description' in validated_data):
            instance.description = validated_data['description']
        if('type' in validated_data):
            instance.type = validated_data['type']
        if('price' in validated_data):
            instance.price = validated_data['price']

        instance.save()
        return instance


class AddFoodItemSerializer(serializers.ModelSerializer):
    food_items = FoodItemSerializer(many=True)

    class Meta:
        model = Menu
        fields = ['id', 'food_items']

    def create(self, validated_data):
        restaurant = get_object_or_404(
            Restaurant, owner=self.context["request"].user)
        if restaurant.menu is None:
            raise serializers.ValidationError(
                "Restaurant has no associated menu")

        food_data = validated_data.pop('food_items')
        menu = restaurant.menu
        for food in food_data:
            food_item = FoodItem.objects.create(name=food.get("name"), description=food.get(
                "description"), type=food.get("type"), price=food.get("price"))
            menu.food_items.add(food_item)
            
        for followed_user in restaurant.followed_by.all():
            restaurant_noti = Notification.objects.create(
                restaurant=restaurant, type="Menu")
            if(followed_user != restaurant.owner):
                followed_user.notification.add(restaurant_noti)
            followed_user.save()

        return menu


class GetMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodItem
        fields = ['id', 'name', 'description', 'type', 'price']


class GetRestaurantNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['name']


class GetBlogSerializer(serializers.ModelSerializer):
    restaurant = GetRestaurantNameSerializer(read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'name', 'picture',
                  'restaurant', 'content', 'created_date']


class CreateBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'name', 'picture', 'content']

    def create(self, validated_data):
        restaurant = get_object_or_404(
            Restaurant, owner=self.context["request"].user)
        blog = Blog.objects.create(**validated_data, restaurant=restaurant)

        for followed_user in restaurant.followed_by.all():
            restaurant_noti = Notification.objects.create(
                restaurant=restaurant, type="Blog")
            if(followed_user != restaurant.owner):
                followed_user.notification.add(restaurant_noti)
            followed_user.save()

        return blog


class UpdateBlogSerializer(serializers.ModelSerializer):
    name = serializers.CharField(required=False)
    content = serializers.CharField(required=False)

    class Meta:
        model = Blog
        fields = ['id', 'name', 'picture', 'content']

    def update(self, instance, validated_data):
        restaurant = get_object_or_404(
            Restaurant, owner=self.context["request"].user)
        blogItem = get_object_or_404(Blog, pk=instance.pk)
        if blogItem.restaurant != restaurant:
            res = serializers.ValidationError(
                {"Error": "You cannot edit this blog"})
            res.status_code = 401
            raise res

        if('name' in validated_data):
            instance.name = validated_data['name']
        if('content' in validated_data):
            instance.content = validated_data['content']
        if('picture' in validated_data):
            instance.picture = validated_data['picture']
        instance.save()

        return instance


class PostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['id', 'image']


class AddPostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ['image']

    def create(self, validated_data):
        restaurant = get_object_or_404(
            Restaurant, owner=self.context["request"].user)
        image = PostImage.objects.create(**validated_data)
        restaurant.gallery.add(image)
        return image
