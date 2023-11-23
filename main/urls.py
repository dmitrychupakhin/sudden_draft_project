from django.urls import path, include
from .views import *

urlpatterns = [
    path('', main, name='main'),
    path('new_draft', new_draft, name='new_draft')
]
