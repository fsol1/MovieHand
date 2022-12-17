# MovieHand - A Social Media Platform for Movie Enthusiasts
MovieHand is a social media platform for movie enthusiasts to share and discover films. It was built using Django and React and follows a test-driven development approach. The app features a modern user interface designed with Tailwind CSS and utilizes a Postgres database hosted on Heroku. MovieHand is deployed using Docker and Docker Compose, ensuring efficient scalability. With its Instagram-like experience, it's the perfect destination for discovering and sharing movies with the community.

**Note:** The production code may differ slightly from the codebase provided here. In order for the app to work properly, API keys must be set in certain files.

**Note:** If you don't want to sign up (login: testuser, password: test123').

## Key Features

- Leverages the TMDB API to provide a rich selection of movies to share and discover
- Allows users to create posts of sets of 5 movies
- Features user profiles with likes, follows, and comments
- Explore page for finding new posts and users to follow

## Technology Stack

### Frontend :

- React for building the user interface
- Tailwind CSS for styling
- Axios for fetching data from the backend API
- Cypress for testing

### Backend : 

- Django and Django Rest Framework for building REST APIs
- JWT for authentication
- Pytest for testing

## Docker Usage

To build the Docker images, run the following command at the root of the project:
```
$ docker-compose build
```

To start the containers, run:
```
$ docker-compose up -d
```

To bring down the containers:
```
$ docker-compose down
```

## Testing and code quality

To run the Pytest tests with coverage, execute the following command at the root of the project:
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

To lint the code and sort Python imports, run:
```
$ docker-compose exec movies black --exclude=migrations .
$ docker-compose exec movies isort .
```
