from django import forms
from .models import *

class NewDraftForm(forms.ModelForm):
    class Meta:
        model = Draft
        fields = ('name',)
        
class NewDraftForm(forms.ModelForm):
    class Meta:
        model = Draft
        fields = ('name', 'is_public')
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Название'}),
            'is_public': forms.CheckboxInput,
        }

class TextEditorForm(forms.ModelForm):
    class Meta:
        model = TextObject
        fields = ('content',)