from django.contrib.auth import get_user_model
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics, mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Comment, Follow, Hand, LikedHand, Profile
from .permissions import IsAuthorOrReadOnly
from .serializers import (
    CommentSerializer,
    FollowSerializer,
    HandSerializer,
    LikedHandSerializer,
    LogInSerializer,
    ProfileSerializer,
    UserSerializer,
)
from .utils import hand_image


class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer


class ProfileViewSet(
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_profiles_by_username/(?P<string>[\w\-]+)",
    )
    def get_profiles_by_username(self, request, string):
        users = get_user_model().objects.filter(username__icontains=string).values("id")
        profiles = Profile.objects.filter(id__in=users)
        serializer = ProfileSerializer(profiles, many=True)
        return Response(serializer.data)


class HandViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Hand.objects.all()
    serializer_class = HandSerializer

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hand_image/(?P<int>\w+)",
    )
    def get_hand_image(self, request, int):
        hand = get_object_or_404(Hand, pk=int)
        image = hand_image(hand)
        response = HttpResponse(content_type="image/png")
        image.save(response, "PNG")
        return response

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_recent_hands",
    )
    def get_recent_hands(self, request):
        recent_hands = Hand.objects.order_by("-created_date")
        serializer = HandSerializer(recent_hands, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hands_by_title/(?P<string>[\w\-]+)",
    )
    def get_hands_by_title(self, request, string):
        hands = Hand.objects.filter(title__icontains=string)
        serializer = HandSerializer(hands, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hands_by_tag/(?P<string>[\w\-]+)",
    )
    def get_hands_by_tag(self, request, string):
        hands = Hand.objects.filter(tags__icontains=string)
        serializer = HandSerializer(hands, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hands_by_hand_tags/(?P<int>\w+)",
    )
    def get_hands_by_hand_tags(self, request, int):
        hand = get_object_or_404(Hand, pk=int)
        hands = Hand.objects.filter(tags__overlap=hand.tags)
        serializer = HandSerializer(hands, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hands_by_user/(?P<int>\w+)",
    )
    def get_hands_by_user(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        hands = Hand.objects.filter(author=user).order_by("-created_date")
        serializer = HandSerializer(hands, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_user_hands_count/(?P<int>\w+)",
    )
    def get_user_hands_count(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        hands = Hand.objects.filter(author=user)
        data = {"hands": hands.count()}
        return Response(data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hands_by_likes/(?P<int>\w+)",
    )
    def get_hands_by_likes(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        liked_hands = LikedHand.objects.filter(author=user).values("hand")
        hands = Hand.objects.order_by("-created_date").filter(id__in=liked_hands)
        serializer = HandSerializer(hands, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hands_by_user_likes/(?P<int>\w+)",
    )
    def get_hands_by_user_likes(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        liked_hands = LikedHand.objects.filter(author=user).values("hand")
        author_ids = LikedHand.objects.filter(author=user).values("hand__author")
        hands = (
            Hand.objects.order_by("-created_date")
            .filter(author__in=author_ids)
            .exclude(id__in=liked_hands)
        )
        serializer = HandSerializer(hands, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hands_by_user_follows/(?P<int>\w+)",
    )
    def get_hands_by_user_follows(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        followed = Follow.objects.filter(author=user).values("followed")
        hands = Hand.objects.order_by("-created_date").filter(author__in=followed)
        serializer = HandSerializer(hands, many=True)
        return Response(serializer.data)


class FollowViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Follow.objects.all()
    serializer_class = FollowSerializer

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_user_follows/(?P<int>\w+)",
    )
    def get_user_follows(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        follows = Follow.objects.filter(author=user)
        serializer = FollowSerializer(follows, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_user_followers/(?P<int>\w+)",
    )
    def get_user_followers(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        follows = Follow.objects.filter(followed=user)
        serializer = FollowSerializer(follows, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_user_follows_count/(?P<int>\w+)",
    )
    def get_user_follows_count(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        follows = Follow.objects.filter(author=user)
        data = {"follows": follows.count()}
        return Response(data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_user_followers_count/(?P<int>\w+)",
    )
    def get_user_followers_count(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        followers = Follow.objects.filter(followed=user)
        data = {"followers": followers.count()}
        return Response(data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"is_user_followed_by_user",
    )
    def is_user_followed_by_user(self, request):
        user1 = get_object_or_404(get_user_model(), pk=request.GET.get("user1id"))
        user2 = get_object_or_404(get_user_model(), pk=request.GET.get("user2id"))
        follows = Follow.objects.filter(author=user1, followed=user2)
        if not follows:
            data = {"followed": False}
        else:
            data = {"followed": True, "id": follows.first().id}
        return Response(data)


class LikedHandViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = LikedHand.objects.all()
    serializer_class = LikedHandSerializer

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hand_likes/(?P<int>\w+)",
    )
    def get_hand_likes(self, request, int):
        hand = get_object_or_404(Hand, pk=int)
        likes = LikedHand.objects.filter(hand=hand)
        serializer = LikedHandSerializer(likes, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_user_likes/(?P<int>\w+)",
    )
    def get_user_likes(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        likes = LikedHand.objects.filter(author=user)
        serializer = LikedHandSerializer(likes, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hand_likes_count/(?P<int>\w+)",
    )
    def get_hand_likes_count(self, request, int):
        hand = get_object_or_404(Hand, pk=int)
        likes = LikedHand.objects.filter(hand=hand)
        data = {"likes": likes.count()}
        return Response(data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"is_hand_liked_by_user",
    )
    def is_hand_liked_by_user(self, request):
        hand = get_object_or_404(Hand, pk=request.GET.get("handid"))
        user = get_object_or_404(get_user_model(), pk=request.GET.get("userid"))
        likes = LikedHand.objects.filter(hand=hand, author=user)
        if not likes:
            data = {"liked": False}
        else:
            data = {"liked": True, "id": likes.first().id}
        return Response(data)


class CommentViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = (IsAuthorOrReadOnly,)
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hand_comments/(?P<int>\w+)",
    )
    def get_hand_comments(self, request, int):
        hand = get_object_or_404(Hand, pk=int)
        comments = Comment.objects.filter(hand=hand)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_user_comments/(?P<int>\w+)",
    )
    def get_user_comments(self, request, int):
        user = get_object_or_404(get_user_model(), pk=int)
        comments = Comment.objects.filter(author=user)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    @action(
        methods=["get"],
        detail=False,
        url_path=r"get_hand_comments_count/(?P<int>\w+)",
    )
    def get_hand_comments_count(self, request, int):
        hand = get_object_or_404(Hand, pk=int)
        comments = Comment.objects.filter(hand=hand)
        data = {"comments": comments.count()}
        return Response(data)
