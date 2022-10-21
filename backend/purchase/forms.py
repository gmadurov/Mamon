from django import forms

from backend.purchase.models import Purchase, Order,

class PurchaseForm(forms.Form):
    purchases = forms.ModelChoiceField(queryset=Purchase.objects.all())


