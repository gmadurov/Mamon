from django import forms

from backend.purchase.models import Purchase

class PurchaseForm(forms.Form):
    purchases = forms.ModelChoiceField(queryset=Purchase.objects.all())
