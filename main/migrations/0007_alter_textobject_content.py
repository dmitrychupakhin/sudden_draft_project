# Generated by Django 4.2.7 on 2024-01-03 08:59

import ckeditor.fields
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0006_pictureobject_height_pictureobject_rotate_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="textobject",
            name="content",
            field=ckeditor.fields.RichTextField(blank=True, null=True),
        ),
    ]
