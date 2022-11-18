from django import forms

from .models import MolliePayments

class MolliePaymentsForm(forms.ModelForm):
    class Meta:
        model = MolliePayments
        fields = [
            "amount",
        ]
        
