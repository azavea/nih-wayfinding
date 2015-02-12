(function () {
    /**
     * A simple queue stores directions queries in the order in which they were performed
     * The navigation view uses this to display navigation entries
     */
    'use strict';

    function NavigationQueue() {
        var queue = [];

        var module = {
            push: push,
            pop: pop,
            clear: clear,
            length: length
        };

        return module;

        function push(item) {
            queue.push(item);
        }

        function pop() {
            return queue.pop();
        }

        function clear() {
            queue = [];
        }

        function length() {
            return queue.length;
        }
    }

    angular.module('nih.navigation')
    .factory('NavigationQueue', NavigationQueue);
})();
