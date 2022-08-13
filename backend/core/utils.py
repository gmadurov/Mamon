import os


def init_DB():
    from urllib.parse import urlparse
    splitted_url = urlparse(os.environ.get('DATABASE_URL'))
    scheme = splitted_url.scheme
    name = splitted_url.path[1:]
    user, extra, port = splitted_url.netloc.split(':')
    password, host = extra.split('@')
    # print(f'''
    #         scheme: {scheme}
    #         name: {name}
    #         user: {user}
    #         password: {password}
    #         host: {host}
    #         port: {port}
    #  ''')
    return host, port, name, user, password