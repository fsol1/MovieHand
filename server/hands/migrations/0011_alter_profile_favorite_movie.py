# Generated by Django 4.1.2 on 2022-11-13 22:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("hands", "0010_alter_profile_favorite_movie"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="favorite_movie",
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
