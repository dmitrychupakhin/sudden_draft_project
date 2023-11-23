from django import forms
from .models import *

class NewDraftForm(forms.ModelForm):
    class Meta:
        model = Draft
        fields = ('name',)