def test_user_can_post_hand(db, api_client, create_user, get_token):
    user = create_user(username="user")
    access = get_token(user)

    url = "/api/hands/"
    response = api_client.post(
        url,
        data={
            "author": user.id,
            "title": "Action movies",
            "description": "Some good action movies",
            "movies": [666, 667, 668, 669, 670],
            "tags": ["action"],
        },
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 201
    assert response.data["author"] == user.id
    assert response.data["description"] == "Some good action movies"


def test_user_can_delete_hand(db, api_client, create_user, get_token, hand_fixture):
    user = create_user(username="user")
    access = get_token(user)

    hand = hand_fixture(user)

    url = f"/api/hands/{str(hand.id)}/"

    response = api_client.delete(
        url,
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 204


def test_can_list_hands(db, api_client, create_user, hand_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand_fixture(user1)
    hand_fixture(user2)

    url = "/api/hands/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["author"] in [user1.id, user2.id]


def test_can_retrieve_hand(db, api_client, create_user, hand_fixture):
    user = create_user(username="user")

    hand = hand_fixture(user)

    url = f"/api/hands/{str(hand.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["author"] == user.id


def test_author_can_update_hand(db, api_client, create_user, get_token, hand_fixture):
    author = create_user(username="author")
    access = get_token(author)

    hand = hand_fixture(author)

    url = f"/api/hands/{str(hand.id)}/"
    response = api_client.put(
        url,
        data={
            "author": author.id,
            "title": "newtitle",
            "description": "newdesc",
            "movies": [800, 801, 802, 803, 804],
            "tags": ["newtag"],
        },
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 200
    assert response.data["description"] == "newdesc"
    assert response.data["title"] == "newtitle"


def test_user_cant_update_hand(db, api_client, create_user, get_token, hand_fixture):
    author = create_user(username="author")
    user = create_user(username="user")
    user_access = get_token(user)

    hand = hand_fixture(author)

    url = f"/api/hands/{str(hand.id)}/"
    response = api_client.put(
        url,
        data={
            "author": author.id,
            "title": "newtitle",
            "description": "newdesc",
            "movies": [800, 801, 802, 803, 804],
            "tags": ["newtag"],
        },
        HTTP_AUTHORIZATION=f"Bearer {user_access}",
    )

    assert response.status_code == 403


def test_unauth_cant_update_hand(db, api_client, create_user, hand_fixture):
    author = create_user(username="author")

    hand = hand_fixture(author)

    url = f"/api/hands/{str(hand.id)}/"
    response = api_client.put(
        url,
        data={
            "author": author.id,
            "title": "newtitle",
            "description": "newdesc",
            "movies": [800, 801, 802, 803, 804],
            "tags": ["newtag"],
        },
    )

    assert response.status_code == 401


def test_get_recent_hands(db, api_client, create_user, hand_fixture):
    user = create_user(username="user")

    hand1 = hand_fixture(user)
    hand2 = hand_fixture(user)
    hand3 = hand_fixture(user)

    url = "/api/hands/get_recent_hands/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 3
    assert response.data[0]["id"] == hand3.id
    assert response.data[1]["id"] == hand2.id
    assert response.data[2]["id"] == hand1.id


def test_get_hands_by_tag(db, api_client, create_user, hand_fixture):
    user = create_user(username="user")

    hand1 = hand_fixture(user, title="Horror movies", tags=["tag"])
    hand_fixture(user, title="Favorite movies")

    url = "/api/hands/get_hands_by_tag/tag/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["id"] == hand1.id


def test_get_hands_by_title(db, api_client, create_user, hand_fixture):
    user = create_user(username="user")

    hand1 = hand_fixture(user, title="Horror movies")
    hand2 = hand_fixture(user, title="Favorite movies")
    hand_fixture(user, title="title")

    url = "/api/hands/get_hands_by_title/movie/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["id"] in [hand1.id, hand2.id]


def test_get_hands_by_hand_tags(db, api_client, create_user, hand_fixture):
    user = create_user(username="user")

    hand1 = hand_fixture(user, tags=["action", "adventure"])
    hand2 = hand_fixture(user, tags=["adventure"])
    hand_fixture(user, tags=["tag"])

    url = f"/api/hands/get_hands_by_hand_tags/{str(hand1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["id"] in [hand1.id, hand2.id]


def test_get_user_hands_count(db, api_client, create_user, hand_fixture):
    user1 = create_user(username="user1")

    hand_fixture(user1)
    hand_fixture(user1)

    url = f"/api/hands/get_user_hands_count/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["hands"] == 2


def test_get_hands_by_user(db, api_client, create_user, hand_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand1 = hand_fixture(user1)
    hand_fixture(user2)

    url = f"/api/hands/get_hands_by_user/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["id"] == hand1.id


def test_get_hands_by_likes(
    db, api_client, create_user, hand_fixture, likedhand_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand_fixture(user1)
    hand2 = hand_fixture(user2)

    likedhand_fixture(hand2, user1)

    url = f"/api/hands/get_hands_by_likes/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["id"] == hand2.id


def test_get_hands_by_user_likes(
    db, api_client, create_user, hand_fixture, likedhand_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand_fixture(user1)
    hand2 = hand_fixture(user2)
    hand3 = hand_fixture(user2)

    likedhand_fixture(hand2, user1)

    url = f"/api/hands/get_hands_by_user_likes/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["id"] == hand3.id


def test_get_hands_by_user_follows(
    db, api_client, create_user, hand_fixture, follow_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand_fixture(user1)
    hand2 = hand_fixture(user2)
    hand3 = hand_fixture(user2)

    follow_fixture(user1, user2)

    url = f"/api/hands/get_hands_by_user_follows/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["id"] == hand3.id
    assert response.data[1]["id"] == hand2.id
