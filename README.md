# Restish
A simple tiny angularjs provider for interacting with `REST` endpoints (though not required). That's why it's RESTish.. har har har. Ok, not funny. But keep reading for examples


# How's it work
It's pretty much a route manager that allows you to build url's and then execute http requests on those url's. All calls return $http promises. It makes no assumption about your data or forces you into any specific pattern to manage request responses and errors.


# Examples

```javascript

// Be sure to include in your module
angular
    .module('app', ['restish'])
    .config(config);

// Configurable provider properties
function config(RestishProvider){
    // Configure Restish to apply a http config object globally
    RestishProvider.defaults.$httpConfig = {
        xsrfHeaderName: 'johns-csrf'
    };

    // Prepends this path to all calls
    RestishProvider.defaults.basePath = '';

    // Strip training slashes
    RestishProvider.defaults.stripTrailingSlashes = true
}

// Say you're using a controller, just inject `Restish`
function SomeController(Restish){
    var user = new Restish('user');

    // `GET` request to `/user` without any params
    user.get().then(function(response){
        // Hey I'm the built-in response object found in $http!
        console.log(response);
    });

    // `POST` request to `/user` with data
    var userData = {id: 1, firstname: 'John'};
    user.post(userData).then(function(response){
        // Do stuff with response
    });

    // `PUT` request to `/user` with data
    // Note the use of a http config object. All calls allow you to pass in a $http 
    // config object to add/override any settings
    var moreUserData = {id: 2, firstname: 'John'};
    var config = {
        headers: {
            'x-restish': '12345'
        }
    };
    
    user.put(moreUserData, config).then(function(response){
        // Do stuff with response
    },
    
    // Remember, I'm a built-in promise so you have access to the error handler
    function(errResponse){

    });

    // Now let's start adding some stuff to the url path.
    // Every time you want to append to the url, use `route(path)`
    // `GET` request to `/user/admin`
    user.route('admin').get().then(function(){

    });

    // Id is an alias to route
    // `GET` request to `/user/1`
    user.id(1).get().then(function(){

    });

    // `GET` request to /user/admin/headhoncho`
    user.route('admin').route('headhoncho').get().then(function(response){

    });

    // You can also assign routes to variables
    var adminUsers = user.route('admin');

    // `POST` request to `/user/admin`
    adminUsers.post().then(function(response){

    });
}
```
