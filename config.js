"use strict";

var nconf = require( 'nconf' );

nconf.env();

// 'ADMIN_' is prefixing every variable to prevent collisions in the server's
// environment variables

// To get the value of ADMIN_DEBUG, simply use it as config.DEBUG
// (skip the prefix)

var defaults = {
    ADMIN_DEBUG: true,
    ADMIN_APP_NAME: 'Tvrbo Admin',
    ADMIN_HTML_TITLE: 'Tvrbo Admin',

    ADMIN_AUTH_PERIOD: 1000 * 60 * 60 * 24,

    ADMIN_ENFORCE_HTTPS: false,
    ADMIN_HTTP_PORT: process.env.PORT || 8080,
    ALLOW_CORS: false,

    ADMIN_HTTP_USER: null,
    ADMIN_HTTP_PASSWORD: null,

    // DATABASE
    ADMIN_MONGODB_URI: 'mongodb://localhost:27017/db',

    // CERTBOT
    ADMIN_ALLOW_CERTBOT: true,

    // JWT SESSIONS
    ADMIN_JWT_SECRET: '____SOME_LONG_KEY_HERE____'
};

nconf.defaults(defaults);

var k;
for(k in defaults) {
    if(defaults.hasOwnProperty(k)) {
        exports[k.replace(/^ADMIN_/, "")] = nconf.get(k); // REMOVING THE VARIABLE'S PREFIX _TVRBOREACT
    }
}
