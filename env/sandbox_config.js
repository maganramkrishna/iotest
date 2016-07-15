define(['angular'], function (angular) {
	'use strict';

	return angular.module('app.config', []).constant('CONFIG', {
		VERSION: '0.1',
		defaultImage: 'assets/default',
		clientTokenPath: '/payment/client_token',
		baseUrl: 'http://159.203.251.255',
		cloudinary: {
			API_URL: 'https://api.cloudinary.com/v1_1/hotspot-online/image/upload',
			API_VIDEO_URL: 'https://api.cloudinary.com/v1_1/hotspot-online/video/upload',
			UPLOAD_PRESET: 'qlkzimyv',
			API_KEY: '451773134786283',
			BASE_IMAGE_URL: 'https://res.cloudinary.com/hotspot-online/image/upload',
			BASE_VIDEO_URL: 'https://res.cloudinary.com/hotspot-online/video/upload',
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
				publishableKey: 'pk_test_nDlNgKLjgu6CwKZ4U6eyyqKv'
			}
		},
		logentries: {
			account_key: '8c9172e3-a5dd-4a82-adf0-e1ba78920c42'
		},
		secureStates: ['/favoritelistings', '/myprofile', '/listings/create', '/payments', '/favoritelistings', '/orders', '/notifications']
	});
});