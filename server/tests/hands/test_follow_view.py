def test_user_can_follow(db, api_client, create_user, get_token):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    access = get_token(user1)

    url = "/api/follows/"
    response = api_client.post(
        url,
        data={
            "author": user1.id,
            "followed": user2.id,
        },
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 201
    assert response.data["author"] == user1.id
    assert response.data["followed"] == user2.id


def test_user_cant_follow_twice(db, api_client, create_user, get_token, follow_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    access = get_token(user1)

    follow_fixture(user1, user2)

    url = "/api/follows/"
    response = api_client.post(
        url,
        data={
            "author": user1.id,
            "followed": user2.id,
        },
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 400


def test_user_can_unfollow(db, api_client, create_user, get_token, follow_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    follow = follow_fixture(user1, user2)

    access = get_token(user1)

    url = f"/api/follows/{str(follow.id)}/"
    response = api_client.delete(
        url,
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 204


def test_can_list_follow(db, api_client, create_user, follow_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    follow_fixture(user1, user2)
    follow_fixture(user2, user1)

    url = "/api/follows/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["author"] in [user1.id, user2.id]


def test_get_user_follows(db, api_client, create_user, follow_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    follow_fixture(user1, user2)
    follow_fixture(user1, user3)

    url = f"/api/follows/get_user_follows/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["followed"] in [user2.id, user3.id]


def test_get_user_followers(db, api_client, create_user, follow_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    follow_fixture(user2, user1)
    follow_fixture(user3, user1)

    url = f"/api/follows/get_user_followers/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["author"] in [user2.id, user3.id]
    assert response.data[0]["followed"] == user1.id


def test_get_user_follows_count(db, api_client, create_user, follow_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    follow_fixture(user1, user2)
    follow_fixture(user1, user3)

    url = f"/api/follows/get_user_follows_count/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["follows"] == 2


def test_get_user_followers_count(db, api_client, create_user, follow_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    follow_fixture(user2, user1)
    follow_fixture(user3, user1)

    url = f"/api/follows/get_user_followers_count/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["followers"] == 2


def test_is_user_followed_by_user(
    db, api_client, create_user, follow_fixture, likedhand_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    follow = follow_fixture(user2, user1)

    url = f"/api/follows/is_user_followed_by_user/"
    response = api_client.get(url, {"user1id": str(user2.id), "user2id": str(user1.id)})

    assert response.status_code == 200
    assert response.data["followed"] == True
    assert response.data["id"] == follow.id
