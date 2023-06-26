from django import forms

from .models import ClientApplication


class ClientApplicationForm(forms.ModelForm):
    class Meta:
        model = ClientApplication
        fields = '__all__'

    def clean_paths(self):
        paths_list = self.cleaned_data['paths'].replace("\n","").replace("\r","").split(",")
        return ",\n".join([path.strip() for path in paths_list])
