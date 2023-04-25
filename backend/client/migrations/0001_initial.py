# Generated by Django 4.1 on 2023-03-23 13:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ClientApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('identifier', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('paths', models.TextField(verbose_name='paths')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='main_client_applications', to=settings.AUTH_USER_MODEL, verbose_name='client user')),
            ],
            options={
                'verbose_name': 'client applicatie',
                'verbose_name_plural': 'client applicaties',
            },
        ),
        migrations.CreateModel(
            name='Token',
            fields=[
                ('token', models.CharField(editable=False, max_length=40, primary_key=True, serialize=False, verbose_name='token')),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_application_tokens', to=settings.AUTH_USER_MODEL)),
                ('client_application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='account_tokens', to='client.clientapplication')),
            ],
            options={
                'verbose_name': 'Token',
                'verbose_name_plural': 'Tokens',
            },
        ),
        migrations.CreateModel(
            name='ClientApplicationAdministrator',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('client_application', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_application_administrators', to='client.clientapplication', verbose_name='client applicatie')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='client_applications', to=settings.AUTH_USER_MODEL, verbose_name='user')),
            ],
            options={
                'verbose_name': 'Administrator',
                'verbose_name_plural': 'Administrators',
            },
        ),
    ]
