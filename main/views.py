from django.shortcuts import redirect, render

from sudden_draft_project import settings
from .forms import *

# Create your views here.

def main(request):
    user = request.user
    drafts = Draft.objects.filter(users=user)
    context = {
        'MEDIA_URL': settings.MEDIA_URL,
        'drafts': drafts
    }
    return render(request, 'main/main.html',context)

def new_draft(request):
    
    context = {}
    context['MEDIA_URL'] = settings.MEDIA_URL
    
    if request.method == 'POST':
        form = NewDraftForm(request.POST)
        if form.is_valid():
            draft = form.save()
            draft.users.add(request.user)
            return redirect('main')
        else:
            context['form'] = form
    else:
        form = NewDraftForm()
        context['form'] = form
    return render(request, 'main/new_draft.html', context)

def draft_editor(request, id):
    draft = Draft.objects.get(id=id)
    layers = draft.get_layers()
    context = {
        'draft': draft,
        'layers': layers
    }
    context['MEDIA_URL'] = settings.MEDIA_URL
    return render(request, 'main/draft_editor.html', context)