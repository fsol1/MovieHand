from hands.models import Profile


def test_profile_model(db, create_user):
    user = create_user()
    profile = Profile.objects.last()

    assert profile.author == user


def test_follow_model(db, create_user, follow_fixture):
    user = create_user()
    followed = create_user(username="followed")
    follow = follow_fixture(user, followed)

    assert follow.author == user
    assert follow.followed == followed


def test_hand_model(db, create_user, hand_fixture, comment_fixture):
    user = create_user()
    hand = hand_fixture(user)
    hand.save()

    assert hand.author == user
    assert hand.title == "Horror Movies"
    assert hand.description == "My favorite horror movies"
    assert hand.movies == [550, 551, 552, 553, 554]
    assert hand.tags == ["horror", "scary"]
    assert hand.created_date
    assert hand.updated_date
    assert str(hand) == hand.title


def test_comment_model(db, create_user, hand_fixture, comment_fixture):
    user = create_user()
    hand = hand_fixture(user)
    hand.save()
    comment = comment_fixture(hand, user)
    comment.save()

    assert comment.author == user
    assert comment.body == "Nice movies !"
    assert comment.hand == hand
    assert comment.created_date


def test_likedhand_model(db, create_user, hand_fixture, likedhand_fixture):
    user = create_user()
    hand = hand_fixture(user)
    hand.save()
    likedhand = likedhand_fixture(hand, user)
    likedhand.save()

    assert likedhand.author == user
    assert likedhand.hand == hand
    assert likedhand.liked_date
