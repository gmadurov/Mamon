# A general description of the backend

The backend is written in Django (python), and hosted on the Thêta server. This is neccessary as person information is stored there.
In the backend you find the user and purchase maps. The backend website is accesible through the Thêta website. Uses bulma for styling

## Users

the admin file generates the default admin page from django. you are able to customize this. Permissions can be edited in this file. As well as read-only fields. Be careful editing this file. In the admin page on the website(Home › Authentication and Authorization › Users) you can add personnel, and give them the neccessary permissions.

the file apps should not be changed. it just describes how django works, and what links everything to the core.able

The core file: the ready function is used to send signals to trigger workflows.

signals file: runs functions when certain model instances are saved or deleted.

forms file: currently not in use

model file: creates the database tables described earlier in this document

tests file: currently not in use

urls file: what takes the url and trigger the function, this renders the website based on url

utils file: used for secondary functions, that can be used in other files

views file: functions in this file render the website

## Purchases

purchases is where all te overview functions are handled. Everyting within the backend that is used by bestuur or bar is handeled in this folder.

the file apps should not be changed. it just describes how django works, and what links everything to the core.able

The core file: the ready function is used to send signals to trigger workflows.

signals file: runs functions when certain model instances are saved or deleted.

forms file: currently not in use

model file: creates the database tables described earlier in this document

tests file: currently not in use

urls file: what takes the url and trigger the function, this renders the website based on url

utils file: used for secondary functions, that can be used in other files

views file: functions in this file render the website

## API

Api handles everything related to the api, meaning the communication between the app and backend.

authentication: handles all authentication settings (such as log-out time), be careful changing.

errors: not in use

serializers: standardizes api data send back to the app. If you want to send extra info you can put it in here

tokens: generates encryptes token used to login, used to 'sign' information

urls: 'roadmap' what takes the url and trigger the function, this returns the requested data to the app based on url

view files: generates the data that is requested and sends it to the serializer

## Core

There is no reason to be changed within the core folder.

## Client

The client folder is to be able to have longer lasting access token. This is used for communications with other websites. It is based an the code from the ledenbase, however, the main difference is that instead of given an anonimous user it returns a specific user for that client application.
A description of these files will not be given as you shoulnt be changing anything here!

It is also intersting to know that the django rest framework allows for multiple authentication classes which are defined in api/authentication.py under REST_FRAMEWORK under DEFAULT_AUTHENTICATION_CLASSES

## Structure of the models

- Purchases

  - Producten
    - name price color active image
  - Cattegories
    - Name, description, products(M2M)
  - Purchases
    - buyer, seller, balance, cash, pin, orders, remaining_after_purchase
  - Orders
    - product, quantity
  - Report
    - Action, date, personel, total_cash, flow_meter1, flow_meter2, comment
  - BarCycle
    - opening_report, closing_report
    - it also fetchs all the purchases and performs caluclations for everything that happens during the opening_report and closing_report

- Users
  - Holder
    - Django User, stand, ledenbase_id, image, image_ledenbase
  - Peronnel
    - Django User, nickname, image
  - WalletUpgrade
    - holder, personel, amount, refund, date, comment
  - Card
    - holder, card_id, card_name

# Developing for the backend

## to develop locally

