# Generated by Django 5.0.4 on 2024-06-26 14:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("drugs", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="disease",
            options={"ordering": ["doid"]},
        ),
        migrations.AlterModelOptions(
            name="diseaseindication",
            options={"ordering": ["chembl_id"]},
        ),
        migrations.AlterModelOptions(
            name="drugdiseaseprobability",
            options={"ordering": ["drug", "disease"]},
        ),
        migrations.AlterModelOptions(
            name="mechanismofaction",
            options={"ordering": ["chembl_id"]},
        ),
        migrations.AlterModelOptions(
            name="metapathprediction",
            options={"ordering": ["-percent_of_prediction"]},
        ),
        migrations.AlterModelOptions(
            name="pathprediction",
            options={"ordering": ["-percent_of_prediction"]},
        ),
        migrations.AlterModelOptions(
            name="sourceedgeprediction",
            options={"ordering": ["-percent_of_prediction"]},
        ),
        migrations.AlterModelOptions(
            name="targetedgeprediction",
            options={"ordering": ["-percent_of_prediction"]},
        ),
        migrations.AlterField(
            model_name="disease",
            name="name",
            field=models.CharField(blank=True, db_index=True, max_length=200),
        ),
        migrations.AlterField(
            model_name="drug",
            name="name",
            field=models.CharField(db_index=True, max_length=200),
        ),
    ]