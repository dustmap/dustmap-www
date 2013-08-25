define(['app/map', 'app/api'], function(Map, Api){
    "use strict";

    function start(conf) {
        var api = new Api(conf);
        var map = new Map(conf, api);

        map.attachNodeLoader();
    };

    return {
        start : start
    };
});

