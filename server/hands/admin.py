from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin

from .models import Comment, CustomUser, Follow, Hand, LikedHand, Profile


@admin.register(CustomUser)
class UserAdmin(DefaultUserAdmin):
    pass


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    fields = ("photo", "description", "favorite_movie")
    list_display = ("author", "description", "created_date")
    readonly_fields = ("author", "created_date")


@admin.register(Hand)
class HandAdmin(admin.ModelAdmin):
    fields = (
        "author",
        "title",
        "description",
        "movies",
        "tags",
        "created_date",
        "updated_date",
    )
    list_display = (
        "author",
        "title",
        "description",
        "movies",
        "tags",
        "created_date",
        "updated_date",
    )
    readonly_fields = (
        "created_date",
        "updated_date",
    )


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    fields = ("author", "followed")
    list_display = ("author", "followed", "followed_date")
    readonly_fields = ("followed_date",)


@admin.register(LikedHand)
class LikedHandAdmin(admin.ModelAdmin):
    fields = ("hand", "author")
    list_display = ("hand", "author", "liked_date")
    readonly_fields = ("liked_date",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    fields = ("hand", "author", "body")
    list_display = ("hand", "author", "body", "created_date")
    readonly_fields = ("created_date",)
