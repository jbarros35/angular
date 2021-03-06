'use strict';

define([
	'angular',
	'angularRoute',
	'components/version/version'
], function(angular) {
	angular.module('myApp.about', ['ngRoute', 'myApp.version'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/about', {
			templateUrl: 'about/about.html',
			controller: 'blogCtrl'
		});
	}])
	// We can load the controller only when needed from an external file
	.controller('blogCtrl', ['$scope', '$injector', function($scope, $injector) {
		require(['about/ctrl2'], function(ctrl2) {
			// injector method takes an array of modules as the first argument
			// if you want your controller to be able to use components from
			// any of your other modules, make sure you include it together with 'ng'
			// Furthermore we need to pass on the $scope as it's unique to this controller
			$injector.invoke(ctrl2, this, {'$scope': $scope});
		});
	}]);
});