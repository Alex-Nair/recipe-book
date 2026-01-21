from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.template import loader
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User

# Create your views here.
def main(request):
    return render(request, "main.html")


def signin(request):
    if request.user.is_authenticated:
        return redirect("account")

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username = username, password = password)

        if user is not None:
            login(request, user)
            return redirect("/")
        else:
            return render(request, "signin.html", {
            "username": username,
            "password": "",
            "error": "Invalid username or password."
        })

    else:
        return render(request, "signin.html", {
            "username": "",
            "password": "",
            "error": ""
        })


def register(request):
    if request.user.is_authenticated:
        return redirect("account")
    
    if request.method == "POST":
        error = ""

        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        password_confirm = request.POST.get("password_confirm")

        if len(username) <= 3:
            error = "Username is too short."
        
        elif User.objects.filter(username = username).exists():
            error = "Username is taken."
        
        elif User.objects.filter(email = email).exists():
            error = "Email is taken."
        
        elif len(password) <= 3:
            error = "Password is too short."
        
        elif password != password_confirm:
            error = "Password confirmation doesn't match your original password."
        

        if error == "":
            User.objects.create_user(username=username, email=email, password=password)
            user = authenticate(request, username = username, password = password)

            if user is not None:
                login(request, user)
            
            return redirect("/")

        else:
            return render(request, "register.html", {
                "username": username,
                "email": email,
                "password": "",
                "password_confirm": "",
                "error": error
            })

    else:
        return render(request, "register.html", {
            "username": "",
            "email": "",
            "password": "",
            "password_confirm": "",
            "error": ""
        })


def account(request):
    if not request.user.is_authenticated:
        return redirect("signin")
    
    if request.method == "POST":
        if "logout" in request.POST:
            logout(request)
            return redirect("/")

        elif "delete" in request.POST:
            user = request.user
            logout(request)
            user.delete()
            return redirect("/")

        else:
            return render(request, "account.html", {
                "username": request.user.username,
                "email": request.user.email
            })

    else:
        return render(request, "account.html", {
            "username": request.user.username,
            "email": request.user.email
        })