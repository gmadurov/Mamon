Basic structure:

Purchases
    Producten 
        name price color active image 
    Cattegories
        Name, description, products(M2M)
    Purchases
        buyer, seller, payed, cash, pin, orders, remaining_after_purchase
    Orders
        product, quantity
    Report
        Action, date, personel, total_cash, flow_meter1, flow_meter2, comment

    BarCycle 
        opening_report, closing_report
        it also fetchs all the purchases and performs caluclations for everything that happens during the opening_report and closing_report



Users 
    Holder
        Django User, stand, ledenbase_id, image, image_ledenbase

    Peronnel
        Django User, nickname, image
    
    WalletUpgrade
        holder, seller, amount, refund, date, comment 
    Card
        holder, card_id, card_name

# App
The App is written in typescript with reactNative and uses expo for deployment. expo allows to run the app on devices without publication, used for development. The ap uses react native paper as a styling tool(same as we use bulma for the website)

## source (src)

screens: defines the user interface for screens in the app (what buttons, what information ect.)

navigation: defines what is displayed in the jor (left navigation bar), similar to url files in the backend

models: defines the database structure and (data) types of attributes for the application. 

components: defines smaller 'subscreens'/components that can be used in the screens. Can be seen as buildingblocks for screens.

context: defines the communication with the backend, and handles states and authentication. APIcontext and authcontext are the most relevant. API is used to get stuff from the backend. NFCcontext describes how to handle a scanned NFC chip.

assets and constants are self-explenatory

index file: the application is stored in the index file and runs the app function. be really careful changing this file, there is no real reason to do so. index also defines the reachability of pages within the app, thus providing security.

.gitignore are files that are not send to git, as they are local variables for example

App.js: is the landing page of the app, but redirects it to the index file (see app)

app.json: are the settings and version of the app, do not alter, expect of the version number

babel.config.js: don't change, standard reactnative document

eas.json: expo application services, defines the application structure. don't change, can be used for development purposes

package.json: describes a bit more about the app and defines dependencies (stuff thats needs to be downloaded to run the app), defnies reusable commands. defines the packages that are importes in the other node_modules.

package-lock.json: do not change!! more specific version of the package.json

tsconfig.json: the typescript configuration file, no real need to be changed unless you want the typescript settings to be changed.


# Backend
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


# Developing
What had been done?
development has been done django and reactnative, backend is done in functional django. (instead of class-based django (as the ledenbase is)).

1. backend
I started with the theory of the backend and built a stable version. then I started building the application.
New elements I first built in the backend, and when it was working i implemented it into the application.
Some files in the application folder are basic reactnative files, created by reactnative. everything in the source folder is self-created. in the backend the files are mainly generated but the content is self-made.

 <links>

 <links>


when you change models in the backend you have to run a migration that updates the database.

currently we use docker to create the database and run the backend locally, with the command:
```
docker-compose up
```
this starts the whole application for you.a

<list of commands>

if you have pipenv installed you can use the following commands:

```
pipenv run ...
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
```
other commands can be found in the pipfile

to run the application locally you need an android emulator.
<description of how to makean emulator>
You cannot test for IOS on windows, you need to be developing on Mac.

the data folder is not send to git and is a local database that can be used for development

```
docker-compose run web python manage.py loaddata <filename>
``` 

the docker-compose file defines how docker builds an application locally.
within the the backend there is a DOCKERFILE that builds the app in a container. (the environment where the app is created)
pipfile which is used for development without docker purely in Python, in a virtual environment.a

in the .env file you can define local or secret variables, that shouldn't be displayed in your code.

pipfile.lock: do not touch, specification of used packages in the project.