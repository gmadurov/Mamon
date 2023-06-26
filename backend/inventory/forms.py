from django import forms

from purchase.models import Category, Purchase, Order, Product
from django.contrib.admin.widgets import FilteredSelectMultiple


class ProductForm(forms.ModelForm):
    color = forms.CharField(
        max_length=7,
        widget=forms.TextInput(
            attrs={
                "type": "color",
            }
        ),
    )
    price = forms.DecimalField(
        max_digits=6,
        decimal_places=2,
        widget=forms.NumberInput(attrs={"step": "0.05", "class": "input"}),
    )

    class Meta:
        model = Product
        fields = ["name", "price", "color", "active", "image"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "input"}),
            "image": forms.FileInput(attrs={"class": "file"}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        instance = getattr(self, "instance", None)
        if instance and instance.pk:
            self.fields["price"].widget.attrs["readonly"] = True
