require.config({
    paths : {
        jquery    : '../vendor/jquery/jquery' ,
        leaflet   : '../vendor/leaflet/leaflet' ,
        bootstrap : '../vendor/bootstrap/js/bootstrap' ,
        cookie    : '../vendor/cookie/jquery.cookie' ,
        async     : '../vendor/async/async' ,
        tmpl      : '../templates'
    } ,
    shim : {
        cookie : ['jquery']
    }
});

require(['app/index', 'app/settings'], function(app, conf){
    "use strict";
    
    app.start(conf);
});
