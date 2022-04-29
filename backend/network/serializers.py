from django.shortcuts import get_object_or_404
from rest_framework import serializers
from accounts.models import CustomUser, Notification
from restaurants.models import Restaurant, Blog
from network.models import Comment


class LikeRestaurantSerializer(serializers.ModelSerializer):
    like_status = serializers.BooleanField(write_only=True, required=True)

    class Meta:
        model = Restaurant
        fields = ['like_status']

    def update(self, instance, validated_data):
        if(instance.owner == self.context['request'].user):
            raise serializers.ValidationError(
                "You cannot like your own restaurant")

        if(validated_data['like_status']):
            if(self.context['request'].user in instance.liked_by.all()):
                raise serializers.ValidationError(
                    "You already liked this restaurant")
            instance.liked_by.add(self.context['request'].user)

            user = self.context['request'].user
            restaurant_noti = Notification.objects.create(user=user,
                                                          type="Liked_Restaurant")
            if(user != instance.owner):
                instance.owner.notification.add(restaurant_noti)

        else:
            if(not self.context['request'].user in instance.liked_by.all()):
                raise serializers.ValidationError(
                    "You already dont like this restaurant")
            instance.liked_by.remove(self.context['request'].user)

        instance.save()
        return instance


class FollowRestaurantSerializer(serializers.ModelSerializer):
    follow_status = serializers.BooleanField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['follow_status']

    def update(self, instance, validated_data):
        if(instance.owner == self.context['request'].user):
            raise serializers.ValidationError(
                "You cannot follow your own restaurant")

        if(validated_data['follow_status']):
            if(instance in self.context['request'].user.follows.all()):
                raise serializers.ValidationError(
                    "You already follow this restaurant")
            self.context['request'].user.follows.add(instance)

            instance.followed_by.add(self.context['request'].user)
            restaurant_noti = Notification.objects.create(user=self.context['request'].user, type="Follow")
            if(self.context['request'].user != instance.owner):
                instance.owner.notification.add(restaurant_noti)
            self.context['request'].user.save()
        else:
            if(not instance in self.context['request'].user.follows.all()):
                raise serializers.ValidationError(
                    "You already dont follow this restaurant")

            self.context['request'].user.follows.remove(instance)
            instance.followed_by.remove(self.context['request'].user)

        instance.save()
        return instance


class LikeBlogSerializer(serializers.ModelSerializer):
    like_status = serializers.BooleanField(write_only=True, required=True)

    class Meta:
        model = Blog
        fields = ['like_status']

    def update(self, instance, validated_data):
        if(instance.restaurant.owner == self.context['request'].user):
            raise serializers.ValidationError(
                "You cannot like your own blog post")

        if(validated_data['like_status']):
            if(self.context['request'].user in instance.liked_by.all()):
                raise serializers.ValidationError(
                    "You already liked this blog")
            instance.liked_by.add(self.context['request'].user)
            restaurant = instance.restaurant

            user = self.context['request'].user
            restaurant_noti = Notification.objects.create(user=user, type="Liked_Blog")
            if(user != restaurant.owner):
                restaurant.owner.notification.add(restaurant_noti)
            restaurant.save()
        else:
            if(not self.context['request'].user in instance.liked_by.all()):
                raise serializers.ValidationError(
                    "You already dont like this blog")
            instance.liked_by.remove(self.context['request'].user)

        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'avatar',)


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True,)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']


class AddCommentSerializer(serializers.ModelSerializer):
    comment = serializers.CharField()

    class Meta:
        model = Restaurant
        fields = ['comment']

    def update(self, instance, validated_data):
        comment_data = validated_data['comment']
        comment = Comment.objects.create(
            user=self.context['request'].user, content=comment_data)

        user = self.context['request'].user
        restaurant_noti = Notification.objects.create(user=user, type="Comment")
        if(instance.owner != user):
            instance.owner.notification.add(restaurant_noti)
        instance.comments.add(comment)
        instance.save()

        return instance


class LikeFollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'avatar', 'phone_number']


class FeedBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['id', 'name', 'picture',
                  'restaurant', 'content', 'created_date']


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'name', 'address', 'desc',
                  'logo', 'postal_code', 'phone_number']
