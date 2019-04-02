import { AsyncStorage } from 'react-native';

export const postRequestAuthorized = async function(url, data) {
	const jwt = await AsyncStorage.getItem('tfwJWT');
	return fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + jwt
		},
		body: JSON.stringify(data)
	})
		.then((response) => response.json())
		.catch((error) => console.log(error));
};

export const getRequestAuthorized = async function(url) {
	const jwt = await AsyncStorage.getItem('tfwJWT');
	return fetch(url, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + jwt
		}
	}).then((response) => response.json());
};

export const postRequestNotAuthorized = function(url, data) {
	return fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
		.then((response) => response.json())
		.catch((error) => console.log(error));
};

export const getRequestNotAuthorized = function(url) {
	return fetch(url).then((response) => response.json()).catch((error) => console.log(error));
};
