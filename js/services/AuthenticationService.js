/*global define, console */

define(['angular'], function(angular) {
    "use strict";

    // kick off the platform web client
    Ionic.io();

    var factory = function(HttpService, $cordovaPush, UserService, $rootScope, NotificationService) {
        function registerToken(userId) {
            if (!userId) {
                return;
            }
             // ANDROID PUSH NOTIFICATIONS
                if (ionic.Platform.isAndroid()) {
                    var config = {
                        "senderID": "1019187673967"
                    };

                    $cordovaPush.register(config).then(function(result) {
                        // Success
                        console.log("$cordovaPush.register Success");
                        console.log(result);
                    }, function(err) {
                        // Error
                        console.log("$cordovaPush.register Error");
                        console.log(err);
                    });

                    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                        console.log(JSON.stringify([notification]));
                        switch (notification.event) {
                            case 'registered':
                                if (notification.regid.length > 0) {
                                    console.log('registration ID = ' + notification.regid);
                                    // NodePushServer.storeDeviceToken("android", notification.regid);
                                    if (window.localStorage.getItem('deviceToken') !== notification.regid) {
                                        UserService.saveDeviceToken(notification.regid, userId, function() {
                                            console.log('saveDeviceToken', arguments);
                                        });
                                    }

                                    window.localStorage.setItem('deviceToken', notification.regid);
                                }
                                break;

                            case 'message':
                                NotificationService.getUnreadNotifications(function() {});
                                if (notification.foreground == "1") {
                                    console.log("Notification received when app was opened (foreground = true)");
                                } else {
                                    if (notification.coldstart == "1") {
                                        console.log("Notification received when app was closed (not even in background, foreground = false, coldstart = true)");
                                    } else {
                                        console.log("Notification received when app was in background (started but not focused, foreground = false, coldstart = false)");
                                    }
                                }

                                // this is the actual push notification. its format depends on the data model from the push server
                                console.log('message = ' + notification.message);
                                if(navigator.notification) {
                                    navigator.notification.alert(notification.message);
                                }
                                break;

                            case 'error':
                                console.log('GCM error = ' + notification.msg);
                                break;

                            default:
                                console.log('An unknown GCM event has occurred');
                                break;
                        }
                    });
                }
                if (ionic.Platform.isIOS()) {
                    var iosConfig = {
                        "badge": true,
                        "sound": true,
                        "alert": true
                    };

                    $cordovaPush.register(iosConfig).then(function(deviceToken) {
                        // Success -- send deviceToken to server, and store for future use
                        console.log("deviceToken: " + deviceToken);

                        if (window.localStorage.getItem('deviceToken') !== deviceToken) {
                            UserService.saveDeviceToken(deviceToken, userId, function() {
                                console.log('saveDeviceToken', arguments);
                            });
                        }

                        window.localStorage.setItem('deviceToken', deviceToken);

                    }, function(err) {
                        console.error("Registration error: " + err);
                    });

                    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                      console.log("notification", notification);
                      NotificationService.getUnreadNotifications(function() {});
                      if (navigator.notification.alert) {
                        navigator.notification.alert(notification.alert);
                      }

                      if (notification.sound) {
                        var snd = new Media(event.sound);
                        snd.play();
                      }

                      if(notification.$state) {
                        navigator.notification.confirm(notification.alert + " - go to it?", function(btn) {
                          if(btn === 1) {
                            $state.go(notification.$state);
                          }
                        },notification.title);
                      }

                      if (notification.badge) {
                        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
                          // Success!
                        }, function(err) {
                          // An error occurred. Show a message to the user
                        });
                      }
                    });
                }

            // IONIC PUSH
            var push = new Ionic.Push({
                "debug": true,
                "onNotification": function(notification) {
                    var payload = notification.payload;
                    console.log(notification, payload);
                },
                "onRegister": function(data) {
                    console.log("onRegister", data.token);
                }
            });

            // push.register(function(token) {
            //     console.log("Device token Ionic:", token.token);
            //     push.saveToken(token);
            // });
        }

        function login(username, password, cb) {
            var loginRequest = {
                    'identifier': username,
                    'password': password
                };
            HttpService.execute('/login', 'POST', loginRequest, false)
                .then(function(loginResponse) {
                    // Store the login information
                    window.localStorage.setItem('username', username);
                    window.localStorage.setItem('password', password);
                    window.localStorage.setItem('token', loginResponse.data.token);
                    window.localStorage.setItem('userId', loginResponse.data.user.id);

                    var details = {
                        'email': loginResponse.data.user.email,
                        'userId': loginResponse.data.user.id,
                        'password': password
                    };

                    var options = {
                        'remember': true
                    };
                    Ionic.Auth.login('basic', options, details).then(function() {
                        // Success
                        console.log('Ionic login successfully');
                    }, function() {
                        // Failure
                        console.error('Ionic Failed to loging', arguments);
                    });

                    //register device token with the user 
                    registerToken(loginResponse.data.user.id);
                    $rootScope.IsLoggedIn = true;

                    UserService.gerUserInfo(window.localStorage.getItem('userId'), function (err, userResponse) {
                        $rootScope.currentUser = userResponse.data;
                        cb(null, loginResponse);
                    });

                }, function(loginError) {
                    cb(loginError);
                });
        }

        var self = {
            registerToken: function(userId) {
                registerToken(userId);
            },
            login: function(username, password, cb) {
                login(username, password, cb);
            },
            signUp: function(username, password, email, firstName, lastName, cb) {
                var registerRequest = {
                    'username': username,
                    'password': password,
                    'firstName': firstName,
                    'lastName': lastName,
                    'email': email,
                    'admin': 1
                };
                HttpService.execute('/register', 'POST', registerRequest, false)
                    .then(function(registerResponse) {
                        var details = {
                            'email': email,
                            'password': password
                        };
                        Ionic.Auth.signup(details).then(function() {
                            console.log('Ionic Signup successfully');
                        }, function() {
                            console.error('Ionic failed signup', arguments);
                        });

                        login(username, password, function(err, loginResponse) {
                            cb(null, loginResponse);
                        });
                    }, function(registerError) {
                        cb(registerError);
                    });
            },
            facebookLogin: function(username, email, firstName, lastName, facebookId, profileImage, cb) {
                 var registerRequest = {
                    'username': username,
                    'password': facebookId,
                    'firstName': firstName,
                    'lastName': lastName,
                    'email': email,
                    'admin': 1,
                    'facebookId': facebookId,
                    'profileImage': profileImage
                };
                HttpService.execute('/facebook/login', 'POST', registerRequest, false)
                    .then(function(registerResponse) {
                        var details = {
                            'email': email,
                            'password': facebookId
                        };
                        Ionic.Auth.signup(details).then(function() {
                            console.log('Ionic Signup successfully');
                        }, function() {
                            console.error('Ionic failed signup', arguments);
                        });

                        // Store the login information
                        window.localStorage.setItem('username', username);
                        window.localStorage.setItem('password', facebookId);
                        window.localStorage.setItem('token', registerResponse.data.token);
                        window.localStorage.setItem('userId', registerResponse.data.user.id);

                        //register device token with the user 
                        registerToken(registerResponse.data.user.id);
                        $rootScope.IsLoggedIn = true;

                        UserService.gerUserInfo(window.localStorage.getItem('userId'), function (err, userResponse) {
                            $rootScope.currentUser = userResponse.data;
                            cb(null, registerResponse);
                        });

                    }, function(registerError) {
                        cb(registerError);
                    });
            },
            isLoggedIn: function() {
                var token = window.localStorage.getItem('token');
                return token;
            },
            logout: function(cb) {
                HttpService.execute('/logout', 'POST', null, false)
                    .then(function(logoutResponse) {
                        window.localStorage.removeItem('username');
                        window.localStorage.removeItem('password');
                        window.localStorage.removeItem('token');
                        window.localStorage.removeItem('userId');
                    	Ionic.Auth.logout();
                        if (cb) cb(null, logoutResponse);
                    }, function(logoutError) {
                        if (cb) cb(logoutError);
                    });
            }
        };

        return self;
    };

    factory.$inject = ['HttpService', '$cordovaPush', 'UserService', '$rootScope', 'NotificationService'];
    return factory;
});