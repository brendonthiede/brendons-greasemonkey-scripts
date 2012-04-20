/*******************************************************************
     Functions for cookies
 *******************************************************************/
function setCookie(cookieName, value) {
  document.cookie = cookieName + "=" + escape(value);
}

function getCookie(cookieName, defaultValue) {
  var ARRcookies = document.cookie.split(";");
  for (var i = 0; i < ARRcookies.length; i++) {
    var x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
    var y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
    x = x.replace(/^\s+|\s+$/g, "");
    if (x == cookieName) {
      return unescape(y);
    }
  }
  return defaultValue;
}




/*************************************************************************
      Generic helper functions
**************************************************************************/
jQuery.fn.extend({
insertAtCaret: function(myValue){
  return this.each(function(i) {
    if (document.selection) {
      //For browsers like Internet Explorer
      this.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
      this.focus();
    }
    else if (this.selectionStart || this.selectionStart == '0') {
      //For browsers like Firefox and Webkit based
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = startPos + myValue.length;
      this.scrollTop = scrollTop;
    } else {
      this.value += myValue;
      this.focus();
    }
  })
}
});

$.fn.fitImageInWindow = function() {
  // Window dimensions, with padding
  var windowWidth   = $(window).width() - 100;
  var windowHeight   = $(window).height() - 100;
  // Check to see if the width of the resized image is wider than the window
  if (Math.round(this.attr("width") * (windowHeight / this.attr("height"))) > windowWidth) {
    // Since <img> only need one dimension attribute to size, just set the width
    this.attr("width", windowWidth);
  } else {
    // Otherwise, just set the height
    this.attr("height", windowHeight);
  }
  return this;
};

$.fn.centerInWindow = function() {
  this.css("position", "absolute");
  this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() + "px");
  this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
  return this;
};

var nextHighestZindex = 0;

function getNextHighestZindex() {
  if (nextHighestZindex == 0) {
    var currentIndex = 0;
    var elArray = Array();
    elArray = document.getElementsByTagName('*');
    for (var i = 0; i < elArray.length; i++) {
      if (elArray[i].currentStyle) {
        currentIndex = parseFloat(elArray[i].currentStyle['zIndex']);
      } else if(window.getComputedStyle) {
        currentIndex = parseFloat(document.defaultView.getComputedStyle(elArray[i], null).getPropertyValue('z-index'));
      }
      if (!isNaN(currentIndex) && currentIndex > nextHighestZindex) {
        nextHighestZindex = currentIndex;
      }
    }
  }
  return(nextHighestZindex++);
}




/*******************************************************************
     Add configuration editor
 *******************************************************************/
function addPimpMyJiraConfigRow(label, input) {
  $('#pimpMyJiraConfigTable').append("<tr>");
  if (input) {
    $('#pimpMyJiraConfigTable').append("<td>" + label + "</td><td>" + input + "</td>");
  } else {
    $('#pimpMyJiraConfigTable').append("<td colspan='2'>" + label + "</td>");
  }
  $('#pimpMyJiraConfigTable').append("</tr>");
}

function showPimpMyJiraConfig() {
  if ($("#pimpMyJiraConfig").length == 0) {  
    $("body").append("<div id='pimpMyJiraConfig'" +
                     " style='position:fixed;top:100px;left:100px;background-color:#ffffff;border-style:solid;border-width:1px;z-index:" + getNextHighestZindex() + ";'/>");
    $('#pimpMyJiraConfig').append("<table style='width:100%'><tbody id='pimpMyJiraConfigTable'/></table>");
    $('#pimpMyJiraConfigTable').append("<tr style='background-color:#f0f0f0;'><th colspan='2'>Settings for PimpMyJira</th></tr>");
    addPimpMyJiraConfigRow("Shrunk height of textareas:", "<input id='textAreaExpandedRowCount' type='text' value='" + getCookie("textAreaExpandedRowCount", 35) + "'/>");
    addPimpMyJiraConfigRow("Maximized height of textareas:", "<input id='textAreaCollapsedRowCount' type='text' value='" + getCookie("textAreaCollapsedRowCount", 5) + "'/>");
    addPimpMyJiraConfigRow("<hr/>");
    addPimpMyJiraConfigRow("<input type='button' value='Save' onclick='savePimpMyJiraConfig()'/>" +
                           " &nbsp; <input type='button' value='Cancel' onclick='hidePimpMyJiraConfig()'/>");
    $('#pimpMyJiraConfig').draggable();
  }
  $("#pimpMyJiraConfig").show();
}

