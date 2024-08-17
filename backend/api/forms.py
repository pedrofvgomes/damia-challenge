from django import forms
from django.contrib.auth import authenticate

from .models import Account, Client, ACCOUNT_TYPE_CHOICES

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)
    user = None

    def clean(self):
        cleaned_data = super().clean()
        username = cleaned_data.get('username')
        password = cleaned_data.get('password')

        if username and password:
            self.user = authenticate(username=username, password=password)
            if self.user is None:
                raise forms.ValidationError('Invalid credentials')

        return cleaned_data

    def get_user(self):
        return self.user

class RegisterForm(forms.ModelForm):
    confirm_password = forms.CharField(widget=forms.PasswordInput)
    
    class Meta:
        model = Account
        fields = ['username', 'password']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        
        print(cleaned_data)

        if password and confirm_password and password != confirm_password:
            print('passwords do not match')
            raise forms.ValidationError('Passwords do not match')

        print('its cleaned')
        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data['password'])

        if commit:
            user.save()
            client = Client(account=user, name=None)  
            client.save()

        return user