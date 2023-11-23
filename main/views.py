from django.shortcuts import render
from .forms import *

# Create your views here.

def main(request):
    return render(request, 'main/main.html')

def new_draft(request):
    return render(request, 'main/new_draft.html')
