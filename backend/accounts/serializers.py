from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from accounts.models import CustomUser, Notification
from restaurants.models import Restaurant


class GetProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name',
                  'email', 'avatar', 'phone_number']


class ChangePasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('old_password', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()

        return instance


class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name',
                  'email', 'avatar', 'phone_number']

    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError(
                {"email": "This email is already in use."})
        return value

    def validate_phonenumber(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(phone_number=value).exists():
            raise serializers.ValidationError(
                {"phone_number": "This phone number is already in use."})
        return value

    def update(self, instance, validated_data):
        if ('first_name' in validated_data):
            instance.first_name = validated_data['first_name']
        if ('last_name' in validated_data):
            instance.last_name = validated_data['last_name']
        if ('email' in validated_data):
            instance.email = validated_data['email']
            instance.username = validated_data['email']
        if ('phone_number' in validated_data):
            instance.phone_number = validated_data['phone_number']
        if ('avatar' in validated_data):
            instance.avatar = validated_data['avatar']

        instance.save()

        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = "__all__"


class RegisterSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = CustomUser.objects.create_user(email=validated_data['email'], first_name=validated_data['first_name'],
                                              last_name=validated_data['last_name'], username=validated_data['email'], password=validated_data['password'])
        return user


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ("name", "logo")


class NotiUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ("first_name", "avatar")


class NotificationSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True,)
    user = NotiUserSerializer(read_only=True,)

    class Meta:
        model = Notification
        fields = ['user', 'restaurant', 'type', 'created_at']
