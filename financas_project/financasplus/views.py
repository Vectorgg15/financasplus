from django.shortcuts import render
from django.http import HttpResponse

def sobre (request):
    html ='<html lang="pt-br"> <body> alo mundo </body> </html>'
    return HttpResponse (html)
# Create your views here.
