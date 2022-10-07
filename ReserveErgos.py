from http.client import responses
from pprint import pprint
import requests
import json
from datetime import datetime, timedelta
import os


def log_me_in(username, password):
    # username = "GMaduro"
    # password = "Tue1423525"
    credentials = json.dumps({"password": password, "username": username})
    login = requests.request(
        "POST",
        "https://api.esrtheta.nl/v2/login/",
        data=credentials,
        headers={"Accept": "*/*", "Content-Type": "application/json"},
    )
    # print(login.status_code)
    if login.status_code == 200:
        user = json.loads(login.text)
        return user
    return 0


def reserve(
    user,
    year,
    month,
    day,
    hour,
    minute,
    weeks,
    hoelang_uur,
    hoelang_minuten,
    reservables,
):
    ## niks aanpassen hieronder
    if len(reservables) * weeks > 1000:
        raise Exception("Je kan niet meer dan 1000 reservereings maken in een keer")

    try:
        with open(
            f'created_reservations_{datetime.now().strftime("%A-%d-%b")}.json', "r"
        ) as f:
            created_reservations = json.load(f)
    except:
        created_reservations = []

    print(pprint(created_reservations))

    if user != 0:
        for week in range(weeks):
            start_reservering = datetime(year, month, day, hour, minute) + timedelta(
                weeks=week
            )
            end_reservering = start_reservering + timedelta(
                hours=hoelang_uur, minutes=hoelang_minuten
            )

            for reservable in reservables:
                payload = json.dumps(
                    {
                        "begin_time": start_reservering.isoformat(),
                        "end_time": end_reservering.isoformat(),
                        "reservable": reservable,
                    }
                )
                response = requests.request(
                    "POST",
                    "https://api.esrtheta.nl/v2/reservations/",
                    data=payload,
                    headers={
                        "Accept": "*/*",
                        "Authorization": user["access_token"],
                        "Content-Type": "application/json",
                    },
                )

                data = json.loads(response.text)
                if response.status_code == 201:
                    created_reservations.append(data)
                    print(
                        f"Reservable {data['reservable']} is reserved from ({datetime.fromisoformat(data['begin_time']).strftime('%A %d %b, %H:%M:%S')}) until ({datetime.fromisoformat(data['end_time']).strftime('%A %d %b, %H:%M:%S')}) by {data['author']['name']}   "
                    )

                else:
                    print(
                        f"Reservable: {reservable}\nError code:{response.status_code}\nError Message:{data}\n\n"
                    )
                    print(start_reservering, end_reservering)

    else:
        print("couldnt log you in because", json.loads(login.text)["message"])
    if created_reservations:
        with open(
            f'created_reservations_{datetime.now().strftime("%A-%d-%b")}.json', "w"
        ) as f:
            file = json.dump(created_reservations, f)


def delete_all_my_reservations(user):
    with open(
        f'created_reservations_{datetime.now().strftime("%A-%d-%b")}.json', "r"
    ) as f:
        reservations = json.load(f)
    deleted = []
    for index, reservation in enumerate(reservations):
        response = requests.request(
            "DELETE",
            f"https://api.esrtheta.nl/v2/reservations/{reservation['id']}",
            headers={
                "Accept": "*/*",
                "Authorization": user["access_token"],
                "Content-Type": "application/json",
            },
        )
        if response.status_code == 200:
            print(f"Reservation {reservation['id']} deleted")
            deleted.append(index)
        else:
            print(f"Reservation {reservation['id']} not deleted")
    for i in sorted(deleted, reverse=True):
        print(i)
        reservations.pop(i)
    with open(
        f'created_reservations_{datetime.now().strftime("%A-%d-%b")}.json', "w"
    ) as f:
        json.dump(reservations, f)


def showReservables(user):
    reqUrl = "https://api.esrtheta.nl/v2/reservables/?page_size=90"
    headersList = {
        "Accept": "*/*",
        "Authorization": user["access_token"],
    }

    response = requests.request("GET", reqUrl, headers=headersList)

    created_reservations = json.loads(response.text)["results"]
    for i, reservable in enumerate(created_reservations):
        print(reservable["name"], reservable["id"])


if __name__ == "__main__":

    username = "GMaduro"
    password = "Tue1423525"

    year = 2022
    month = 10
    day = 7
    hour = 18
    minute = 00

    # for how many weeks you want to repeat the reserving
    # start of from the date described above
    weeks = 1

    # can be at least 1(>=1) and represents how long in hours you want to reserve
    hoelang_uur = 1
    # has to be 0 if you want to reserve for 1 hour
    hoelang_minuten = 30

    # list of ids of ergos you want to reserve
    reservables = [44, 43]

    user = log_me_in(username, password)

    # run this to reserve all the ergos u want
    # reserve(
    #     user,
    #     year,
    #     month,
    #     day,
    #     hour,
    #     minute,
    #     weeks,
    #     hoelang_uur,
    #     hoelang_minuten,
    #     reservables,
    # )

    # when you fuck it up, run this and if that doesnt work call Gustavo or wwwcie
    delete_all_my_reservations(user)

    # if you dont know which reservable ids you want to reserve run the follwoing
    # showReservables(user)
