from django_seed import Seed

from purchase.models import Category, Order, Product, Purchase, Report, Barcycle
from django.contrib.auth.models import User

from users.models import Holder, Personel

seeder = Seed.seeder()
#  random integers
seeder.add_entity(
    Product,
    20,
    {
        "name": lambda x: seeder.faker.name(),
        "price": lambda x: seeder.faker.random_int(min=1, max=100),
        "barcode": lambda x: seeder.faker.random_int(min=1, max=100),
        "category": lambda x: seeder.faker.random_int(min=1, max=100),
        "image": lambda x: seeder.faker.image_url(),
        "color": lambda x: seeder.faker.color_name(),
    },
)
seeder.add_entity(
    Category,
    10,
    {
        "name": lambda x: seeder.faker.name(),
        "description": lambda x: seeder.faker.sentence(),
    },
)
seeder.add_entity(
    Holder,
    10,
    {
        "name": lambda x: seeder.faker.name(),
        "balance": lambda x: seeder.faker.random_int(min=1, max=100),
        "password": lambda x: seeder.faker.password(),
        "email": lambda x: seeder.faker.email(),
        "username": lambda x: seeder.faker.name(),
    },
)
seeder.add_entity(
    Personel,
    10,
    {
        "name": lambda x: seeder.faker.name(),
        "password": lambda x: seeder.faker.password(),
        "email": lambda x: seeder.faker.email(),
        "username": lambda x: seeder.faker.name(),
    },
)
seeder.add_entity(
    Order,
    10,
    {
        "quantity": lambda x: seeder.faker.random_int(min=1, max=20),
        "product": lambda x: [hold for hold in Product.objects.all()][
            seeder.faker.random_int(min=1, max=len(Product.objects.all()))
        ],
    },
)
seeder = Seed.seeder()
seeder.add_entity(
    Purchase,
    10,
    {
        "buyer": [hold for hold in Holder.objects.all()][
            seeder.faker.random_int(min=1, max=len(Holder.objects.all()))
        ],
        "payed": lambda x: seeder.faker.boolean(),
        "orders": lambda x: Order.objects.order_by("?").first(),
    },
)


#  add entity purchase 
# seeder.add_entity(
#     Report,
#     10,
#     {
#         "date": lambda x: seeder.faker.date(),
#         "personel": lambda x: [hold for hold in Personel.objects.all()][
#             seeder.faker.random_int(min=1, max=len(Personel.objects.all()))
#         ],
#         "action": lambda x: seeder.faker.word(),
#     },
# )

# seed barcycle with opening_report and closing_report as oneToOne fields

seeder = Seed.seeder()
seeder.add_entity(
    Barcycle,
    10,
    {
        "opening_report": lambda x: [hold for hold in Report.objects.filter(action='Open')][
            seeder.faker.random_int(min=1, max=len(Report.objects.filter(action='Open')))
        ],
        "closing_report": lambda x: [hold for hold in Report.objects.filter(action='Closing')][
            seeder.faker.random_int(min=1, max=len(Report.objects.filter(action='Closing')))
        ],
    },
)

inserted_pks = seeder.execute()
