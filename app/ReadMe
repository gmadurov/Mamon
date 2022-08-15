### for local testing

use url = "http://10.0.2.2:8000" instead of localhost:8000
change LOCAL variable in the context/AuthContext.js file to true

## Intro

### Navigation

The app navigation is controlled by React navigation. You have the Screens.Navigator elements which tells the app what component to link to what link. Then you have the drawer, which also does the same but at the same time shows the option to go into a page by clicking a link in the drawer. If are meant to be lead to a page and not be able to go to it directly you should keep in the Screens.Navigator and not the drawer.

eg

```
app:
    Products (this one can go in the drawer)
        Product/id (this one shouldn't be in the drawer)
    Users  (this one can go in the drawer)
        User/id (this one shouldn't be in the drawer)
```

### Data/Context

Passing data trough context is the easiest way to handle state that I (Gustavo) could find in terms of complexity. The app is build to have the highest utility-to-simplity ratio possible so make sure that if you are doing something that people might not understand that you note and explain it properly.

Context is created using createContext((here you can put info about what you are passing through to have better auto-completion)). The provider is what actually passes the information around within the code. Passed on data and functions is only available in components that are wrapped in the provider.
All the providers are wrapped around each othe in the FullContext.js file, which in turn is wrapped around everything else in the App.js file. meaning that all files should have access to everything you pass on throughout the app, provided you have wrapped everything properly.(All files expect for App.js have access to thing because )

### Screens

Similar to how the web works you have to have to provide an end-point for urls(as described above), the screens folder contains all those screens. The navigation should point to these screens and these screens alone and components should be used to be brought into the screens. This is due to standarization of React-Native(screens get different default props to components like {route, navigation}<= (this is called object-deconstrunction => https://tinyurl.com/7c4nfn92))

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

useless fact: to minimise the amount of datapoints in the back-end, all combinations of products and quantities that get sent to it get saved and reused instead of creating a new order object each time a combination is reused

The cart comprises out of a list of orders like the one above. Upon updating the cart content, only the quantity of the product get updated.(Meaning that a product is not just simply added but that only its quantity is updated)
