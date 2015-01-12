'use strict';

describe('nih.views.routing: WalkController', function () {

    beforeEach(module('nih.views.routing'));

    var rootScope;
    var scope;
    var state;

    var WalkController;

    beforeEach(inject(function ($controller, $rootScope, $state) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        state = $state;
        WalkController = $controller('WalkController', {
            $scope: scope,
            $state: state
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
});