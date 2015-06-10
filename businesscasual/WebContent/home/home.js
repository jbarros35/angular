'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	angular.module('myApp.home', ['ngRoute'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl: 'home/home.html',
			controller: 'homeCtrl'
		});
	}])
	.controller('homeCtrl', [function() {
		console.log('homectrl');
	}]);
});

