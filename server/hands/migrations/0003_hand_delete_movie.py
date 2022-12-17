# Generated by Django 4.1.2 on 2022-11-05 18:24

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("hands", "0002_movie"),
    ]

    operations = [
        migrations.CreateModel(
            name="Hand",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=50)),
                ("description", models.TextField()),
                (
                    "movies",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.IntegerField(), size=5
                    ),
                ),
                (
                    "tags",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(max_length=20), size=5
                    ),
                ),
                ("created_date", models.DateTimeField(auto_now_add=True)),
                ("updated_date", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.DeleteModel(
            name="Movie",
        ),
    ]
