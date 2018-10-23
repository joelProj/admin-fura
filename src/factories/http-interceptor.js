module.exports = ['$q', '$injector', 'notification', function($q, $injector, notification) {
    return {
        'responseError': function(rejection) {
            if(rejection.data && rejection.data.error) {
                notification.log(rejection.data.error, { addnCls: 'humane-flatty-error' });
            }
            else if (rejection.status === 401) {
                notification.log('You are not logged in', { addnCls: 'humane-flatty-error' });
                $injector.get('$state').go('logout');
            }
            else if (rejection.status === 403) {
                notification.log('Access is forbidden', { addnCls: 'humane-flatty-error' });
                $injector.get('$state').go('dashboard');
            }
            else if (rejection.status === 404) {
                notification.log('Could not find the resource', { addnCls: 'humane-flatty-error' });
                $injector.get('$state').go('dashboard');
            }
            else
              notification.log('Unable to complete the request', { addnCls: 'humane-flatty-error' });
            // Replace response with rejected promise to prevent rest of execution
            return $q.reject(rejection);
        }
    };
}];
