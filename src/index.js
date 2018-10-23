// require('ng-admin/build/ng-admin.min.js');
// require('../node_modules/ng-admin/build/ng-admin.min.css');

var directivesInit = require('./directives');

// BOOTSTRAP THE ADMIN

var crmApp = angular.module('admin', ['ng-admin']);

directivesInit(crmApp);

crmApp.factory('httpInterceptor', require('./factories/http-interceptor'));

crmApp.config(['NgAdminConfigurationProvider', '$stateProvider', '$translateProvider', '$httpProvider', function(NgAdminConfigurationProvider, $stateProvider, $translateProvider, $httpProvider) {

		$httpProvider.interceptors.push('httpInterceptor');

    var nga = NgAdminConfigurationProvider;
    var admin = nga.application("Admin Fura")
      .baseApiUrl("/api/");


    // ENTITIES

    admin.addEntity(nga.entity('questions'));
    admin.addEntity(nga.entity('answers'));

    require('./entities/questions')(nga, admin);
    require('./entities/answers')(nga, admin);

    // PAGES
    // require('./pages/summary')($stateProvider);


    admin.dashboard(require('./dashboard')(nga, admin));
    admin.header(require('./header'));
    admin.menu(require('./menu')(nga, admin));


    // CONFIG
    nga.configure(admin);

    // LANGUAGE
    require('./lang')($translateProvider);
}]);
