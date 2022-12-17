def test_user_can_comment(db, api_client, create_user, get_token, hand_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    access = get_token(user1)

    hand = hand_fixture(user2)

    url = "/api/comments/"
    response = api_client.post(
        url,
        data={
            "body": "Nice hand !",
            "hand": hand.id,
            "author": user1.id,
        },
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 201
    assert response.data["author"] == user1.id
    assert response.data["hand"] == hand.id


def test_user_can_delete_comment(
    db, api_client, create_user, get_token, hand_fixture, comment_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    access = get_token(user1)

    hand = hand_fixture(user2)
    comment = comment_fixture(hand, user1)

    url = f"/api/comments/{str(comment.id)}/"

    response = api_client.delete(
        url,
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 204


def test_can_list_comments(db, api_client, create_user, hand_fixture, comment_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand1 = hand_fixture(user1)
    hand2 = hand_fixture(user2)

    comment_fixture(hand1, user2)
    comment_fixture(hand2, user1)

    url = "/api/comments/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["author"] in [user1.id, user2.id]


def test_get_hand_comments(db, api_client, create_user, hand_fixture, comment_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")
    user3 = create_user(username="user3")

    hand = hand_fixture(user1)

    comment_fixture(hand, user2)
    comment_fixture(hand, user3)

    url = f"/api/comments/get_hand_comments/{str(hand.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["author"] in [user2.id, user3.id]


def test_get_user_comments(db, api_client, create_user, hand_fixture, comment_fixture):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand = hand_fixture(user2)

    comment_fixture(hand, user1)
    comment_fixture(hand, user1)

    url = f"/api/comments/get_user_comments/{str(user1.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["hand"] == hand.id


def test_get_hand_comments_count(
    db, api_client, create_user, hand_fixture, comment_fixture
):
    user1 = create_user(username="user1")
    user2 = create_user(username="user2")

    hand = hand_fixture(user2)

    comment_fixture(hand, user1)
    comment_fixture(hand, user1)

    url = f"/api/comments/get_hand_comments_count/{str(hand.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["comments"] == 2
