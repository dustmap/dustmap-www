"use strict";

define(function(){
    
    function Cache(size) {
        this._maxSize = size || 100;

        this._keys = {};
        this._times = {};

        return this;
    };

    function deleteOld(){
        var time_keys = Object.keys(this._times).sort();

        while (time_keys.length > this._maxSize) {
            var time = time_keys.shift();
            var key = this._times[ time ];

            delete this._times[time];
            delete this._keys[key];
        }

        return this;
    };

    function keyToString(key){
        return ('string' == typeof key) ? key : JSON.stringify(key);
    }

    Cache.prototype.add = function(key, val){
        key = keyToString(key);

        if (this._keys[key])
            return this;

        this._keys[key] = val;
        this._times[ (new Date()).getTime() ] = key;

        return deleteOld.call(this);
    };

    Cache.prototype.get = function(key){
        key = keyToString();
        return this._keys[key];
    };

    Cache.prototype.has = function(key){
        key = keyToString();
        return this._keys.hasOwnProperty('key');
    };


    return Cache;
});