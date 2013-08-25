define(function(){
    "use strict";
    
    function Cache(size) {
        this._maxSize = size || 100;

        this._data = {};
        this._keys = [];

        return this;
    };

    function keyToString(key){
        return ('string' == typeof key) ? key : JSON.stringify(key);
    }

    function deleteOld() {
        while (this._keys.length > this._maxSize) {
            var key = this._keys.shift();
            delete this._data[key];
        }
        return this;
    }

    Cache.prototype.add = function(key, val){
        key = keyToString(key);

        if (this.has(key)){
            this._keys.splice( this._keys.indexOf(key), 1 );
        }
        
        this._data[key] = val;
        this._keys.push(key);

        return deleteOld.call(this);
    };

    Cache.prototype.get = function(key){
        key = keyToString(key);
        return this._data[key];
    };

    Cache.prototype.has = function(key){
        key = keyToString(key);
        return this._data.hasOwnProperty(key);
    };


    return Cache;
});