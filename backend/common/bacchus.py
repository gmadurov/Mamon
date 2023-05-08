import datetime
import sys

if not sys.warnoptions:
    import warnings

    warnings.simplefilter("ignore")

tappers = [
    "Diederik Engelberts",
    "Hilde Lucassen",
    "Feut",
    "Maartje",
    "Iris",
    "Victoire",
    "Koen van Wesel",
    "Jelmar",
    "Britt",
    "Bestuur",
    "Paul van Asselt",
    "Famke Paulussen",
    "keuken",
    "Heleen",
    "Aniek",
]
products = {
    "Zak Paprika Chips €(1.6)": {"total": 1.6, "unit": 1},
    "Zak Naturel Chips €(1.6)": {"total": 1.6, "unit": 1},
    "PIN Schrappo €(10.0)": {"total": 10.0, "unit": 1},
    "ticket Zuip de tank leeg €(11.0)": {"total": 11.0, "unit": 1},
    "Zak Paprika Chips €(1.75)": {"total": 1.75, "unit": 1},
    "Zak Naturel Chips €(1.75)": {"total": 1.75, "unit": 1},
    "Koffiebeker Koffie €(0.2)": {"total": 0.2, "unit": 1},
    "Blixem pakje €(20.0)": {"total": 20.0, "unit": 1},
}
munten = {}
flessen = {
    "Fles Cava €(8.0)": {"total": 8.0, "unit": 1},
    "Fles Witte Wijn Les Garennes €(8.0)": {"total": 8.0, "unit": 1},
    "Fles Rosé Les Garennes €(8.0)": {"total": 8.0, "unit": 1},
    "Fles Rode Wijn Les Garennes €(8.0)": {"total": 8.0, "unit": 1},
    "Fles Rode Wijn Les Garennes €(8.5)": {"total": 8.5, "unit": 1},
    "Fles Cava €(8.75)": {"total": 8.75, "unit": 1},
    "Fles Witte Wijn Les Garennes €(8.5)": {"total": 8.5, "unit": 1},
    "Fles Rosé Les Garennes €(8.5)": {"total": 8.5, "unit": 1},
    "Fles SER Cava €(9.0)": {"total": 9.0, "unit": 1},
}
stukken = {
    "Stuk Mars €(0.6)": {"total": 0.6, "unit": 1},
    "Stuk Twix €(0.6)": {"total": 0.6, "unit": 1},
    "Stuk Plaatje €(2.0)": {"total": 2.0, "unit": 1},
    "Stuk Lampje €(6.0)": {"total": 6.0, "unit": 1},
    "Stuk 10/13 €(3.5)": {"total": 3.5, "unit": 1},
    "Stuk Speculaas Torondo €(0.3)": {"total": 0.3, "unit": 1},
    "Stuk Lion €(0.6)": {"total": 0.6, "unit": 1},
    "Stuk Gevuldekoek €(0.3)": {"total": 0.3, "unit": 1},
    "Stuk Snickers €(0.6)": {"total": 0.6, "unit": 1},
    "Stuk Stroopwafels €(0.6)": {"total": 0.6, "unit": 1},
    "Stuk Eiwitreep €(1.3)": {"total": 1.3, "unit": 1},
    "Stuk Appelkoek €(0.3)": {"total": 0.3, "unit": 1},
    "Stuk Compobroek €(31.2)": {"total": 31.2, "unit": 1},
    "Stuk Composhirt €(32.4)": {"total": 32.4, "unit": 1},
    "Stuk Lichtingstrui XLVIII €(20.95)": {"total": 20.95, "unit": 1},
    "Stuk Borg strokecoach €(40.0)": {"total": 40.0, "unit": 1},
    "Stuk Mars €(0.7)": {"total": 0.7, "unit": 1},
    "Stuk Lion €(0.7)": {"total": 0.7, "unit": 1},
    "Stuk Stroopwafels €(0.7)": {"total": 0.7, "unit": 1},
    "Stuk Speculaas Torondo €(0.35)": {"total": 0.35, "unit": 1},
    "Stuk Twix €(0.7)": {"total": 0.7, "unit": 1},
    "Stuk Snickers €(0.7)": {"total": 0.7, "unit": 1},
    "Stuk Borg sleutel €(40.0)": {"total": 40.0, "unit": 1},
    "Stuk Gevuldekoek €(0.35)": {"total": 0.35, "unit": 1},
    "Stuk Vlinderdas €(15.0)": {"total": 15.0, "unit": 1},
    "Stuk KitKat €(0.7)": {"total": 0.7, "unit": 1},
    "Stuk Kinder Bueno €(1.0)": {"total": 1.0, "unit": 1},
    "Stuk Appelkoek €(0.35)": {"total": 0.35, "unit": 1},
    "Stuk Theta das €(12.0)": {"total": 12.0, "unit": 1},
    "Stuk Wedstrijdpakje €(66.0)": {"total": 66.0, "unit": 1},
    "Stuk Borg coxbox €(40.0)": {"total": 40.0, "unit": 1},
    "Stuk Bretels €(28.0)": {"total": 28.0, "unit": 1},
    "Stuk Centurion Shotglas '19 €(12.0)": {"total": 12.0, "unit": 1},
}
bier = {
    "Glas Grolsch €(1.1)": {"total": 1.1, "unit": 0.25},
    "Pitcher Grolsch €(6.2)": {"total": 6.2, "unit": 1.8},
    "Paaltje Grolsch €(50.0)": {"total": 50.0, "unit": 15.0},
    "Fluitje Grolsch €(1.1)": {"total": 1.1, "unit": 0.2},
    "Fust Fust Grolsch €(150.0)": {"total": 150.0, "unit": 50},
    "Glas SER Grolsch €(1.5)": {"total": 1.5, "unit": 0.25},
}
glassen = {
    "Glas Cola €(0.6)": {"total": 0.6, "unit": 0.2},
    "Glas Icetea €(0.6)": {"total": 0.6, "unit": 0.2},
    "Glas Chocomelk €(0.9)": {"total": 0.9, "unit": 0.2},
    "Glas Sinas €(0.6)": {"total": 0.6, "unit": 0.2},
    "Glas Speciaalbier €(1.8)": {"total": 1.8, "unit": 0.2},
    "Glas Icetea €(0.7)": {"total": 0.7, "unit": 0.2},
    "Glas Sinas €(0.7)": {"total": 0.7, "unit": 0.2},
    "Glas Cola €(0.7)": {"total": 0.7, "unit": 0.2},
    "Glas Speciaalbier €(2.2)": {"total": 2.2, "unit": 0.2},
    "Glas Spa Rood €(0.7)": {"total": 0.7, "unit": 0.2},
    "Glas Shooters 5=6 €(5.0)": {"total": 5.0, "unit": 0.2},
    "Glas Shooters €(1.0)": {"total": 1.0, "unit": 0.2},
    "Glas Doos flugel €(27.48)": {"total": 27.48, "unit": 0.2},
}
happen = {
    "Hap €(3.5)": {"total": 3.5, "unit": 1},
    "AV hap €(7.0)": {"total": 7.0, "unit": 1},
    "Hap €(4.5)": {"total": 4.5, "unit": 1},
    "Hap €(3.75)": {"total": 3.75, "unit": 1},
}
import json
from purchase.models import Purchase, Order
from users.models import User, Personel, Holder
from inventory.models import Stock, Product

