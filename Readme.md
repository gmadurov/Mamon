Basic intro we user
react-native-paper as a theme
https://callstack.github.io/react-native-paper

## to develop locally

go to the the folder where you want to have the code and paste the following to clone the app and open it in vs code

```
git clone git@gitlab.com:esrtheta/Mamon.git
cd Mamon && code . -rm
```

open a terminal and type the following to initialise the docker application

```
docker-compose build
```

to start the docker application

```
docker-compose up
```

to load inital data run the following

```
docker-compose run web python manage.py loaddata starterDATA
```

# PIP environment I recomend not mixing the modules you need for webdev and the modules you normally use. For this I use a virtual enviroment(pipenv)

to install it just do

```
pip install pipenv
```

then to initialize it

```
pipenv install
```

if you want to install a module or modules from a file "requirements.txt"

```
pipenv install module
pipenv install -r requirements.txt
```

you can also add modules to that file by doing within the environement

```
pip freeze > requirements.txt
```

To use get a shell within the environement use

```
pipenv shell
```

to run something within the environement from outside
³²¡¤€¼½¾‘’¥äå

```
pipenv run [command]
```

To deactivate the environement and remove it

```
deactivate

pipenv --rm
```

Local development
put enviroment variables in .env file
use pipenv shell
this will load .env into the environment as the enviroment variables

there are a bunch of commands in the pipfile to help you

```
all
--- makemigrations
--- migrate
--- runserver
update
--- makemigrations
--- migrate
runserver
makemigrations
migrate
shell
collectStatic
start
launch
--- gunicorn core.wsgi --chdir backend  --log-file -
```

# expo

to initialize expo run the folowing commands

```shell
npm i -g expo-cli
expo login
```

to initialize the app run

```shell
npm install
npm start

```

# dokku

add remote to git repo

```
 git remote add metis metis:staging-mamon
```

op metis

````
 dokku apps:create staging-mamon
 dokku postgres:create staging-mamon-db -I 14
 dokku postgres:link staging-mamon-db staging-mamon --no-restart
```

set staging-mamon DATABASE_URL variaable to staging-mamon -db link

```
dokku domains:add staging-mamon "staging-mamon.esrtheta.nl"
dokku config:set staging-mamon <key>=<value>
mkdir /home/staging-mamon
dokku letsencrypt:enable staging-mamon
dokku ssh-keys:add key_name <KEY>

```

```
dokku docker-options:add staging-mamon deploy "-v /home/staging-mamon/database:/code/backend/database"
dokku docker-options:add staging-mamon deploy "-v /home/staging-mamon/staticfiles:/code/backend/staticfiles"
dokku docker-options:add staging-mamon deploy "-v /home/staging-mamon/mediafiles:/code/backend/mediafiles"
dokku docker-options:add staging-mamon run "-v /home/staging-mamon/database:/code/backend/database"
dokku docker-options:add staging-mamon run "-v /home/staging-mamon/staticfiles:/code/backend/staticfiles"
dokku docker-options:add staging-mamon run "-v /home/staging-mamon/mediafiles:/code/backend/mediafiles"

dokku config:unset --no-restart staging-mamon DOKKU_PROXY_PORT_MAP

 git push metis <branch>
dokku builder-dockerfile:set staging-mamon dockerfile-path backend/Dockerfile

dokku run staging-mamon python backend/manage.py migrate --noinput
```


# TypeScript

run ```npm tsc``` to test the types of the whole app
````
