'use strict';

describe('nih.notifications: Notifications', function () {

    // load the controller's module
    beforeEach(module('nih.notifications'));

    var rootScope;
    var timeout;
    var Notifications;
    var testAlert = {
        text: 'Test',
        timeout: 300,
        delay: 0,
        closeButton: false,
        imageClass: 'glyphicon-warning-sign'
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($rootScope, $timeout, _Notifications_) {
        rootScope = $rootScope;
        timeout = $timeout;
        Notifications = _Notifications_;
    }));

    it('should trigger nih.notifications.show on Notifications.show', function () {
        spyOn(rootScope, '$broadcast');
        Notifications.show(testAlert);
        timeout.flush(1);
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.notifications.show', testAlert);
    });

    it('should trigger nih.notifications.hide on Notifications.hide', function () {
        spyOn(rootScope, '$broadcast');
        Notifications.hide();
        expect(rootScope.$broadcast).toHaveBeenCalledWith('nih.notifications.hide');
    });

});
