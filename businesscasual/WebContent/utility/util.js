'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	
	var util = angular.module('myApp.util', ['ngRoute']);
		
	util.controller('utilCtrl', ['$scope', '$location', function($scope, $location) {
		// Home controller logic
		// invoke a router from function
		$scope.go = function ( path ) {
			  $location.path( path );
		};
	}]);
});
