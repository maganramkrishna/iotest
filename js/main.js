requirejs.config({
	paths: {
		angular: '../lib/angular/angular.min',
		angularAnimate: '../lib/angular-animate/angular-animate.min',
		angularSanitize: '../lib/angular-sanitize/angular-sanitize.min',
		uiRouter: '../lib/angular-ui-router/release/angular-ui-router.min',
		ngTouch: '../lib/angular-touch/angular-touch.min',
		ionic: '../lib/ionic/js/ionic.min',
		ionicBundle: '../lib/ionic/js/ionic.bundle.min',
		ionicAngular: '../lib/ionic/js/ionic-angular.min',
		'ionic-material': '../lib/ionic-material/dist/ionic.material.min',
		ionMdInput: '../lib/ion-md-input/js/ion-md-input.min',
		ngCordova: '../lib/ng-cordova.min',
		ngIOS9UIWebViewPatch: '../lib/ionic-patch/angular-ios9-uiwebview.patch',
		ngMessages: '../lib/angular-messages/angular-messages.min',
		moment: '../lib/moment/min/moment.min',
		angularMoment: '../lib/angular-moment/angular-moment.min',
		ioBundle: '../lib/ionic-platform-web-client/dist/ionic.io.bundle.min',
		'braintree-angular': '../lib/braintree-angular/dist/braintree-angular',
		'ion-datetime-picker': '../lib/ion-datetime-picker/release/ion-datetime-picker.min',
		'stripe': 'https://js.stripe.com/v2/?1',
		'angular-stripe': '../lib/angular-stripe/release/angular-stripe',
		'angular-credit-cards': '../lib/angular-credit-cards/release/angular-credit-cards',
		'le': '../lib/logentries/product/le',
		'logentries': '../lib/angular-logentries/angular-logentries'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		angularAnimate: {
			deps: ['angular']
		},
		angularSanitize: {
			deps: ['angular']
		},
		uiRouter: {
			deps: ['angular']
		},
		ionic: {
			deps: ['angular'],
			exports: 'ionic'
		},
		ioBundle: {
			deps: ['angular', 'ionic', 'ionicBundle'],
			exports: 'Ionic'
		},
		ionicAngular: {
			deps: ['angular', 'ionic', 'uiRouter', 'angularAnimate', 'angularSanitize', 'ngIOS9UIWebViewPatch']
		},
		ngCordova: {
			deps: ['angular']
		},
		ionMdInput: {
			deps: ['angular'],
			exports: 'ionMdInput'
		},
		'ionic-material': {
			deps: ['ionic'],
			exports: 'ionic-material'
		},
		ngIOS9UIWebViewPatch: {
			deps: ['angular'],
			exports: 'ngIOS9UIWebViewPatch'
		},
		ngMessages: {
			deps: ['angular'],
			exports: 'ngMessages'
		},
		moment: {
			exports: 'moment'
		},
		angularMoment: {
			deps: ['angular', 'moment'],
			exports: 'angularMoment'
		},
		'braintree-angular': {
			deps: ['angular'],
			exports: '$braintree'
		},
		'angular-stripe': {
			deps: ['angular', 'stripe']
		},
		'angular-credit-cards': {
			deps: ['angular'],
			exports: 'credit-cards'
		},
		'stripe': {
			exports: 'Stripe'
		},
		ngTouch: {
			deps: ['angular']
		},
		'le': {
			exports: 'LE'
		},
		logentries: {
			deps: ['le', 'angular']
		}
	},
	priority: ['angular', 'ionic'],
	deps: ['bootstrap']
});