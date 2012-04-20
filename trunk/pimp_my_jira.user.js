// ==UserScript==
// @name           Pimp My Jira
// @date           2011-05-01
// @version        2.0
// @namespace      Sircon
// @description    Soups up Jira
// @include        https://products.sircon.com/*
// @exclude        https://products.sircon.com/taskboard
// ==/UserScript==

var injector = function(url) {
	var s = document.createElement('script');
	s.src = url;
	document.getElementsByTagName('head')[0].appendChild(s);
};

injector("https://dl.dropbox.com/u/9802197/GreaseMonkey/pimp_my_jira.js");