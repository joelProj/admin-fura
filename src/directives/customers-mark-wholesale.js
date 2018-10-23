module.exports = ['$http', '$q', 'notification', '$state', function($http, $q, notification, $state) {
  'use strict';

  return {
      restrict: 'E',
      scope: {
          selection: '='
      },
      link: function(scope, element, attrs) {
          scope.markAsWholesale = function() {
            $http.put('/api/customers/set/wholesale', {customers: scope.selection.map(function(e){ return e.values._id; })} )
            .then(function(){ return $state.reload(); })
            .then(function(){ notification.log(scope.selection.length + ' customers marked as wholesale', { addnCls: 'humane-flatty-success' }); } )
            .catch(function(e){ notification.log('Could not update the users', { addnCls: 'humane-flatty-error' }) && console.error(e); });
          }
      },
      template: '<span ng-click="markAsWholesale()"><span class="glyphicon glyphicon-fire" aria-hidden="true"></span> <span class="hidden-xs">Mark as wholesale</span></a>'
  }
}];
