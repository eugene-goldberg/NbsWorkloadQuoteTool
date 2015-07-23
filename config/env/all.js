'use strict';

module.exports = {
	app: {
		title: 'New Business DC Placement and Costing Tool',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3002,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap-custom/bootstrap-paper.css',
				//'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/modules/datacollectors/css/isteven-multi-select.css',
				'public/lib/css/dx.common_15.1.4.css',
				'public/lib/css/dx.light_15.1.4.css'
			],
			js: [
				'public/lib/jquery/dist/jquery.min.js',
				'public/lib/scripts/angular_1.3.js',
				'public/lib/scripts/angular-resource_1.3.js',
				'public/lib/scripts/angular-cookies_1.3.js',
				'public/lib/scripts/angular-animate_1.3.js',
				'public/lib/scripts/angular-touch_1.3.js',
				'public/lib/scripts/angular-sanitize_1.3.js',
				'public/lib/scripts/globalize_0.1.1.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/angular-route/angular-route.js',
				'public/lib/angular-file-upload/angular-file-upload.js',
				'public/lib/angular-bootstrap/ui-bootstrap.js',
				'public/lib/isteven-multi-select.js',
				'public/lib/scripts/dx.all_15.1.4.js',
				'public/lib/scripts/jszip_2.5.0.js',
				'public/modules/datacollectors/directives/ng.directives.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
