define(['jquery'], function($){
    "use strict";

    //-----------------------------------------------------
    var ApiUrl = function(base){
        this._base = base;
        this._resource = '';
        this._method = 'GET';
        this._query = {};
        this._error = null;
        return this;
    };
    ApiUrl.prototype.run = function(){
        var self = this;
        var xhr = $.ajax({
            method : self._method ,
            data : self._query ,
            url : self._base + self._resource
        });
        if (this._error){
            xhr.error(this._error);
        }
        return xhr;
    };
    ApiUrl.prototype.resource = function(res){
        this._resource = res;
        return this;
    };
    ApiUrl.prototype.addQuery = function(key, val){
        this._query[key] = val;
        return this;
    };
    ApiUrl.prototype.error = function(err_handler){
        this._error = err_handler;
        return this;
    }   


    //-----------------------------------------------------
    var Api = function(conf){
        this._baseUrl = conf.api_url;
        this._errorHandler = null;
        return this; 
    };
    Api.prototype.errorHandler = function(cb){
        this._errorHandler = cb;
        return this;
    };
    Api.prototype.url = function(){
        var url = new ApiUrl(this._baseUrl);
        if (this._errorHandler) {
            url.error(this._errorHandler);
        }
        return url;
    };
    Api.prototype.getNodes = function(bbox, cb){
        var url = this.url().resource('nodes');
        if (bbox) {
            url.addQuery('bbox', bbox);
        }
        return url.run().done(cb);
    };


    //-----------------------------------------------------
    return Api;
});