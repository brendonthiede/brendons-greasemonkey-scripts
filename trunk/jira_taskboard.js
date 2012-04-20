//==== {Begin} Load support libraries ====
var jsInjector = function(url) {
	var s = document.createElement('script');
  console.log('*** jsInjector(' + url + ')');
	s.src = url;
  s.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(s);
};

jsInjector('https://dl.dropbox.com/u/9802197/lib/jquery-1.6.2.min.js');

function checkJquery() {
  console.log('*** checkJquery()');
  if (window.jQuery) {
    console.log('jQuery loaded');
    jsInjector('https://dl.dropbox.com/u/9802197/lib/jquery-ui-1.8.16.min.js');
    checkJQueryUI();
  } else {
    console.log('Waiting for jQuery to load');
    window.setTimeout(checkJquery, 100);
  }
}

function checkJQueryUI() {
  console.log('*** checkJQueryUI()');
  if (jQuery.ui) {
    console.log('jQueryUI loaded');
    jsInjector('https://dl.dropbox.com/u/9802197/lib/rpc.js');
    checkRpc();
  } else {
    console.log('Waiting for jQueryUI to load');
    window.setTimeout(checkJQueryUI, 100);
  }
}

function checkRpc() {
  console.log('*** checkRpc()');
  if (window.rpc) {
    console.log('rpc loaded');
    allLibrariesLoaded();
  } else {
    console.log('Waiting for rpc to load');
    window.setTimeout(checkRpc, 100);
  }
}

checkJquery();
//==== {End} Load support libraries ====

 



var jiraTaskboard = new Object();
jiraTaskboard.jiraUrl = '/rpc/xmlrpc';
jiraTaskboard.loadingImage = '/s/471/1/4.0.1/_/images/gadgets/loading.gif';
jiraTaskboard.jiraService = null;
jiraTaskboard.loginToken = null;
jiraTaskboard.selectedFilter = null;

jiraTaskboard.initTaskboard = function() {
  console.log('*** jiraTaskboard.initTaskboard()');
  $('body').html('');

  jiraTaskboard.createLoginDetails();
  jiraTaskboard.createTaskboardSettings();
  jiraTaskboard.createTaskboard();
}

jiraTaskboard.createLoginDetails = function() {
  console.log('*** jiraTaskboard.createLoginDetails()');
  $('body').append('<div id="loginDetails"><table id="loginDetailsTable"><tbody id="loginDetailsBody"></tbody></table></div>');
  $('#loginDetailsBody').append('<tr id="loginDetailsRow">');
  $('#loginDetailsRow').append('<th>Username:</th>');
  $('#loginDetailsRow').append('<th><input type="textbox" name="jiraUsername" id="jiraUsername"></input></th>');
  $('#loginDetailsRow').append('<th>Password</th>');
  $('#loginDetailsRow').append('<th><input type="password" name="jiraPassword" id="jiraPassword"></input></th>');
  $('#loginDetailsRow').append('<th><button id="jiraLoginButton">Login</button></th>');
  $('#jiraLoginButton').click(function() {
    jiraTaskboard.loginToJira($('#jiraUsername').val(), $('#jiraPassword').val());
  });
  $('#jiraUsername').focus();
}

jiraTaskboard.createTaskboardSettings = function() {
  console.log('*** jiraTaskboard.createTaskboardSettings()');
  $('body').append('<div id="taskboardSettings"></div>');
  $('#taskboardSettings').hide();
  jiraTaskboard.createFilterSelector();
}

jiraTaskboard.createTaskboard = function() {
  console.log('*** jiraTaskboard.createTaskboard()');
  $('body').append('<div id="taskboard">');
  $('#taskboard').hide();
  $('#taskboard').append('<table id="userStoriesTable"><tbody id="userStoriesBody"></tbody></table>');
  $('#userStoriesBody').append('<tr><th>Stories</th><th>Not Started</th><th>In Progress</th><th>Completed</th></tr>');
}

jiraTaskboard.createFilterSelector = function() {
  console.log('*** jiraTaskboard.createFilterSelector()');
  $('#taskboardSettings').append('<div id="favoriteFilters">Favorite Filters:</div>');
  $('#favoriteFilters').append('<select id="favoriteFiltersOptions"><option><i>Loading...</i></option></select>');
  $('#favoriteFilters').append('<button id="loadFilterButton" onClick="jiraTaskboard.getCurrentFilterIssues();">Load Stories</button>');
  $('#favoriteFilters').append(' <button id="refreshFiltersButton" onClick="jiraTaskboard.getFilterList();">Refresh Filter List</button>');
  $('#favoriteFilters').append(' &nbsp; <a href="/secure/ManageFilters.jspa" target="_blank">manage filters</a>');
}

jiraTaskboard.initRpcService = function() {
  var serviceMethods = ['jira1.login', 'jira1.getIssue', 'jira1.getFavouriteFilters', 'jira1.getIssuesFromFilter'];
  console.log('*** jiraTaskboard.initRpcService()');
  console.log('jiraTaskboard.jiraUrl: ' + jiraTaskboard.jiraUrl);
  console.log('serviceMethods: ' + serviceMethods);
  jiraTaskboard.jiraService = new rpc.ServiceProxy(
    jiraTaskboard.jiraUrl,
    { methods: serviceMethods,
      protocol: 'XML-RPC',
    });
}