function hidePimpMyJiraConfig() {
  $("#pimpMyJiraConfig").hide();
}

function savePimpMyJiraConfig() {
  var val = parseInt($("#textAreaExpandedRowCount").val());
  if (!isNaN(val)) {
    setCookie("textAreaExpandedRowCount", val);
  }
  val = parseInt($("#textAreaCollapsedRowCount").val());
  if (!isNaN(val)) {
    setCookie("textAreaCollapsedRowCount", val);
  }
  
  hidePimpMyJiraConfig();
}

function addPimpMyJiraConfigLink() {
  var linkHtml = 
  "<li class>\n"
    + "<a "
    + "id=\"edit_pimp_config\" "
    + "title=\"Edit PimpMyJira configuration\" "
    + "href=\"#\" "
    + "onclick=\"showPimpMyJiraConfig()\">"
    + "Configure PimpMyJira"
    + "<\a>\n"
    + "<\li>\n";
  $("#personal").append(linkHtml);
  $("#edit_pimp_config").hover(function () {$(this).parent().addClass("active");}, function () {$(this).parent().removeClass("active");});
}
$(document).ready(function() {addPimpMyJiraConfigLink();});





var includedPages = ["https://products.sircon.com/browse",
                     "https://products.sircon.com/secure/EditIssue",
                     "https://products.sircon.com/secure/EditSubTaskIssue",
                     "https://products.sircon.com/secure/CreateIssue.jspa",
                     "https://products.sircon.com/secure/CreateSubTaskIssue.jspa"];

var excludedPages = ["https://products.sircon.com/browse/SFS/fixforversion/"];

var include;
for (var i = 0; i < includedPages.length; i++) {
  if (document.location.href.indexOf(includedPages[i]) >= 0) include = true;
}

for (var i = 0; i < includedPages.length; i++) {
  if (document.location.href.indexOf(excludedPages[i]) >= 0) include = false;
}

