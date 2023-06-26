from django import forms

from .models import MolliePayments, Personel


class MolliePaymentsForm(forms.ModelForm):
    class Meta:
        model = MolliePayments
        fields = [
            "amount",
        ]


class PersonelForm(forms.ModelForm):
    image = forms.ImageField(required=False, widget=forms.FileInput(attrs={"class": "file"}))
    nickname = forms.CharField(max_length=50, widget=forms.TextInput(attrs={"class": "input"}))
    active = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "checkbox"}))

    class Meta:
        model = Personel
        fields = ["active", "nickname", "image"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["nickname"].label = "Nickname"
        self.fields["active"].label = "Active"
        self.fields["image"].label = "Image"