Stock.objects.all().delete()
Product.objects.all().delete()
Purchase.objects.all().delete()

st_bier = Stock.objects.create(name="Bier", units="liters", quantity=0)
st_munten = Stock.objects.create(name="Munten", units="stuk", quantity=0)

for key, val in munten.items():
    Product.objects.create(name=key, master_stock=st_munten, price=val["total"], units=val["unit"])


for key, val in bier.items():
    Product.objects.create(name=key, master_stock=st_bier, price=val["total"], units=val["unit"])


for key, val in products.items():
    Product.objects.create(name=key, price=val["total"], units=1)


for key, val in stukken.items():
    Product.objects.create(name=key, price=val["total"], units=1)


for key, val in flessen.items():
    Product.objects.create(name=key, price=val["total"], units=1)


for key, val in happen.items():
    Product.objects.create(name=key, price=val["total"], units=1)


for key, val in glassen.items():
    try:
        st = Stock.objects.filter(name__icontains=key.split()[1])[0]
    except:
        st = Stock.objects.get_or_create(name=key.split()[1], units="liters", quantity=0)[0]
    Product.objects.create(name=key, price=val["total"], units=val["unit"], master_stock=st)

for tapper in tappers:
    user = User.objects.get_or_create(username=tapper, first_name=tapper)[0]
    Personel.objects.get_or_create(user=user, nickname=tapper)

errors = {}
with open("common/orders.json") as f:
    orders = json.load(f)
    for purchase in orders:
        orderen = purchase.get("orders")
        try:
            personel = Personel.objects.get(nickname=purchase.get("tapper"))
        except:
            errors[purchase] = purchase.get("tapper") + "bestaat niet"
        try:
            if purchase.get("payment").lower() == "cash":
                holder = Holder.objects.get(user__first_name__icontains="Cash")
            elif purchase.get("payment").lower() == "pin":
                holder = Holder.objects.get(user__first_name__icontains="Pin")
            else:
                holder = Holder.objects.get(user__first_name__icontains="Bacchus")
        except:
            errors[purchase] = "Invalid purchase holder"
        add_orders = []
        for order in orderen:
            try:
                prod = Product.objects.get(name=order.get("product"))
                add_orders.append(Order.objects.get_or_create(product=prod, quantity=order.get("quantity"))[0])
            except:
                errors[purchase] = order.get("product") + " bestaat niet"
        pur = Purchase.objects.create(
            seller=personel,
            pin=purchase.get("payment").lower() == "pin",
            cash=purchase.get("payment").lower() == "cash",
            balance=purchase.get("payment").lower() == "outlayman id",
            created=purchase.get("date") ,
            buyer=holder,
        )
        pur.orders.set(add_orders)

with open("common/erros.json", "w") as f:
    json.dump(errors, f, indent=2)
