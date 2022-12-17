import os
from io import BytesIO

import requests
from PIL import Image, ImageDraw

API_KEY = os.environ.get("TMDB_KEY")
BASE_URL = "https://api.themoviedb.org/3/"
MEDIA_BASE_URL = "https://image.tmdb.org/t/p/original"


def is_movie_valid(movie_id):
    url = BASE_URL + "movie/" + str(movie_id) + "?api_key=" + API_KEY
    response = requests.get(url=url)
    if response.json()["id"] != movie_id:
        return False
    return True


def has_duplicates(list):
    if len(list) == len(set(list)):
        return False
    return True


def get_movie_data(movie_ids):
    movie_list = []
    cover_list = []
    for i in range(5):
        url = BASE_URL + "movie/" + str(movie_ids[i]) + "?api_key=" + API_KEY
        response = requests.get(url=url)
        movie_list.append(response.json())
        url = MEDIA_BASE_URL + response.json()["poster_path"]
        response = requests.get(url=url)
        cover_list.append(response.content)
    return movie_list, cover_list


def hand_image(hand):
    size = (750, 1334)  # iphone SE screen size
    W, H = size
    cover_size = 220

    image = Image.new(mode="RGB", size=size, color=(153, 153, 255))

    draw = ImageDraw.Draw(image)
    w, h = draw.textsize(hand.title)
    draw.text(((W - w) / 2, 50), hand.title, fill="black")

    movie_list, cover_list = get_movie_data(hand.movies)
    for i in range(5):
        movie_cover = Image.open(BytesIO(cover_list[i]))
        movie_cover.thumbnail((cover_size, cover_size), Image.LANCZOS)
        draw.text(
            (75 + cover_size + 50, 120 + i * (cover_size + 25)),
            movie_list[i]["original_title"],
            fill="black",
        )
        draw.text(
            (75 + cover_size + 50, 130 + i * (cover_size + 25)),
            movie_list[i]["release_date"].split("-")[0],
            fill="black",
        )
        image.paste(movie_cover, (75, 90 + i * (cover_size + 25)))
    return image
