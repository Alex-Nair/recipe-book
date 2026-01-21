from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name="main"),
    path('', views.main, name="recipes"),
    path('', views.main, name="stuff"),
    path('signin', views.signin, name="signin"),
    path('register', views.register, name="register"),
    path('account', views.account, name="account")
]