# Generated by Django 4.2.7 on 2024-01-04 11:55

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0008_textobject_height_textobject_width_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="textobject",
            name="height",
        ),
        migrations.RemoveField(
            model_name="textobject",
            name="width",
        ),
    ]