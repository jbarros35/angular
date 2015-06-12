'use strict';

define([
	'angular',
	'angularRoute',
	'angular-resource',
	'ui-bootstrap',
	'home/home',
	'about/about',
	'blog/blog',
	'contact/contact',
	'utility/util'
], function(angular, angularRoute) {
	// Declare app level module which depends on views, and components
	return angular.module('myApp', [
		'ngRoute',
		//'ui-bootstrap',
		'myApp.home',
		'myApp.about',
		'myApp.blog',
		'myApp.contact',
		'myApp.util'
	]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/home'});
	}]);
});


