'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	angular.module('myApp.contact', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/contact', {
			templateUrl: 'contact/contact.html',
			controller: 'contactCtrl'
		});
	}])
	.controller('contactCtrl', [function() {
		
	}]);
});

