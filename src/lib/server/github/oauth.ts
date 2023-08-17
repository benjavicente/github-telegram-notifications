import { githubApp } from './app';

githubApp.oauth.getWebFlowAuthorizationUrl({
	redirectUrl: '/'
});
