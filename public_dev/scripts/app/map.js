"use strict";

define(['leaflet', 'jquery', 'async', 'helper/cache', 'cookie'], function(L, $, async, Cache){

    L.Icon.Default.imagePath = '/vendor/leaflet/images';

    var Map = function(conf, api){
        var self = this;

        self._cookie_name = 'dustmap_map_cookie';

        self.api = api;
        self._selector = conf.map_selector;
        self.$map = $(this._selector);
        self.map = undefined;

        self._nodeCache = new Cache(100);

        self.handleHeight().create().setInitialView(function(){
            self.viewToCookie(true);
        });

        return this;
    };

    Map.prototype.handleHeight = function(){
        var $win = $(window);
        var $map = this.$map;

        function setHeight() {
            var map_height = $win.height() - 150;
            $map.height(map_height);
        };

        $win.on('resize', setHeight);
        setHeight();
        return this;
    };
    
    Map.prototype.create = function(){
        var map = L.map(this.$map.get(0));

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        this.map = map;
        return this;
    };
    
    Map.prototype.setViewFromCookie = function(cb) {
        if (navigator.cookieEnabled) {
            var data;
            try {
                var data = JSON.parse( $.cookie(this._cookie_name) );
                this.map.setView([data.lat, data.lon], data.zoom);
                cb(null, data);
            } catch (e) {
                cb(e);
            }
        } else {
            cb(new Error('no cookie support'));
        }
        return this;
    };
    
    Map.prototype.setViewFromFallback = function(cb){
        this.map.setView([47.063570301222924, 15.451862812042236], 16);
        cb(null);
        return this;
    };
    
    Map.prototype.setViewFromBrowserApi = function(cb){
        if (navigator.geolocation) {
            this.map.on('locationerror', cb.bind(null));
            this.map.on('locationfound', cb.bind(null, null));
            this.map.locate({setView : true});
        } else {
            cb(new Error('no geolocation in this browser'));
        }
        return this;
    };
    
    Map.prototype.setViewFromAjax = function(cb, url){
        url = url || '//freegeoip.net/json/';
        var self = this;

        $.getJSON(url)
            .done(function(data){
                self.map.setView([data.latitude, data.longitude], 13);
                cb(null, data);
            })
            .error( cb.bind(null) )
        ;
        return this;
    }
    
    Map.prototype.viewToCookie = function(enable){
        if (! navigator.cookieEnabled)
            throw new Error('no cookie support')

        var self = this;
        var events = [ 'zoomend', 'dragend', 'resize' ];
        var method = enable ? 'on' : 'off';

        function storeInCookie(){
            var zoom = self.map.getZoom();
            var center = self.map.getCenter();
            var cookie_data = JSON.stringify({
                lon : center.lng ,
                lat : center.lat ,
                zoom : zoom
            });

            $.cookie(self._cookie_name, cookie_data);
        }

        events.forEach(function(event){
            self.map[method](event, storeInCookie);
        });

        return this;
    };
    
    Map.prototype.setInitialView = function(cb){
        var methods = [
            this.setViewFromCookie.bind(this) ,
            this.setViewFromBrowserApi.bind(this) ,
            this.setViewFromAjax.bind(this) ,
            this.setViewFromFallback.bind(this)
        ];

        async.detectSeries(methods, function iterator(meth, cb){
            meth(function(err, data){
                return cb(err ? false : true);
            });
        }, function done(found){
            return cb ? cb(found) : undefined;
        });

        return this;
    };

    Map.prototype.attachNodeLoader = function(){
        var self = this;
        var cache = this._nodeCache;

        function loader(){
            var bound = self.map.getBounds();
            var bbox = [
                bound.getWest(), bound.getSouth(), bound.getEast(), bound.getNorth()
            ].join(';');

            self.api.getNodes(bbox, function(nodes){
                nodes.forEach(function(node){
                    var key = [ node.location.x , node.location.y ];

                    if (! cache.has(key)){
                        var marker = L.marker(key).addTo(self.map);
                        marker.bindPopup( JSON.stringify(node, undefined, 2) );
                        cache.add(key, marker);
                    }
                });
            });
        }

        [ 'zoomend', 'dragend', 'resize' ].forEach(function(event){
            self.map.on(event, loader);
        });
        
        loader();

        return this;
    };

    
    return Map;
});

