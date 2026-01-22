from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name="main"),
    path('', views.main, name="recipes"),

    path('stuff', views.stuff, name="stuff"),
    path('stuff/recipebook', views.stuff_recipebook, name="stuff/recipebook"),
    path('stuff/recipe', views.stuff_recipe, name="stuff/recipe"),
    path('stuff/shopping', views.stuff_shoppinglist, name="shopping"),

    path('signin', views.signin, name="signin"),
    path('register', views.register, name="register"),
    path('account', views.account, name="account")
]