if (include) {


// Add custom CSS link entries
function addCSS(url) {
  $("head").prepend("<link type=\"text/css\" rel=\"styledheet\" href=\"" + url + "\"></link>");
}

// Add javascript to page
function addJS(url) {
  $("head").append("<script type=\"text/javascript\" src=\"" + url + "\"></script>");
};


var textAreaCollapsedRowCount = getCookie("textAreaCollapsedRowCount", 5); // TODO: consider hooking this into a cookie to allow user configuration
var textAreaExpandedRowCount = getCookie("textAreaExpandedRowCount", 35);

function improveIssueEditing() {
  // expand/collapse textareas
  $("textarea").css('overflow', 'auto').attr('rows', textAreaCollapsedRowCount)
    .focus(function(){$(this).attr('rows', textAreaExpandedRowCount);})
    .blur(function(){$(this).attr('rows', textAreaCollapsedRowCount);});
  
  // always expand comment textarea
  $("#comment").attr('rows', textAreaExpandedRowCount).unbind("focus").unbind("blur");

  // set width for fieldArea
  $(".fieldLabelArea").css('cssText', 'width: 10% !important');
  $(".fieldValueArea").css('cssText', 'width: 90% !important');
}

improveIssueEditing();
// tie preview click to re-call certain functions (to resolve how it changes the DOM)
$(".wiki-renderer").click(function(){improveIssueEditing();});



/****************************************************************************************************************************************************************************
      Copied from the "JIRA UE Enhancements" script on userscripts.org - http://userscripts.org/scripts/review/62106
      Begin "JIRA UE Enhancements" code
 ****************************************************************************************************************************************************************************/
var normalWidth;

// don't do the following for the create pages
if (document.location.href.indexOf("https://products.sircon.com/secure/CreateIssue.jspa") == -1 &&
    document.location.href.indexOf("https://products.sircon.com/secure/CreateSubTaskIssue.jspa") == -1) {
  // ======================================================= // Left column slider
  if (!normalWidth) {
    normalWidth = $('body table:first td:first').offsetWidth + 10;
  }

  // Create Other Operations list
  $('.operations').after('        <div class="otherOperations">' + "\n" +
                         '        <table cellspacing="0" cellpadding="3" border="0" width="100%">' + "\n" +
                         '        <tbody><tr><td bgcolor="#dddddd">' + "\n" +
                         '            <b>Other Operations</b>' + "\n" +
                         '        </td></tr>' + "\n" +
                         '        </tbody></table>' + "\n" +
                         '        <img height="1" border="0" width="100%" alt="" src="/images/bluepixel.gif"><br>' + "\n" +
                         '        <table cellspacing="0" cellpadding="3" border="0" id="otherOperationsSection">' + "\n" +
                         '                    <tbody id="otherOperationsSectionTBody">' + "\n" +
                         '                </tbody></table>' + "\n" +
                         '        </div>');
  // move certain items to the Other Operations list
  $('#operationsSection tr:has(#delete_issue)').remove().appendTo('#otherOperationsSectionTBody');
  $('#operationsSection tr:has(#move_issue)').remove().appendTo('#otherOperationsSectionTBody');
  $('#operationsSection tr:has(#clone_issue)').remove().appendTo('#otherOperationsSectionTBody');
  $('#operationsSection tr:has(#attach_screenshot)').remove().appendTo('#otherOperationsSectionTBody');
  $('#operationsSection tr:has(#vote_issue)').remove().appendTo('#otherOperationsSectionTBody');

  // move leftColumn div to the bottom of the document
  $('body table:first td:first').remove().appendTo('body').wrap("<div id='leftColumn'><table cellpadding='0' cellspacing='0' border='0'><tr id='leftColumnTR'></tr></table></div>");
  $('#leftColumnTR').append('<td style="width:40px;background-color:#0000FF">&nbsp;</td>');
  $('#leftColumn > table').css({
    borderRight: '1px solid #333333',
    borderBottom: '1px solid #333333',
  });
  $('#leftColumn').css({
    backgroundColor:  '#F0F0F0',
    left:       '-203px',
    position:   'fixed',
    top:        '30px',
    width:      '213px'
  }).hover(function(){ // on mouse over
    $(this).css('z-index', 10);
    $(this).animate({
      left: '0px',
      width: '210px'
    }, "fast");
    $(this).css('width', normalWidth + 'px');
  }, function(){ // on mouse off
    $(this).css('z-index', 8);
    $(this).animate({
      left: '-203px',
      width: '213px'
    }, "fast");
  });
  // make menu sections collapsible
  $('#leftColumn table table table:first').css("cursor", "pointer").click(function(){
    $('#leftColumn table table table#issuedetails').toggle();
  });
  $('#leftColumn table table #workflowactions table:first').css("cursor", "pointer").click(function(){
    $('#leftColumn table table #workflowactions table#available_workflow_actions').toggle();
  });
  $('#leftColumn table table .operations table:first').css("cursor", "pointer").click(function(){
    $('#leftColumn table table .operations table#operationsSection').toggle();
    $('#leftColumn table table .otherOperations table#otherOperationsSection').toggle();
  });
  $('#leftColumn table table .otherOperations table:first').css("cursor", "pointer").click(function(){
    $('#leftColumn table table .otherOperations table#otherOperationsSection').toggle();
    $('#leftColumn table table .operations table#operationsSection').toggle();
  });
  // hide Other Operations menu section by default
  $('#leftColumn table table .otherOperations table#otherOperationsSection').hide();

  // ====================================================== // Image attachment lightbox
  var $curtain = $('<div id="curtain"></div>')
    .css({
      backgroundColor: '#000000',
      opacity: '0.5',
      width: $(document).width() + 'px',
      height: $(document).height() + 'px',
      position: 'absolute',
      top: '0px',
      left: '0px',
      zIndex: '8000'
    });
  var $lightbox = $('<div id="lightbox"></div>')
    .css({
      display: 'none',
      backgroundColor: '#FFFFFF',
      zIndex: '8080',
      padding: '5px'
    });
  var $loading = $('<div id="loading">loading...</div>')
    .css({
      fontSize: '28px',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: '#FFFFFF',
      zIndex: '8080',
      padding: '10px',
      width: '200px'
    });

  // Make the image attachments popup in a lightbox
  // For each image thumbnail
  var imageList = new Array();
  $('#issueDetailsTable img').each(function(e){
    // Traverse to the parent anchor tag
    var imageUrl = $(this).parents('a').attr('href');
    if (imageUrl) {
      imageList.push(imageUrl);
    }
  });
  var currentImageIndex = 0;

  $('#issueDetailsTable img').each(function(e){
    // Traverse to the parent anchor tag
    $(this).parents('a').click(function(){
      currentImageIndex = e;
      // Append the curtain to the body
      $('body').append($curtain).append($lightbox).append($loading);
      // Center the loading text
      $loading.centerInWindow();
      // Add the image to the lightbox
      $('<img />')
        .attr('src', imageList[currentImageIndex])
        .load(function() {
          $loading.hide();
          $lightbox.append($(this).fitImageInWindow()).centerInWindow().show();
        })
        .click(function() {
          $loading.show();
          currentImageIndex++;
          if (currentImageIndex == imageList.length) currentImageIndex = 0;
          $(this).attr('src', imageList[currentImageIndex]);
        });
      // Curtain click to remove the lightbox
      $curtain.click(function(){
        $lightbox.hide().children('img').remove();
        $lightbox.remove();
        $loading.remove();
        $curtain.remove();
      });
      // Prevent the click
      return false;
    });
  });
}




// =======================================
// ==  helpers for reordering subtasks  ==
// =======================================

function handleSubtaskReorder(elem) {
  queueSubtaskSortOrder(elem);
}

// this one works, but for one at a time
function updateSubtaskSortOrder(elem) {
  var newRow = getNewSubtaskRow(elem);
  var url = $(elem).children("td.streorder").children("a").attr("href");
  // grab the last digit (subTaskSequence) and replace it
  var paramName = "&subTaskSequence="
  var paramPos = url.search(paramName);
  url = url.substring(0, paramPos + paramName.length) + newRow;
  window.location.href = url;
}

// queue up a list of changes
var subtaskSortOrderChangeList = new Array();

function queueSubtaskSortOrder(elem) {
  showCommitChanges();
  var currentRow = getCurrentSubtaskRow(elem);
  var newRow = getNewSubtaskRow(elem);
  var url = getMoveIssueUrl(elem, currentRow, newRow);
  $(elem).addClass("movedSubTask");
  subtaskSortOrderChangeList[subtaskSortOrderChangeList.length] = url;
  updateIssueTableRows();
}

function showCommitChanges() {
  if ($('#commitChanges').length == 0) {
    $("body").append("<div id='commitChanges'" +
                     " style='position:fixed;top:100px;left:100px;background-color:#ffffff;border-style:solid;border-width:1px;z-index:" + getNextHighestZindex() + ";'/>");
    $('#commitChanges').append("<table style='width:100%'><tbody id='commitChangesTable'/></table>");
    $('#commitChangesTable').append("<tr style='background-color:#f0f0f0;'><th>Commit Pending Changes</th></tr>");
    $('#commitChangesTable').append("<tr><td><input type='button' value='Commit Pending Sub-Task Order Changes'" +
                                    " onclick='updateAllSubtaskSortOrder()'/>*</td></tr>");
    $('#commitChangesTable').append("<tr><td>*updates may take a while</td></tr>");
    $('#commitChanges').draggable();
  }
}

function createShadowBoxBackground() {
  $("body").append('<div id="shadowBox" />');
  $("#shadowBox").css({
      backgroundColor: '#000000',
      opacity: '0.5',
      width: $(document).width() + 'px',
      height: $(document).height() + 'px',
      position: 'absolute',
      top: '0px',
      left: '0px',
      zIndex: getNextHighestZindex()
  });
}

function updateAllSubtaskSortOrder() {
  createShadowBoxBackground();
  $("body").append("<div id='loadResults' style='display:none;' />");
  updateSingleSubTask(0);
}

function updateSingleSubTask(i) {
  if (subtaskSortOrderChangeList.length > 0 && i >= 0 && i < subtaskSortOrderChangeList.length) {
    if (i < subtaskSortOrderChangeList.length - 1) {
      // untested...
      $.ajax({
        url: subtaskSortOrderChangeList[i],
        success: function(result) {
          if(result.isOk == false) {
            alert(result.message);
          } else {
            updateSingleSubTask(i + 1);
          }
        },
        async: false
      });

      //alert("Loading to " + subtaskSortOrderChangeList[i]);
      /*
      $("#loadResults").load(subtaskSortOrderChangeList[i], function() {
          updateSingleSubTask(i + 1);
      });
      */
    } else {
      //alert("Going to " + subtaskSortOrderChangeList[subtaskSortOrderChangeList.length - 1]);
      window.location.href = subtaskSortOrderChangeList[subtaskSortOrderChangeList.length - 1];
    }
  }
}

function getCurrentSubtaskRow(elem) {
  var currentrow = $(elem).children("td.stsequence").text().trim();
  return parseInt(currentrow.substring(0, currentrow.length - 1)) - 1;
}

function getNewSubtaskRow(elem) {
  var elemId = $(elem).attr('id');
  var newRow = 0;
  var currentRow = 0;
  $("#issuetable tbody").children().each(function() {
    if ($(this).attr("id") == elemId) {
      newRow = currentRow;
    }
    currentRow++;
  });
  return newRow;
}

function getMoveIssueUrl(elem, currentRow, newRow) {
  var url = $(elem).children("td.streorder").children("a").attr("href");
  var idEnd = url.search("&");
  return url.substring(0, idEnd) + "&currentSubTaskSequence=" + currentRow + "&subTaskSequence=" + newRow;
}

function updateIssueTableRows() {
  var sequence = 1;
  $("#issuetable").children("tbody").children("tr").each(function() {
    var htmlVal = $(this).children("td.stsequence").html();
    var textVal = $(this).children("td.stsequence").text();
    $(this).children("td.stsequence").html(htmlVal.replace(textVal, (sequence++) + "."));
  });
  updateIssueTableRowStyles();
}

function updateIssueTableRowStyles() {
  $("#issuetable").children("tbody").children("tr:even:visible").addClass("rowNormal").removeClass("rowAlternate");
  $("#issuetable").children("tbody").children("tr:odd:visible").addClass("rowAlternate").removeClass("rowNormal");
}




// ==============================================================
// ==  Functions for conditionally showing "support" subtasks  ==
// ==============================================================
var supportIssueTypeMap = {"Database Changes": true, "Reference Table Update": true, "Pentaho Task": true, "Actuate Task": true, "LDAP Task":true};
function enableHidingSupprtIssueTypes() {
  $("#issueContent").children("ul.tabs.horizontal")
  .append("<li> <a>&nbsp;<input id='hideSupportSubTasks' type='checkbox' name='hiddenIssues' value='Support'> <label for='hideSupportSubTasks'>Hide Support Issues</label></input></a></li>")
  .append("<li> <a>&nbsp;<input id='hideClosedSubTasks' type='checkbox' name='closedIssues' value='Closed'> <label for='hideClosedSubTasks'>Hide Closed Issues</label></input></a></li>");
  $('#hideSupportSubTasks').change(function() {toggleSubTaskVisibilty();});
  $('#hideClosedSubTasks').change(function() {toggleSubTaskVisibilty();});
  markHideableSubTasks();
}


function markHideableSubTasks() {
  $("#issuetable tbody").children("tr").children("td.issuetype").children("a").children("img").each(function() {
    if (supportIssueTypeMap[$(this).attr("alt")] === true) {
      $(this).closest("tr").addClass("supportIssueType");
    }
  });
  $("#issuetable tbody").children("tr").children("td.status").children("img[alt='Closed']").closest("tr").addClass("closedSubTask");
}


function toggleSubTaskVisibilty() {
  $("#issuetable tbody").children("tr").show();
  if ($('#hideSupportSubTasks').is(':checked')) {
    $("#issuetable tbody").children("tr.supportIssueType").hide();
  }
  if ($('#hideClosedSubTasks').is(':checked')) {
    $("#issuetable tbody").children("tr.closedSubTask").hide();
  }
  updateIssueTableRowStyles();
}


var tableSortHelper = function(e, ui) {
  ui.children().each(function() {
    $(this).width($(this).width());
  });
  return ui;
};

function makeSubTasksSortable() {
  $("head").append("<style type='text/css'>tr.rowNormal.movedSubTask {background-color: #FFC8C8} tr.rowAlternate.movedSubTask {background-color: #FF5353}</style>");
  $("#issuetable tbody").sortable({helper: tableSortHelper})
    .disableSelection()
    .bind("sortupdate", function(event, ui) {handleSubtaskReorder(ui.item);});
}



$(document).ready(function() {
  makeSubTasksSortable();
  enableHidingSupprtIssueTypes();
});




// make textareas more usable
try {
  $("#timetrackingFieldArea").hide(); // hide Original Estimate
  $("#customfield_10192FieldArea").hide(); // hide QA estimated hours
  $("#customfield_10133FieldArea").hide(); // hide Sales Force ID
  $("#customfield_10123FieldArea").hide(); // hide documentation status
  $("#customfield_10137FieldArea").hide(); // hide committed date
  $("#customfield_10004FieldArea").hide(); // hide quality engineer
  $("#customfield_10300FieldArea").hide(); // hide QA completion date
  $("#customfield_10420FieldArea").hide(); // hide issues found during QA
  $("#customfield_10430FieldArea").hide(); // hide enhancements found during QA
} catch (e) {
  alert(e);
}


/****************************************************************************************************************************************************************************
      End "JIRA UE Enhancements" code
 ****************************************************************************************************************************************************************************/






/*******************************************************************
     Add scrollbars to panel content
 *******************************************************************/
function resizePanelContent() {
  // look for divs with the classes codeContent, panelContent, or action-body
  $('.codeContent, .panelContent, .action-body').filter('div').css({overflow: 'auto', width: '10px'});
  $('.codeContent, .panelContent, .action-body').filter('div').each(function () {
    this.style.width = (this.parentNode.offsetWidth - 12) + 'px';
  });
}
resizePanelContent();




/*******************************************************************
     Links to Wiki markup templates
 *******************************************************************/
function getWikiMarkupLink(label, templateHtml) {
  return "<a href=\"javascript:void(0)\" onClick=\"$('#comment').insertAtCaret(" + templateHtml + ")\">" + label + "</a><br />"
}

$('#commentFieldArea').each(function () {
  $('#commentFieldArea td:last div:first').wrap("<div id='fieldToolArea' class='field-tools'><table id='fieldToolTable' cellpadding='0' cellspacing='0' border='0'><tr><td id='currWikiTools'></td></tr></table></div>");
  $('#fieldToolTable tbody:first').append("<tr id='wikiQuickLinks'/>");
  $('#wikiQuickLinks').append("<td id='wikiQuickLinksContainer'/>");
  $('#wikiQuickLinksContainer').append(getWikiMarkupLink("{code:sql}", "'{code:sql}' + '\\n\\n' + '{code}'"));
  $('#wikiQuickLinksContainer').append(getWikiMarkupLink("{code:java}", "'{code:java}' + '\\n\\n' + '{code}'"));
  $('#wikiQuickLinksContainer').append(getWikiMarkupLink("{noformat}", "'{noformat}' + '\\n\\n' + '{noformat}'"));
  $('#wikiQuickLinksContainer').append(getWikiMarkupLink("{color:red}", "'{color:red}{color}'"));
  $('#wikiQuickLinksContainer').append("<a href=\"javascript:void(0)\" onClick=\"$('#comment').val('');\">Clear Comment</a><br />");
  $('#currWikiTools div:first').removeClass('field-tools');
});




/**********************************************************************************
 **       Explode Issue Details along the top                                    **
 **********************************************************************************/
$('body').prepend('<div style="left:0px;position:fixed;top:0px;width:100%;z-index:10;" id="topIssueDetailsDiv"><div style="width:100%;"><table id="topIssueDetailsTable"><tr id="topIssueDetailsHeaderTr"><td /></tr><tr id="topIssueDetailsTr"><td>|</td></tr></div></div>');
$('#topIssueDetailsDiv').css('backgroundColor', '#f0f0f0');
$('#issuedetails tr').filter(':not(:contains("Votes:"))').filter(':not(:contains("Watchers:"))').each(function () {
  $('#topIssueDetailsTr').append($(this).children('td:first'));
  $('#topIssueDetailsTr').append($(this).children('td:last'));
  $('#topIssueDetailsTr').append('<td>|</td>');
});
$('body').prepend($('#topIssueDetailsDiv div:first').clone());




/**********************************************************************************
 **      Add mass change link
 *********************************************************************************/
/*
 $(".streorder").each(function(index) {
  $(this).append('<input type="text" name="subtask_order_' + index + '" value="' + (index + 1) + '" size=1 />');
});
$('#subtask_container_vertical').css('marginTop', '-20px').prepend('<table width="100%"><tr><td width="90%">&nbsp;</td><td width="10%"><a href="http://www.google.com">reorder subtasks</a></td></tr></table>');

*/

/*******************************************************************
     Automatic login redirection
 *******************************************************************/
try {
  var linkVal = $("#header-details-user > a:first").attr("href");
  if (linkVal.indexOf("/login.jsp") == 0 && document.location.href.indexOf("https://products.sircon.com/login.jsp") == -1) {
    window.location.href = linkVal;
  }
} catch (e) {
  ;
}


}


/**********************************************************************************
 **      specificly for ConfigureFieldScreen
 *********************************************************************************/
 $(document).ready(function() {
  if (document.location.href.indexOf("https://products.sircon.com/secure/admin/ConfigureFieldScreen.jspa") >= 0) {
    $('#field_table').find('tr.rowNormal, tr.rowAlternate').each(function(index) {
      var $parentTr = $(this);
      var parentIndex = index;
      $(this).find('TD:first').click(function() {
        $parentTr.find('input[name="removeField_' + parentIndex + '"]').each(function() {this.checked = !this.checked});
      });
    });
  }
});