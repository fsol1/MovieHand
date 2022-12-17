def test_user_can_like(db, api_client, create_user, get_token, hand_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    access = get_token(user1)

    hand = hand_fixture(user2)

    url = "/api/likes/"
    response = api_client.post(
        url,
        data={
            "author": user1.id,
            "hand": hand.id,
        },
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 201
    assert response.data["author"] == user1.id
    assert response.data["hand"] == hand.id


def test_user_can_unlike(
    db, api_client, create_user, get_token, hand_fixture, likedhand_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    access = get_token(user1)

    hand = hand_fixture(user2)
    like = likedhand_fixture(hand, user1)

    url = f"/api/likes/{str(like.id)}/"
    response = api_client.delete(
        url,
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 204


def test_can_list_likes(db, api_client, create_user, hand_fixture, likedhand_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand1 = hand_fixture(user1)
    hand2 = hand_fixture(user2)

    likedhand_fixture(hand1, user2)
    likedhand_fixture(hand2, user1)

    url = "/api/likes/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["author"] in [user1.id, user2.id]


def test_get_hand_likes(db, api_client, create_user, hand_fixture, likedhand_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    hand = hand_fixture(user1)

    likedhand_fixture(hand, user2)
    likedhand_fixture(hand, user3)

    url = f"/api/likes/get_hand_likes/{str(hand.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["author"] in [user2.id, user3.id]


def test_get_user_likes(db, api_client, create_user, hand_fixture, likedhand_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    hand1 = hand_fixture(user2)
    hand2 = hand_fixture(user3)

    likedhand_fixture(hand1, user1)
    likedhand_fixture(hand2, user1)

    url = f"/api/likes/get_user_likes/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["hand"] in [hand1.id, hand2.id]


def test_get_hand_likes_count(
    db, api_client, create_user, hand_fixture, likedhand_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    hand = hand_fixture(user1)

    likedhand_fixture(hand, user2)
    likedhand_fixture(hand, user3)

    url = f"/api/likes/get_hand_likes_count/{str(hand.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["likes"] == 2


def test_is_hand_liked_by_user(
    db, api_client, create_user, hand_fixture, likedhand_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand = hand_fixture(user1)

    like = likedhand_fixture(hand, user2)

    url = f"/api/likes/is_hand_liked_by_user/"
    response = api_client.get(url, {"handid": str(hand.id), "userid": str(user2.id)})

    assert response.status_code == 200
    assert response.data["liked"] == True
    assert response.data["id"] == like.id
