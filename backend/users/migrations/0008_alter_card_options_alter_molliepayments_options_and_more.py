# Generated by Django 4.0 on 2022-11-23 03:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_molliepayments_payment_id'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='card',
            options={'verbose_name_plural': 'Carden'},
        ),
        migrations.AlterModelOptions(
            name='molliepayments',
            options={'verbose_name_plural': 'Mollie Payments'},
        ),
        migrations.AlterModelOptions(
            name='walletupgrades',
            options={'verbose_name': 'Wallet Upgrade', 'verbose_name_plural': 'Wallet Upgrades'},
        ),
    ]