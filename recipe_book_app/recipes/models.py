from django.contrib.auth.models import User
from django.db import models

# Create your models here.
class Recipe(models.Model):
    name = models.CharField(default="")
    description = models.CharField(default="")
    image = models.CharField(default="")
    isPublic = models.BooleanField()
    favourites = models.IntegerField()


class RecipeInrgedient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    name = models.CharField(default="")
    amount = models.IntegerField();


class RecipeStep(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    stepContent = models.CharField(default="")
    stepOrder = models.IntegerField()


class RecipeBook(models.Model):
    name = models.CharField(default="")
    description = models.CharField(default="")
    coverImage = models.CharField(default="")


class RecipeUserLink(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)

class RecipeBookLink(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    recipeBook = models.ForeignKey(RecipeBook, on_delete=models.CASCADE)

class ShoppingIngredient(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(default="")
    amount = models.IntegerField();