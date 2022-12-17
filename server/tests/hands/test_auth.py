import base64
import json

from django.urls import reverse


def test_user_can_sign_up(db, api_client, django_user_model, test_password):
    url = reverse("sign_up")
    data = {
        "username": "user@example.com",
        "first_name": "Test",
        "last_name": "User",
        "password1": test_password,
        "password2": test_password,
    }
    response = api_client.post(url, data=data)
    user = django_user_model.objects.last()

    assert response.status_code == 201
    assert response.data["id"] == user.id
    assert response.data["first_name"] == user.first_name
    assert response.data["last_name"] == user.last_name
    assert response.data["username"] == user.username


def test_user_log_in(db, api_client, create_user, test_password):
    user = create_user()
    url = reverse("log_in")
    data = {
        "username": user.username,
        "password": test_password,
    }
    response = api_client.post(url, data=data)

    # Parse payload data from access token.
    access = response.data["access"]
    header, payload, signature = access.split(".")
    decoded_payload = base64.b64decode(f"{payload}==")
    payload_data = json.loads(decoded_payload)

    assert response.status_code == 200
    assert response.data["refresh"]
    assert payload_data["id"] == user.id
    assert payload_data["first_name"] == user.first_name
    assert payload_data["last_name"] == user.last_name
    assert payload_data["username"] == user.username
