from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image


def create_photo_file():
    data = BytesIO()
    Image.new("RGB", (100, 100)).save(data, "PNG")
    data.seek(0)
    return SimpleUploadedFile("photo.png", data.getvalue())


def test_can_list_profile(db, api_client, create_user):
    create_user(username="user1")
    create_user(username="user2")

    url = "/api/profiles/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["username"] in ["user1", "user2"]


def test_can_retrieve_profile(db, api_client, create_user):
    user = create_user(username="user")

    url = f"/api/profiles/{str(user.id)}/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert response.data["username"] == "user"


def test_author_can_update_profile(db, api_client, create_user, get_token):
    author = create_user(username="author")
    access = get_token(author)
    photo = create_photo_file()

    url = f"/api/profiles/{str(author.id)}/"
    response = api_client.put(
        url,
        data={
            "photo": photo,
            "description": "newdesc",
            "favorite_movie": 650,
        },
        HTTP_AUTHORIZATION=f"Bearer {access}",
    )

    assert response.status_code == 200
    assert response.data["description"] == "newdesc"


def test_user_cant_update_profile(db, api_client, create_user, get_token):
    author = create_user(username="author")
    user = create_user(username="user")
    user_access = get_token(user)
    photo = create_photo_file()

    url = f"/api/profiles/{str(author.id)}/"
    response = api_client.put(
        url,
        data={
            "photo": photo,
            "description": "newdesc",
            "favorite_movie": 650,
        },
        HTTP_AUTHORIZATION=f"Bearer {user_access}",
    )

    assert response.status_code == 403


def test_unauth_cant_update_profile(db, api_client, create_user):
    author = create_user(username="author")
    photo = create_photo_file()

    url = f"/api/profiles/{str(author.id)}/"
    response = api_client.put(
        url,
        data={
            "photo": photo,
            "description": "newdesc",
            "favorite_movie": 650,
        },
    )

    assert response.status_code == 401


def test_get_profiles_by_username(db, api_client, create_user):
    user1 = create_user(username="Pierre")
    user2 = create_user(username="Jean-Pierre")
    user3 = create_user(username="user3")

    url = "/api/profiles/get_profiles_by_username/pierre/"
    response = api_client.get(url)

    assert response.status_code == 200
    assert len(response.data) == 2
    assert response.data[0]["id"] in [user1.id, user2.id]
    assert response.data[0]["username"] in [user1.username, user2.username]
