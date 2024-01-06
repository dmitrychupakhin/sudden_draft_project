from django.shortcuts import get_object_or_404, redirect, render

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
    if request.method == 'GET':
        draft = get_object_or_404(Draft, id=id)
        pictures = draft.get_pictures()
        text_object = TextObject.objects.create(
            x_position = 2,
            y_position = 4,
            draft=draft,
        )
        try:
            drawing = draft.drawn_object
            context = {
                'draft': draft,
                'picture_objects': pictures,
                'drawn_object': drawing,
                'text': TextEditorForm(instance=text_object)
            }
        except:
            context = {
                'draft': draft,
                'picture_objects': pictures,
                'text': TextEditorForm(instance=text_object)
            }   
        context['MEDIA_URL'] = settings.MEDIA_URL
        return render(request, 'main/draft_editor.html', context)
    else:
        print(request.POST)
        user = request.user
        drafts = Draft.objects.filter(users=user)
        context = {
            'MEDIA_URL': settings.MEDIA_URL,
            'drafts': drafts
        }
        return render(request, 'main/main.html',context)