# Generated by Django 4.0 on 2022-10-05 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('purchase', '0012_rename_personel_report_personel_alter_report_comment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Barcycle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
    ]