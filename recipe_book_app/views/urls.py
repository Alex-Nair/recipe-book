from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name="main"),
    path('', views.main, name="recipes"),
    path('', views.main, name="stuff"),
    path('', views.main, name="signin"),
    path('', views.main, name="register")
]