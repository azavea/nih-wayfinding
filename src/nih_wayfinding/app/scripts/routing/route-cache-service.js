
(function () {
    'use strict';

    /* ngInject */
    function RouteCache () {

        var geojsonCache = null;

        var module = {
            hasData: hasData,
            getCache: getCache,
            setCache: setCache
        };

        return module;

        function hasData() {
            return geojsonCache && geojsonCache.features && geojsonCache.features.length;
        }

        function getCache() {
            return geojsonCache;
        }

        function setCache(geojson) {
            geojsonCache = geojson;
        }
    }

    angular.module('nih.routing')
    .factory('RouteCache', RouteCache);

})();
