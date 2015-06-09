/*global module, inject */
'use strict';

define(['app', 'angularMocks'], function(app) {
	describe('myApp.home module', function() {

		beforeEach(module('myApp.home'));

		describe('home controller', function() {
			it('should ....', inject(function($controller) {
				//spec body
				var view1Ctrl = $controller('View1Ctrl');
				expect(view1Ctrl).toBeDefined();
			}));
		});
	});
});