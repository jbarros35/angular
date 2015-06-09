/*global module, inject */
'use strict';

define(['app', 'angularMocks'], function(app) {
	describe('myApp.about module', function() {

		beforeEach(module('myApp.about'));

		describe('about controller', function(){

			it('should ....', inject(function($controller) {
			//spec body
			var view2Ctrl = $controller('View2Ctrl', { $scope: {} });
			expect(view2Ctrl).toBeDefined();
		}));

		});
	});
});