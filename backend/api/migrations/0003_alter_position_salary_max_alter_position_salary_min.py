# Generated by Django 4.2.11 on 2024-08-20 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_recruiter_client'),
    ]

    operations = [
        migrations.AlterField(
            model_name='position',
            name='salary_max',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AlterField(
            model_name='position',
            name='salary_min',
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True),
        ),
    ]
