// ==UserScript==
// @name           Jira Task Board
// @date           2011-12-10
// @version        1.000.001
// @namespace      Vertafore
// @description    Adds task board capabilities to Jira
// @include        https://products.sircon.com/taskboard
// ==/UserScript==

var baseHtml = '<head><title>Task Board</title></head>';
baseHtml += '<body taskboardVersion="1.000.001"><h1><i>Loading...</i></h1></body>';
document.getElementsByTagName('html')[0].innerHTML = baseHtml;

var jsInjector = function(url) {
	var s = document.createElement('script');
	s.src = url;
  s.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(s);
};

jsInjector('https://dl.dropbox.com/u/9802197/GreaseMonkey/jira_taskboard.js');