get someone to make you a developer on the staging-ledenbase
go to staging-ledenbase and get the staging-ledenbase token from the client applications
[staging-ledenbase client applications](https://thetadev.esrtheta.nl/common/clientapplication/)

## Initializing the backend of Mamon

Open a terminal and type the following commands to initialise the docker application, create database tables and load inital data and start the Django app

```
docker-compose build
docker-compose run web python manage.py migrate && docker-compose run web python manage.py loaddata starterDATA
docker-compose up
```

## Intellisence

VS-code lets you chose which python enviroment you are working in, this enables Intellisence which can help with code autocompletion and finding erros.\
I would use PipEnv to do this as i think it has the best/easiest commands to learn to use. Follow the steps below to see how to install and initialize the pipenv virtual enviroment. This is only for backend/python environment, the reason VS-code doesnt automatically recognise the modules you've installed is that we use docker and the modules are installed in the docker container (which vs code doesnt have access to).

```
pip install pipenv          # sometimes doesn't work. depends on computer setting but you can figure this out.
pipenv install

```

If you want to install a module or modules from a file "requirements.txt" to your environment

```
pipenv install <module-
pipenv install -r requirements.txt
```

You can output all the modules that are installed your environment by running either of the following commands.

```
pip freeze -  requirements.txt
pipenv run freeze # this is something i made and the actuall command can be seen in the pipfile
```

If you want your terminal to be a shell within the environment you can start a shell within the virtualenvironment by running

```
pipenv shell
```

To run something within the environement from outside it

```
pipenv run [command]
```

To deactivate the environement and remove it

```
deactivate
pipenv --rm
```

## Extra PIPENV knowledge

If you can a `.env` file with your environment variables pipenv will load that when you make a shell or when you run `pipenv run [command]` (this has to be in the same folder as the pipfile for that environment)

Pipenv lets you define predetermined commandline functions in the pipfile under [scripts]. I have made some that i thought would be useful. You can look at the pipfile to understand what they do.

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
--- gunicorn core.wsgi --chdir backend --log-file -
```

# Deploying the website/backend using dokku

This will run through the steps to deploy this to metis

### Cloudfare

Log into cloudfare and add frontend to the list of subdomains are direct it towards metis

### Locally

Add remote to git repo

```
git remote add metis metis:frontend
```

Then we will have to do a couple of steps on the server before we can push the backend, but when we do this is the comman

```
git push metis master
```

### Metis server

First, we need to ssh into the server. (You should know how to do this, if you don't ask someone to explain to you how to do it)

We have to create the app and the databases it needs.

```
 dokku apps:create frontend
 dokku postgres:create frontend-db -I 14
 dokku postgres:link frontend-db frontend  --no-restart
```

Then we have to set a couple of things before the app is ready for deployment. First we set up the domain that the app has to respond to, then add the enviroment variables. Mamon requires the following environment variables: DATABASE_URL, DEBUG, JWT_KEY, LEDENBASE_TOKEN, LEDENBASE_URL, MOLLIE_API_KEY, SECRET_KEY. Then we create a folder to save everything that the app needs to save, we encrypt the website(allows https instead of http)

```
dokku domains:add frontend  "frontend .esrtheta.nl"
dokku config:set frontend  <key- =<value-  --no-restart
# or
dokku config:set frontend  <key- =<value-  <key- =<value- .... --no-restart
mkdir /home/frontend
dokku letsencrypt:enable frontend
```

We are releasing the app with docker so we need to enable a couple of things for the app to be able to serve static files and for the app to be deployed with Docker instead of the default buildpack way.

```
dokku docker-options:add frontend  deploy "-v /home/frontend /database:/code/backend/database"
dokku docker-options:add frontend  deploy "-v /home/frontend /staticfiles:/code/backend/staticfiles"
dokku docker-options:add frontend  deploy "-v /home/frontend /mediafiles:/code/backend/mediafiles"
dokku docker-options:add frontend  run "-v /home/frontend /database:/code/backend/database"
dokku docker-options:add frontend  run "-v /home/frontend /staticfiles:/code/backend/staticfiles"
dokku docker-options:add frontend  run "-v /home/frontend /mediafiles:/code/backend/mediafiles"
dokku config:unset frontend  DOKKU_PROXY_PORT_MAP --no-restart
dokku builder-dockerfile:set frontend  dockerfile-path backend/Dockerfile
```

We push the application from our computer using the command I specified earlier and once that is done we migrate the application to make sure it is able to comunicate with the backend(this command is only for django)

```
dokku run frontend  python backend/manage.py migrate --noinput
```

Once the app has been deployed to the server you can deploy it using GitLab's CI/CD

# CI/CD

GitLabs CI/CD handles testing and deploying the backend to metis. It will test and deploy the website to `mamon.esrtheta.nl` everytime something is merged to master and will deploy to `staging-mamon.esrtheta.nl` everytime something is merged to development, if there is change within the backend folder. Look at the .gitlab-ci.yml file to see how it happens.

## UML Graph

![MamonUML](MamonUML.png)