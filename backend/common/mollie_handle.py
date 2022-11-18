from mollie.api.client import Client
from django.conf import settings

MOLLIE_API_KEY = settings.MOLLIE_API_KEY
MOLLIE_PARTNER_ID = settings.MOLLIE_PARTNER_ID
MOLLIE_PROFILE_ID = settings.MOLLIE_PROFILE_ID

mollie_client = Client()
mollie_client.set_api_key(MOLLIE_API_KEY)
payment = mollie_client.payments.create(
    {
        "amount": {"currency": "EUR", "value": "10.00"},
        "description": "My first API payment",
        "redirectUrl": "https://mamon.esrtheta.nl/order/12345/",
        "webhookUrl": "https://webshop.example.org/mollie-webhook/",
        "method": ["applepay", "creditcard", "ideal"],
        'metadata': [
            'wallet_opwarderen_id': 0,
        ]
    }
)

payment = mollie_client.payments.get(payment.id)

if payment.is_paid():
    print("Payment received.")

# payments = mollie_client.payments.list()
