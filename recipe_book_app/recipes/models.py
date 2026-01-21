from django.db import models

# Create your models here.
class Recipe(models.Model):
    name = models.CharField()
    description = models.CharField()
    isPublic = models.BooleanField()
    favourites = models.IntegerField()


class RecipeInrgedient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete = models.CASCADE)
    name = models.CharField()
    amount = models.IntegerField();


class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    stepContent = models.CharField()
    stepOrder = models.IntegerField()