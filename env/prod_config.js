define(['angular'], function (angular) {
	'use strict';

	return angular.module('app.config', []).constant('CONFIG', {
		VERSION: '0.1',
		defaultImage: 'assets/default',
		clientTokenPath: '/payment/client_token',
		baseUrl: 'https://api.hotspot.online',
		cloudinary: {
			API_URL: 'https://api.cloudinary.com/v1_1/hotspot-live/image/upload',
			API_VIDEO_URL: 'https://api.cloudinary.com/v1_1/hotspot-live/video/upload',
			UPLOAD_PRESET: 'xozguwnv',
			API_KEY: '947561869947997',
			BASE_IMAGE_URL: 'https://res.cloudinary.com/hotspot-live/image/upload',
			BASE_VIDEO_URL: 'https://res.cloudinary.com/hotspot-live/video/upload',
			BUCKET: '/v1444886624',
			resizeParams: {
				'profile': '/c_thumb,g_faces,q_90,r_max,w_100,h_100,d_assets:default.png',
				'profile-small': '/c_thumb,g_faces,q_90,r_max,w_40,h_40,d_assets:default.png',
				'profile-thumb': '/c_thumb,g_faces,r_max,c_fill,fl_progressive,q_90,w_150,h_150,d_assets:default.png',
				'menuprofile': '/c_thumb,g_faces,q_80,r_max,w_45,h_45,d_assets:default.png',
				'listing': '/h_320,w_300,q_100,c_fill,fl_progressive,d_assets:default.png',
				'listing-sold': '/h_320,w_300,q_100,c_fill,fl_progressive,d_assets:default.png/l_assets:sold,g_north_west',
				'listing-wide': '/h_260,w_360,q_100,c_fill,fl_progressive,d_assets:default.png',
				'listing-wide-sold': '/h_260,w_360,q_100,c_fill,fl_progressive,d_assets:default.png/l_assets:sold,g_north_west',
				'listing-wide-video': '/h_260,w_360,q_100,c_fill,fl_progressive,d_assets:default.png/l_assets:play,w_100',
				'listing-slide-thumb': '/q_100,h_450,c_fill,fl_progressive,d_assets:default.png',
				'listing-slide-full-video': '/',
				'listing-slide-video-thumb': '/q_100,fl_progressive,l_assets:play,w_100',
				'category': '/h_260,w_260,q_100,c_fill,fl_progressive,d_assets:default.png/assets/category',
				'order-details':'/h_75,w_75,q_100,c_fill,fl_progressive,d_assets:default.png',
				'landing-slides': '/h_800,q_80,c_fill,fl_progressive,d_assets:default.png'
			}
		},
		payments: {
			stripe: {
				publishableKey: 'pk_live_ZZ1tYtK3raXMFqFO4fFI2NKt'
			}
		},
		logentries: {
			account_key: 'd6ef6b13-28f2-44a4-a7da-53c6824f8e7b'
		},
		secureStates: ['/favoritelistings', '/myprofile', '/listings/create', '/payments', '/favoritelistings', '/orders', '/notifications']
	});
});