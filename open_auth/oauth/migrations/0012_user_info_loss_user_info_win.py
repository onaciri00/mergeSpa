# Generated by Django 4.2.10 on 2024-12-02 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('oauth', '0011_remove_user_info_scoor_user_info_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_info',
            name='loss',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user_info',
            name='win',
            field=models.IntegerField(default=0),
        ),
    ]
