import pytest
from django.urls import reverse
from hands.models import Comment, Follow, Hand, LikedHand


@pytest.fixture
def api_client():
    from rest_framework.test import APIClient

    return APIClient()


@pytest.fixture
def test_password():
    return "strong-test-pass"


@pytest.fixture
def create_user(db, django_user_model, test_password):
    def make_user(**kwargs):
        kwargs["password"] = test_password
        if "username" not in kwargs:
            kwargs["username"] = "testuser"
        return django_user_model.objects.create_user(**kwargs)

    return make_user


@pytest.fixture
def get_token(db, api_client, test_password):
    def make_token(user):
        url = reverse("log_in")
        data = {
            "username": user.username,
            "password": test_password,
        }
        response = api_client.post(url, data=data)
        access = response.data["access"]
        return access

    return make_token


@pytest.fixture
def hand_fixture(db):
    def make_hand(
        user,
        title="Horror Movies",
        description="My favorite horror movies",
        movies=[550, 551, 552, 553, 554],
        tags=["horror", "scary"],
    ):
        return Hand.objects.create(
            author=user,
            title=title,
            description=description,
            movies=movies,
            tags=tags,
        )

    return make_hand


@pytest.fixture
def comment_fixture(db):
    def make_comment(hand, user, body="Nice movies !"):
        return Comment.objects.create(hand=hand, author=user, body=body)

    return make_comment


@pytest.fixture
def likedhand_fixture(db):
    def make_likedhand(hand, user):
        return LikedHand.objects.create(hand=hand, author=user)

    return make_likedhand


@pytest.fixture
def follow_fixture(db):
    def make_follow(user, followed):
        return Follow.objects.create(author=user, followed=followed)

    return make_follow
