from django.shortcuts import render
from .forms import *
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy
from django.contrib.auth import logout, login
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib.auth.views import LoginView

class RegistrationUser(CreateView):
    form_class = RegisterUserForm
    template_name = 'account/register.html'
    success_url = reverse_lazy('main')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form(self.form_class)
        return context
    
    def get_success_url(self):
        return reverse_lazy('login')

class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'account/login.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = self.get_form(self.form_class)
        return context
    
    def get_success_url(self):
        return reverse_lazy('main')
    
def logout_view(request):
    logout(request)
    return redirect('login')

def profile(request):
    user = request.user
    context = {}
    if request.method == 'POST':
        form = AccountUpdateForm(request.POST, request.FILES, instance=request.user, request=request)
        if form.is_valid():
            form.save()
            return redirect('account')
        else:
            form = AccountUpdateForm(request.POST, instance=request.user,
				initial={
					"id": user.pk,
					"email": user.email, 
					"username": user.username,
					"profile_picture": user.profile_picture,
				}
			)
            context['form'] = form
    else:
        form = AccountUpdateForm(
			initial={
					"id": user.pk,
					"email": user.email, 
					"username": user.username,
					"profile_picture": user.profile_picture,
				}
			)
        context['form'] = form
        context['MEDIA_URL'] = settings.MEDIA_URL
    return render(request=request, template_name='account/account.html', context=context)

class AccountUpdateForm(forms.ModelForm):

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(AccountUpdateForm, self).__init__(*args, **kwargs)
    
    current_password = forms.CharField(label='Current Password', widget=forms.PasswordInput, required=False)
    new_password = forms.CharField(label='New Password', widget=forms.PasswordInput, required=False)
    confirm_new_password = forms.CharField(label='Confirm New Password', widget=forms.PasswordInput, required=False)
    
    class Meta:
        model = SuddenDraftUser
        fields = ('username', 'email', 'profile_picture')

    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        try:
            account = SuddenDraftUser.objects.exclude(pk=self.instance.pk).get(email=email)
        except SuddenDraftUser.DoesNotExist:
            return email
        raise forms.ValidationError('Email "%s" is already in use.' % account)

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            account = SuddenDraftUser.objects.exclude(pk=self.instance.pk).get(username=username)
        except SuddenDraftUser.DoesNotExist:
            return username
        raise forms.ValidationError('Username "%s" is already in use.' % username)
    
    def clean(self):
        cleaned_data = super().clean()
        current_password = cleaned_data.get("current_password")
        new_password = cleaned_data.get("new_password")
        confirm_new_password = cleaned_data.get("confirm_new_password")

        if new_password and new_password != confirm_new_password:
            self.add_error('confirm_new_password', "Passwords do not match.")
        if current_password and not self.instance.check_password(current_password):
            self.add_error('current_password', "Incorrect current password.")

        return cleaned_data
    
    def save(self, commit=True):
        account = super(AccountUpdateForm, self).save(commit=False)
        account.username = self.cleaned_data['username']
        account.email = self.cleaned_data['email'].lower()
        account.profile_picture = self.cleaned_data['profile_picture']
        
        new_password = self.cleaned_data.get('new_password')
        if new_password:
            account.set_password(new_password)
            account.save()
            update_session_auth_hash(self.request, account)
        
        if commit:
            account.save()
        return account