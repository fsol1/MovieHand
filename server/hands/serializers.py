from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Comment, Follow, Hand, LikedHand, Profile
from .utils import has_duplicates, is_movie_valid


class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords must match.")
        return data

    def create(self, validated_data):
        data = {
            key: value
            for key, value in validated_data.items()
            if key not in ("password1", "password2")
        }
        data["password"] = validated_data["password1"]
        return self.Meta.model.objects.create_user(**data)

    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
            "password1",
            "password2",
            "first_name",
            "last_name",
        )
        read_only_fields = ("id",)


class LogInSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = UserSerializer(user).data
        for key, value in user_data.items():
            if key != "id":
                token[key] = value
        return token


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField("get_username")

    def get_username(self, Profile):
        return Profile.author.username

    def validate(self, data):
        if not is_movie_valid(data["favorite_movie"]):
            raise serializers.ValidationError("This movie doesn't exist.")
        return data

    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ("id", "created_date", "username", "author")


class HandSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["request"].user != data["author"]:
            raise serializers.ValidationError("Not your account")
        for movie in data["movies"]:
            if not is_movie_valid(movie):
                raise serializers.ValidationError("This movie doesn't exist.")
        if has_duplicates(data["movies"]):
            raise serializers.ValidationError(
                "Can't have the same movie multiple times in the same hand."
            )
        if has_duplicates(data["tags"]):
            raise serializers.ValidationError("Can't have the same tag multiple times.")
        return data

    class Meta:
        model = Hand
        fields = "__all__"
        read_only_fields = (
            "id",
            "created_date",
            "updated_date",
        )


class FollowSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["request"].user != data["author"]:
            raise serializers.ValidationError("Not your account")
        if data["author"] == data["followed"]:
            raise serializers.ValidationError("Can't follow yourself")
        if Follow.objects.filter(
            author=data["author"], followed=data["followed"]
        ).exists():
            raise serializers.ValidationError("User already followed")
        return data

    class Meta:
        model = Follow
        fields = "__all__"
        read_only_fields = ("id", "followed_date")


class LikedHandSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["request"].user != data["author"]:
            raise serializers.ValidationError("Not your account")
        if LikedHand.objects.filter(author=data["author"], hand=data["hand"]).exists():
            raise serializers.ValidationError("Hand already liked")
        return data

    class Meta:
        model = LikedHand
        fields = "__all__"
        read_only_fields = ("id", "liked_date")


class CommentSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if self.context["request"].user != data["author"]:
            raise serializers.ValidationError("Not your account")
        return data

    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ("id", "created_date")
