Basic intro we user 
react-native-paper as a theme
https://callstack.github.io/react-native-paper 


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

``` shell
npm i -g expo-cli
expo login 
```
to initialize the app run 

``` shell
npm install 
npm start

```


# dokku

add remote to git repo

```
 git push metis <branch>
```

op metis

````
 dokku apps:create mamon
 dokku postgres:create mamon-db -I 14
 dokku postgres:link mamon-db mamon-db ```
````

set mamon DATABASE_URL variaable to mamon -db link

```
dokku config:set mamon <key>=<value>
mkdir /home/mamon/staticfiles
dokku storage:mount mamon /backend/staticfiles:/home/mamon/staticfiles
dokku letsencrypt:enable mamon
dokku ssh-keys:add key_name <KEY>

```
