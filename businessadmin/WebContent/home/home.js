'use strict';
define([
	'angular',
	'angularRoute',
	'angular-flash'
], function(angular) {

	var home = angular.module('myApp.home', ['ngRoute','ui.bootstrap', 'angular-flash.service', 'angular-flash.flash-alert-directive']);

	home.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl: 'home/home.html',
			controller: 'homeCtrl'
		});
		
	}]);

	home.controller('homeCtrl', ['$scope', 'flash', function($scope, flash) {
		// Home controller logic
		// Publish a success flash
	    flash.success = 'Do it live!';

	    // Publish a error flash
	    flash.error = 'Fail!';

	    // Publish an info flash to the `alert-1` subscriber
	    flash.to('alert-1').info = 'Only for alert 1';

	    // The `flash-alert` directive hides itself when if receives falsey flash messages of any type
	    flash.error = '';
	}]);


});

