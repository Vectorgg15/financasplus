from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required

def register_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm_password')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Usuário já cadastrado! Faça login.')
            return redirect('login')

        if password != confirm_password:
            messages.error(request, 'As senhas não coincidem.')
            return render(request, 'register.html')

        User.objects.create_user(username=username, password=password)
        messages.success(request, 'Cadastro realizado com sucesso! Faça login.')
        return redirect('login')

    return render(request, 'register.html')

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('index')
        else:
            messages.error(request, 'Usuário ou senha inválidos.')
    return render(request, 'login.html')

@login_required(login_url='login')
def index_view(request):
    return render(request, 'index.html')

def logout_view(request):
    logout(request)
    return redirect('login')
