import os


def init_DB(db):
    from urllib.parse import urlparse

    splitted_url = urlparse(db)
    scheme = splitted_url.scheme
    name = splitted_url.path[1:]
    user, extra, port = splitted_url.netloc.split(":")
    password, host = extra.split("@")
    # print(f'''
    # Database info
    # {scheme: {scheme},
    # name: {name},
    # user: {user},
    # password: {password},
    # host: {host},
    # port: {port}}
    #  ''')
    return host, port, name, user, password
