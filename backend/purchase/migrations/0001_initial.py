# Generated by Django 4.0 on 2022-11-06 23:58

import colorfield.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Barcycle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'ordering': ['-opening_report__date'],
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, unique=True)),
                ('price', models.FloatField(default=0)),
                ('color', colorfield.fields.ColorField(default='#ffdd00', image_field=None, max_length=18, samples=None)),
                ('image', models.ImageField(blank=True, default='products/default.png', null=True, upload_to='products/')),
            ],
        ),
        migrations.CreateModel(
            name='Purchase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('payed', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('remaining_after_purchase', models.FloatField(default=0)),
            ],
            options={
                'ordering': ['-created'],
            },
        ),
        migrations.CreateModel(
            name='Report',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('action', models.CharField(choices=[('Open', 'Open'), ('Close', 'Close'), ('Middle', 'Middle')], max_length=50, verbose_name='action')),
                ('total_cash', models.FloatField(verbose_name='total Cash')),
                ('flow_meter1', models.IntegerField(verbose_name='flow meter 1')),
                ('flow_meter2', models.IntegerField(verbose_name='flow meter 2')),
                ('comment', models.TextField(blank=True, null=True, verbose_name='comment')),
            ],
        ),
    ]
