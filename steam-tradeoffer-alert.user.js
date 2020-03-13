// ==UserScript==
// @name         Steam Tradeoffer Alert
// @namespace    https://steamcommunity.com/profiles/76561198144346135
// @version      1.0.1
// @description  Desktop notifications for open trade offers
// @author       Zeus_Junior/76561198144346135
// @grant        none
// @match        https://steamcommunity.com/*

// @homepageURL     https://github.com/ZeusJunior/steam-tradeoffer-alert
// @supportURL      https://github.com/ZeusJunior/steam-tradeoffer-alert/issues
// @downloadURL     https://github.com/ZeusJunior/steam-tradeoffer-alert/raw/master/steam-tradeoffer-alert.user.js
// ==/UserScript==

const interval = 1; // minutes
let offers = 0;

function notifyMe() {
	if (!('Notification' in window)) {
		alert('This browser does not support desktop notification');
	} else if (Notification.permission === 'granted') {
		const options = {
			body: 'You have a new trade offer!',
			icon: 'https://steamcommunity.com/favicon.ico',
			dir: 'ltr'
		};

		const notification = new Notification('Your trade offer info', options);

		notification.onclick = function() {
			window.open('http://steamcommunity.com/my/tradeoffers/');
		};
	} else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function(permission) {
			if (!('permission' in Notification)) {
				Notification.permission = permission;
			}

			if (permission === 'granted') {
				const options = {
					body: 'You have a new trade offer!',
					icon: 'https://steamcommunity.com/favicon.ico',
					dir: 'ltr'
				};
				const notification = new Notification('Your trade offer info', options); // https://steamcommunity.com/actions/GetNotificationCounts
				notification.onclick = function() {
					window.open('http://steamcommunity.com/my/tradeoffers/');
				};
			}
		});
	}
}


(function() {
	'use strict';
	const xhr = new XMLHttpRequest();
	setInterval(function() {
		xhr.open('GET', 'https://steamcommunity.com/actions/GetNotificationCounts', true);
		xhr.send();

		xhr.onreadystatechange = processRequest;
	}, interval * 60 * 1000);

	function processRequest(e) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			const response = JSON.parse(xhr.responseText);
			if (response.notifications['1'] > offers) {
				notifyMe();
			}

			offers = response.notifications['1'];
		}
	}

	// request permission on page load
	document.addEventListener('DOMContentLoaded', function() {
		if (!Notification) {
			alert('Desktop notifications not available in your browser. Try Chromium.');
			return;
		}

		if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		}
	});
})();
