'use strict';

describe('nih.views.routing: WalkController', function () {

    beforeEach(module('nih.views.routing'));

    var rootScope;
    var scope;
    var state;
    var Modals;

    var WalkController;

    function mockModals($q) {
        return {
            openInput: function () {
                var dfd = $q.defer();
                dfd.resolve(100);
                return {
                    result: dfd.promise
                };
            }
        };
    }

    beforeEach(inject(function ($controller, $q, $rootScope, $state) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        state = $state;
        Modals = mockModals($q);
        WalkController = $controller('WalkController', {
            $scope: scope,
            $state: state,
            Modals: Modals
        });
    }));

    it('should ensure that we navigate to routing on option click', function () {
        spyOn(state, 'transitionTo');
        var option = {
            text: '15 Minutes',
            walkTimeMins: 15
        };
        WalkController.optionClicked(option);
        rootScope.$digest();
        expect(state.transitionTo).toHaveBeenCalledWith('routing', {walkTimeMins: 15}, jasmine.any(Object));
    });

    it('should ensure that an option with !walkTimeMins opens modal to let user choose value', function () {
        spyOn(Modals, 'openInput').and.callThrough();
        spyOn(state, 'transitionTo');
        var option = {
            text: 'Other',
            walkTimeMins: 0
        };
        WalkController.optionClicked(option);
        rootScope.$digest();
        expect(Modals.openInput).toHaveBeenCalled();
        // Our mock modal service returns a value, so expect this as well
        expect(state.transitionTo).toHaveBeenCalled();
    });
});