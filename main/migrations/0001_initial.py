# Generated by Django 4.2.7 on 2023-11-24 19:35

from django.conf import settings
from django.db import migrations, models
import main.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PictureObject",
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
                ("name", models.CharField(default="layer", max_length=100)),
                (
                    "picture",
                    models.ImageField(
                        null=True, upload_to=main.models.get_picture_object_filepath
                    ),
                ),
                ("x_position", models.IntegerField()),
                ("y_position", models.IntegerField()),
                ("order", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="TextObject",
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
                ("name", models.CharField(default="layer", max_length=100)),
                ("content", models.TextField()),
                ("x_position", models.IntegerField()),
                ("y_position", models.IntegerField()),
                ("order", models.PositiveIntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name="Draft",
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
                ("name", models.CharField(max_length=100)),
                ("width", models.IntegerField(default=1920)),
                ("height", models.IntegerField(default=1080)),
                ("is_public", models.BooleanField(default=False)),
                (
                    "picture_objects",
                    models.ManyToManyField(
                        related_name="picture_objects", to="main.pictureobject"
                    ),
                ),
                (
                    "text_objects",
                    models.ManyToManyField(
                        related_name="text_objects", to="main.textobject"
                    ),
                ),
                (
                    "users",
                    models.ManyToManyField(
                        related_name="packages", to=settings.AUTH_USER_MODEL
                    ),
                ),
            ],
        ),
    ]