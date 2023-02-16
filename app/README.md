# Application/ React Native app

## Structure

The App is written in typescript with reactNative and uses expo for deployment. expo allows to run the app on devices without publication, used for development. The ap uses react native paper as a styling tool(same as we use bulma for the website)

### Source (src) folder

#### Screens

defines the user interface for screens in the app (what buttons, what information ect.)

#### Navigation

defines what is displayed in the jor (left navigation bar), similar to url files in the backend

#### models

defines the database structure and (data) types of attributes for the application.

#### components

defines smaller 'subscreens'/components that can be used in the screens. Can be seen as buildingblocks for screens.

#### context

defines the communication with the backend, and handles states and authentication. APIcontext and authcontext are the most relevant. API is used to get stuff from the backend. NFCcontext describes how to handle a scanned NFC chip.

assets and constants are self-explenatory

### index file

the application is stored in the index file and runs the app function. be really careful changing this file, there is no real reason to do so. index also defines the reachability of pages within the app, thus providing security.

### .gitignore

files that are not send to git, as they are local variables for example

### App.js

the landing page of the app, but redirects it to the index file (see app)

### app.json

are the settings and version of the app, do not alter, expect of the version number

### babel.config.js

don't change, standard reactnative document

### eas.json

expo application services, defines the application structure. don't change, can be used for development purposes

### package.json

describes a bit more about the app and defines dependencies (stuff thats needs to be downloaded to run the app), defnies reusable commands. defines the packages that are importes in the other node_modules.

### package-lock.json

do not change!! more specific version of the package.json

### tsconfig.json

the typescript configuration file, no real need to be changed unless you want the typescript settings to be changed.

## Building the app for the app stores
Builds and submittions are handled by the CI/CD of Gitlab. This will happen every time that you merge into master and development. It will build the app and try to submit it to both the apple app store and the play store. From here you can set it into TestFlight or release it to the actuall store. (every time you release it to the actual store you have to update the version in the app.json store)


## Development for the app

You can install and use the app within ubuntu however that will not let you test it on real devices(something about how WSL accept request from the internet, it might get fixed in the future). You are able to test it using emulators on the computer, however the best would be to install it simply in windows or mac, not in a subsystem. this might mean that you have to have 2 copies of the repo on your computer but that is how it is. if you figure out a better way let me(gustavo) know and update this readme.


## Learning

Please feel free to look at the code to get an understanding of how it works. You will find [React](https://reactjs.org/) and [React Native](https://reactnative.dev/) to give you help with the structure.

## Styling

This app uses [React Native Paper](https://callstack.github.io/react-native-paper/index.html) as the main styling package. Refer to there documentation and application for help and ideas.

## Test and Deploy

The app is build in expo and submitted to the app stores every time something is commited to the master branch.

## Installation

To install and use this app you need to download android studio or X-Code(for mac) for local testing, installation is pretty self explanatory and can be found if you look those apps up. Second you run `npm install`. You dont have to install the expo cli as we will use `npx` which is a node package runner which allows us to run commands of packages you dont have downloaded.

## Usage

This app should not be used in WSL! If you do that you won't be able to connect your devices to it and will only be able to connect simulators on this computer. To start the application you run `npx expo start`. This will start the application with expo, there will be a qr code you can scan with your device to connect it to your instance of the app. If you are using windows you can only connect android devices, if you are using mac you can connect IOS devices and/or android devices. Alternatively, there is a url of the format `exp://192.111.1.11:19000` you can fill this in in the expo go app which you can use to develop apps on real and simulated devices.

```
cd app
npm i
npx expo start
```

## Contributing

If you commit to master it will release the CI/CD runner which builds the application and releases it to the app store, therefore we only do merge requests. that way be build the app only a few times with expo rather every time we commit something.\ 

So, if you want to add something you build it locally and create a branch with the title as the main thing you are adding. In this merge request you specify specifically what you are trying to do and how you are trying to do it if it is not self explanatory!

## App functionality

This section will define more about each of the modules used to develop the app.

### for local testing

use url = "http://10.0.2.2:8000" instead of localhost:8000
change LOCAL variable in the context/AuthContext.js file to true this is to be able to use the local environment within docker

### Navigation

The app navigation is controlled by React navigation. You have the Screens.Navigator elements which tells the app what component to link to what link. Then you have the drawer, which also does the same but at the same time shows the option to go into a page by clicking a link in the drawer. If are meant to be lead to a page and not be able to go to it directly you should keep in the Screens.Navigator and not the drawer.

```
app:
    Products (this one can go in the drawer)
        Product/id (this one shouldn't be in the drawer)
    Users  (this one can go in the drawer)
        User/id (this one shouldn't be in the drawer)
```

### Data/Context

Passing data trough context is the easiest way to handle state that I (Gustavo) could find in terms of complexity. The app is build to have the highest utility-to-simplity ratio possible so make sure that if you are doing something that people might not understand that you note and explain it properly.

Context is created using createContext((here you can put info about what you are passing through to have better auto-completion)). The provider is what actually passes the information around within the code. Passed on data and functions is only available in components that are wrapped in the provider. \

All the providers are wrapped around each othe in the FullContext.js file, which in turn is wrapped around everything else in the App.js file. meaning that all files should have access to everything you pass on throughout the app, provided you have wrapped everything properly.(All files expect for App.js have access to thing because )

### Screens

Similar to how the web works you have to have to provide an end-point for urls(as described above), the screens folder contains all those screens. The navigation should point to these screens and these screens alone and components should be used to be brought into the screens. This is due to standarization of React-Native(screens get different default props to components like {route, navigation}<-- (this is called [object-deconstrunction](https://tinyurl.com/7c4nfn92))

### how data is sent to the backend

#### Purchases

```
{
    buyer: member who bought the purchase ,
    payed: whether the amount is to be paid or simply to be logged(if paid by card or cash),
    seller: id of the person who sold it,
    orders: look at the order object bellow,
}
```

#### Orders

```
{
    quantity: int ,
    product: product.id
}
```

useless fact: to minimise the amount of datapoints in the back-end, all combinations of products and quantities that get sent to it get saved and reused instead of creating a new order object each time a combination is reused. 

The cart comprises out of a list of orders like the one above. Upon updating the cart content, only the quantity of the product get updated.(Meaning that a product is not just simply added but that only its quantity is updated)

... should add more things here but it is self explanatory tbh