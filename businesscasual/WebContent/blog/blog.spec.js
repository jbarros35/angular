/*global module, inject */
'use strict';

define(['app', 'angularMocks'], function(app) {
	describe('myApp.blog module', function() {

		beforeEach(module('myApp.blog'));

		describe('blog controller', function() {
			it('should ....', inject(function($controller) {
				
				//spec body
				var blogCtrl = $controller('blogCtrl');
				expect(blogCtrl).toBeDefined();
			}));
		});
	});
});