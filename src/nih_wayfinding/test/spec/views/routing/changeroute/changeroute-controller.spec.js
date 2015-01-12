'use strict';

describe('nih.views.routing: ChangeRouteController', function () {

    beforeEach(module('nih.views.routing'));

    var rootScope;
    var scope;
    var state;
    var stateParams;

    var ChangeRouteController;

    beforeEach(inject(function ($controller, $rootScope, $state) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        state = $state;
        stateParams = {
            origin: '10,10',
            destination: '10,10'
        };
        ChangeRouteController = $controller('ChangeRouteController', {
            $scope: scope,
            $state: state,
            $stateParams: stateParams
        });
    }));

    it('should ensure that we navigate to routing on option click', function () {
        spyOn(state, 'transitionTo');
        var option = {};
        ChangeRouteController.optionClicked(option);
        rootScope.$digest();
        expect(state.transitionTo).toHaveBeenCalledWith('routing', stateParams, jasmine.any(Object));
    });
});