jiraTaskboard.getRpcService = function() {
  console.log('*** jiraTaskboard.getRpcService()');
  if (jiraTaskboard.jiraService === null) {
    jiraTaskboard.initRpcService();
  }
  return jiraTaskboard.jiraService;
}

jiraTaskboard.doLogin = function(token) {
  console.log('*** jiraTaskboard.doLogin(******)');
  jiraTaskboard.loginToken = token;
  $('#loginDetails').hide();
  $('#taskboardSettings').show();
  $('#taskboard').show();
  jiraTaskboard.getFilterList();
}

jiraTaskboard.loginToJira = function(username, password) {
  console.log('*** jiraTaskboard.loginToJira(' + username + ', ******)');
  jiraTaskboard.getRpcService().jira1.login({
     params:[username, password],
     onSuccess:function(message){
         jiraTaskboard.doLogin(message);
     },
     onException:function(e){
         alert("Unable to login because: " + e);
         return true;
     }
  });
}

jiraTaskboard.addIssues = function(issues) {
  console.log('*** jiraTaskboard.addIssues(' + issues + ')');
  for (i in issues) {
    console.log('Appending issue with key: ' + issues[i].key);
    $('#userStoriesBody').append('<tr><td><div id="' + issues[i].key + 'UserStory"></td><td></td><td></td><td></td></tr>');
    $('#' + issues[i].key + 'UserStory').append('<a href="/browse/' + issues[i].key + '" target="_blank">' + issues[i].key + '</a> - ' + issues[i].summary);
  }
}

jiraTaskboard.createFilterList = function(filterList) {
  console.log('*** jiraTaskboard.createFilterList(' + filterList + ')');
  $('#favoriteFiltersOptions').html('');
  for (i in filterList) {
    console.log('Appending issue with name: ' + filterList[i].name);
    $('#favoriteFiltersOptions').append('<option value="' + filterList[i].id + '">' + filterList[i].name + '</option>');
  }
}

jiraTaskboard.getFilterList = function() {
  console.log('*** jiraTaskboard.getFilterList()');
  jiraTaskboard.getRpcService().jira1.getFavouriteFilters({
    params:[jiraTaskboard.loginToken],
    onSuccess:function(message){
      jiraTaskboard.createFilterList(message);
    },
    onException:function(e){
      alert("Unable to get filter list because: " + e);
      return true;
    }
  });
}

jiraTaskboard.getCurrentFilterIssues = function() {
  var currentFilterId = $('#favoriteFiltersOptions').val();
  console.log('*** jiraTaskboard.getCurrentFilterIssues()');
  console.log('Value of favoriteFiltersOptions: ' + currentFilterId);
  if (currentFilterId !== undefined) {
    jiraTaskboard.getFilterIssues(currentFilterId);
  } else {
    alert('You must first select a filter.');
    console.log('currentFilterId is undefined');  
  }
}

jiraTaskboard.getFilterIssues = function(filter) {
  console.log('*** jiraTaskboard.getFilterIssues(' + filter + ')');
  jiraTaskboard.getRpcService().jira1.getIssuesFromFilter({
    params:[jiraTaskboard.loginToken, filter],
    onSuccess:function(message){
      jiraTaskboard.addIssues(message);
    },
    onException:function(e){
      alert("Unable to get issues from filter because: " + e);
      return true;
    }
  });
}

jiraTaskboard.getIssue = function(key) {
  console.log('*** jiraTaskboard.getIssue(' + key + ')');
  jiraTaskboard.getRpcService().jira1.getIssue({
     params:[jiraTaskboard.loginToken, key],
     onSuccess:function(message){
         console.log(message);
     },
     onException:function(e){
         alert("Unable to get issue because: " + e);
         return true;
     }
  });
}

jiraTaskboard.showUpdateLink = function() {
  console.log('*** jiraTaskboard.showUpdateLink()');
  $('body').html('<h1><i><a href="https://dl.dropbox.com/u/9802197/GreaseMonkey/jira_taskboard.user.js">Newer version of base script required.  Click this link, then after installing refresh the page.</a></i></h1>');
}

jiraTaskboard.isLatestVersion = function() {
  var expectedVersion = '1.000.001';
  var actualVersion;
  console.log('*** jiraTaskboard.isLatestVersion()');
  actualVersion = $('body').attr('taskboardVersion');
  console.log('Expected version: ' + expectedVersion);
  console.log('Actual version: ' + actualVersion);
  return expectedVersion === actualVersion;
}

function allLibrariesLoaded() {
  console.log('*** allLibrariesLoaded()');
  console.log('All support libraries have been loaded');
  if (jiraTaskboard.isLatestVersion()) {
    jiraTaskboard.initTaskboard();
  } else {
    jiraTaskboard.showUpdateLink();
  }
}