// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
window.handleOpenURL = function handleOpenURL(url) {
    console.log("received url: " + url);
    var body = document.getElementsByTagName("body")[0];
    var appLaunchedController = angular.element(body).scope();
    console.log(appLaunchedController.reportAppLaunched);
    appLaunchedController.reportAppLaunch(url.substring(6));
};

define([
        'angular',
        'config',
        // 'ionicAngular',
        'ngCordova',
        'ngTouch',
        // 'ioBundle',
        'ionic-material',
        'angular-credit-cards',
        'angular-stripe',
        'ionMdInput',
        'ngMessages',
        'angularMoment',
        'ion-datetime-picker',
        'le',
        'services/services',
        'directives/directives',
        'controllers/controllers',
        'filters/filters'
    ],
    function(angular) {
        'use strict';
        var app = angular.module('app', [
            'ionic',
            'ionic.service.core',
            'ionic.service.analytics',
            'ngCordova',
            'ngTouch',
            // 'ngIOS9UIWebViewPatch',
            // 'ioBundle',
            'ionic-material',
            'credit-cards',
            'angular-stripe',
            'ionMdInput',
            'ngMessages',
            'angularMoment',
            'ion-datetime-picker',
            'app.controllers',
            'app.services',
            'app.directives',
            'app.filters'
        ]);

        window.moment = require('moment');
        window.LE = require('le');

        app.run(['$log', '$ionicPlatform', '$ionicAnalytics', '$cordovaPush', '$cordovaStatusbar', '$state', '$rootScope', 'CONFIG', 'UserService', 'NotificationService', 
            function($log, $ionicPlatform, $ionicAnalytics, $cordovaPush, $cordovaStatusbar, $state, $rootScope, CONFIG, UserService, NotificationService) {
                $ionicPlatform.ready(function() {

                    // kick off the platform web client
                    Ionic.io();
                    $ionicAnalytics.register();

                    LE.init(CONFIG.logentries.account_key);


                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    if (window.cordova && window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                        cordova.plugins.Keyboard.disableScroll(true);
                    }

                    setTimeout(function() {
                        if (window.StatusBar) {
                            StatusBar.styleBlackTranslucent();
                            StatusBar.backgroundColorByName('black');
                        }
                    }, 300);

                    if (window.cordova && window.cordova.logger) {
                        window.cordova.logger.__onDeviceReady();
                    }

                    if(window.codePush) {
                        (function() {
                            function displayMessage (message) {
                              navigator.notification.alert(message, null, 'CodePush', 'OK');
                            }
                            window.codePush.sync(function (syncStatus) {
                              switch (syncStatus) {
                                case SyncStatus.APPLY_SUCCESS:
                                  //Success
                                  displayMessage("Your app is up to date.");
                                  return;
                                case SyncStatus.UP_TO_DATE:
                                  //displayMessage("The application is up to date.");
                                  break;
                                case SyncStatus.UPDATE_IGNORED:
                                  //displayMessage("The user decided not to install the optional update.");
                                  break;
                                case SyncStatus.ERROR:
                                  //displayMessage("An error occurred while checking for updates");
                                  break;
                              }
                            });
                        })();
                    }

                    $rootScope.$on('$stateChangeStart',
                        function(event, toState, toParams, fromState, fromParams) {
                            console.log('stateurl', toState.url);
                            if (CONFIG.secureStates.indexOf(toState.url) > -1 && !$rootScope.IsLoggedIn) {
                                event.preventDefault();
                                $state.go('app.login');
                            }
                        });
                    if (window.navigator) {
                        navigator.geolocation.watchPosition(function(position) {
                            if (window.localStorage.getItem('userId')) {
                                UserService.updateUserAddress(position.coords.latitude, position.coords.longitude, function(err, address) {
                                    console.log("updated address");
                                });
                            } else {
                                window.localStorage.setItem('location', JSON.stringify({
                                    "latitude": position.coords.latitude,
                                    "longitude": position.coords.longitude
                                }));
                            }

                        }, function(error) {
                            console.error("Failed to get geolocation");
                        }, {
                            maximumAge: 30000,
                            timeout: 60000,
                            enableHighAccuracy: true
                        });
                    }

                    $rootScope.isWebView = ionic.Platform.isWebView();
                    $rootScope.isIPad = ionic.Platform.isIPad();
                    $rootScope.isIOS = ionic.Platform.isIOS();
                    $rootScope.isAndroid = ionic.Platform.isAndroid();
                    $rootScope.isWindowsPhone = ionic.Platform.isWindowsPhone();
                    $rootScope.currentPlatform = ionic.Platform.platform();
                    $rootScope.currentPlatformVersion = ionic.Platform.version();


                    document.addEventListener('resume', function() {
                        if (window.localStorage.getItem('userId')) {
                            NotificationService.getUnreadNotifications(function() {});
                        }
                    }, false);                   
                });

                // Custom logger
                $log.getInstance = function(context) {
                    return {
                        log: enhanceLogging($log.log, context),
                        info: enhanceLogging($log.info, context),
                        warn: enhanceLogging($log.warn, context),
                        debug: enhanceLogging($log.debug, context),
                        error: enhanceLogging($log.error, context)
                    };
                };

                function enhanceLogging(loggingFunc, context) {
                    return function() {
                        var modifiedArguments = [].slice.call(arguments);
                        modifiedArguments[0] = [moment().format("dddd h:mm:ss a") + '::[' + (context) + ']> '] + JSON.stringify(modifiedArguments[0]);
                        loggingFunc.apply(null, modifiedArguments);
                    };
                }
                // Override console
                window.console = $log.getInstance('Hotspot');


                setTimeout(function() {
                    $cordovaSplashscreen.hide();
                }, 5000);
            }
        ]);

        app.config(function($ionicConfigProvider, stripeProvider, CONFIG, $provide, $touchProvider, $animateProvider) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
            $ionicConfigProvider.views.maxCache(10);
            $touchProvider.ngClickOverrideEnabled(true);
            $animateProvider.classNameFilter(/\bangular-animated\b/);
           
            $provide.decorator("$exceptionHandler", ['$delegate',
                function($delegate) {
                    return function(exception, cause) {
                        $delegate(exception, cause);

                        // Decorating standard exception handling behaviour by sending exception to crashlytics plugin
                        var message = exception.toString();
                        var data = {
                            type: 'angular',
                            url: window.location.hash,
                            localtime: Date.now()
                        };
                        if (cause) {
                            data.cause = cause;
                        }
                        if (exception) {
                            if (exception.message) {
                                data.message = exception.message;
                            }
                            if (exception.name) {
                                data.name = exception.name;
                            }
                            if (exception.stack) {
                                data.stack = exception.stack;
                            }
                        }

                        if (window.navigator && window.navigator.crashlytics) {
                            window.navigator.crashlytics.logException("ERROR: " + message + ", stacktrace: " + JSON.stringify(data));
                        }
                        //Log entries
                        if(LE) {
                          LE.error("ERROR: " + message + ", stacktrace: " + JSON.stringify(data));
                        }
                    };
                }
            ]);
            // catch exceptions out of angular
            window.onerror = function(message, url, line, col, error) {
                var stopPropagation = true;
                var data = {
                    type: 'javascript',
                    url: window.location.hash,
                    localtime: Date.now()
                };
                if (message) {
                    data.message = message;
                }
                if (url) {
                    data.fileName = url;
                }
                if (line) {
                    data.lineNumber = line;
                }
                if (col) {
                    data.columnNumber = col;
                }
                if (error) {
                    if (error.name) {
                        data.name = error.name;
                    }
                    if (error.stack) {
                        data.stack = error.stack;
                    }
                }

                if (window.navigator && window.navigator.crashlytics) {
                    window.navigator.crashlytics.logException("ERROR: " + message + ", stacktrace: " + JSON.stringify(data));
                }
                //Log entries
                if(LE) {
                  LE.error("ERROR: " + message + ", stacktrace: " + JSON.stringify(data));
                }
                return stopPropagation;
            };

            $ionicConfigProvider.backButton.text('');
            $ionicConfigProvider.backButton.previousTitleText(false).text('');
            // Initialize Stripe
            stripeProvider.setPublishableKey(CONFIG.payments.stripe.publishableKey);
        });

        return app;
    });