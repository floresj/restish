(function(){
    "use strict";

    angular
        .module('restish', [])
        .provider('Restish', RestishProvider);

    /**
     * RestishProvider allows a configurable Restish object to be created. For endpoints that do not need to
     * have their trailing slashes stripped, set the RestishProvider.stripTrailingSlashes to true
     *
     * Provider defaults that can be configured:
     *
     *   stripTrailingSlashes: removes trailing slashes
     *   basePath: set the base path for every request.
     *   $httpConfig: an angular $http configuration that gets applied to all calls
     */
    function RestishProvider(){
        var provider = this;

        this.defaults = {
            stripTrailingSlashes: true,
            basePath: '',
            $httpConfig: {}
        };

        this.$get = ['$http', function($http){
            provider.defaults.basePath = provider.defaults.basePath.replace(/\/$/, "");

            function Route(route){
                // Set route for each instance
                this._route = route;

                Route.prototype.path = function(){
                    // If user enters full absolute http/https url, use that
                    if(this._route.indexOf('http') == 0){
                        return this._route;
                    }

                    var path = provider.defaults.basePath + '/' + this._route + '/';
                    if(provider.defaults.stripTrailingSlashes){
                        path = path.replace(/\/$/, "");
                    }
                    return path;
                };


                Route.prototype.get = function(params, config){
                    var req = { method: 'GET', url: this.path() };
                    config = angular.merge({},req, {params: params}, config, provider.defaults.$httpConfig);
                    return $http.get(this.path(), config);
                };

                Route.prototype.post = function(data, config){
                    var req = {method: 'POST', url: this.path()};
                    config = angular.extend({}, req, config, provider.defaults.$httpConfig);
                    return $http.post(this.path(), data, config);
                };

                Route.prototype.put = function(data, config){
                    var req = {method: 'PUT', url: this.path()};
                    config = angular.extend({}, req, config, provider.defaults.$httpConfig);
                    return $http.put(this.path(), data, config);
                };

                Route.prototype.route = function(r){
                    return new Route(this._route + '/' + r);
                };

                Route.prototype.id = Route.prototype.route;

                Route.prototype.clean = function(path){
                    return path.replace(/^\/|\/$/, "");
                };
                return this;
            }

            return function(route){
                return new Route(route);
            };
        }];

    }


})();

