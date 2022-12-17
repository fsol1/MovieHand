from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class CustomUser(AbstractUser):
    pass


class Profile(models.Model):
    author = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="photos", null=True, blank=True)
    description = models.CharField(max_length=250)
    favorite_movie = models.IntegerField(blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(author=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()

    def __str__(self):
        return f"{self.author.username} Profile"


class Hand(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1
    )
    title = models.CharField(max_length=50)
    description = models.TextField()
    movies = ArrayField(models.IntegerField(), size=5)
    tags = ArrayField(models.CharField(max_length=20, null=True), size=5, default=list)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}"


class Follow(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="author"
    )
    followed = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="followed"
    )
    followed_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author} follows {self.followed}"


class LikedHand(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    hand = models.ForeignKey(Hand, on_delete=models.CASCADE)
    liked_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author} likes {self.hand.title}"


class Comment(models.Model):
    hand = models.ForeignKey(Hand, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_date"]

    def __str__(self):
        return f"{self.body}"
