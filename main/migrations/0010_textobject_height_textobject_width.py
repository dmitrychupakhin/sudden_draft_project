# Generated by Django 4.2.7 on 2024-01-04 13:18

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0009_remove_textobject_height_remove_textobject_width"),
    ]

    operations = [
        migrations.AddField(
            model_name="textobject",
            name="height",
            field=models.IntegerField(default=50),
        ),
        migrations.AddField(
            model_name="textobject",
            name="width",
            field=models.IntegerField(default=250),
        ),
    ]
