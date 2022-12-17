# MovieHand
MovieHand is a social media platform for movie enthusiasts to share and discover films. It was built using Django and React and follows a test-driven development approach. The app features a modern user interface designed with Tailwind CSS and utilizes a Postgres database hosted on Heroku. MovieHand is deployed using Docker and Docker Compose, ensuring efficient scalability. With its Instagram-like experience, it's the perfect destination for discovering and sharing movies with the community.

## Features

- Leverages the tmdb api
- Post sets of 5 movies
- User profiles along with likes, follows and comments
- Explore page to find posts and users

## Stack

### Frontend :

- React fot the UI
- Tailwind for css styling
- Axios to fetch data
- Cypress for tests

### Backend : 

- Django and Django Rest Framework for REST apis
- JWT for authentication
- Pytests for tests

## Docker

Execute this command at the root to build the docker images:
```
$ docker-compose build
```

To run the containers:
```
$ docker-compose up -d
```

To bring down the containers:
```
$ docker-compose down
```

## Tests and code quality

Execute this command at the root to run the pytest tests with coverage:
```
$ docker-compose exec movies pytest -p no:warnings --cov=.
```

Which should print:
```
Name                      Stmts   Miss Branch BrPart  Cover
-----------------------------------------------------------
drf_project/__init__.py       0      0      0      0   100%
drf_project/views.py          0      0      0      0   100%
hands/__init__.py             0      0      0      0   100%
hands/admin.py               31      0     12      0   100%
hands/models.py              54      4      2      1    91%
hands/permissions.py          8      0      2      0   100%
hands/serializers.py         90     11     32     11    82%
hands/utils.py               44     27      8      2    37%
hands/views.py              182      7      4      2    95%
-----------------------------------------------------------
TOTAL                       409     49     60     16    85%
-----------------------------------------------------------
```

To lint code and sort python imports:
```
$ docker-compose exec movies black --exclude=migrations .
$ docker-compose exec movies isort .
```
