function getFiles(url, token, whitelist) {
  var uid = getUid(url, token);
  var courses = getCourses(url, token, uid);
  courses = filterCourses(courses, whitelist);
  var content = getCoursesContent(url, token, courses); 
  return extractFileUrls(content, token);
}

function getCourses(url, token, uid) {
  params = {
    "method"  : "post",
    "payload" : "wstoken=" + token + "&userid=" + uid + "&wsfunction=core_enrol_get_users_courses"
  }
  response = UrlFetchApp.fetch(url + "/webservice/rest/server.php?moodlewsrestformat=json", params);
  return JSON.parse(response);
}

function getUid(url, token) {
  var params = {
    "method"  : "post",
    "payload" : "wstoken=" + token + "&wsfunction=core_webservice_get_site_info"
  }
  var response = UrlFetchApp.fetch(url + "/webservice/rest/server.php?moodlewsrestformat=json", params);
  return JSON.parse(response).userid + "";
}

function filterCourses(courses, whitelist) {
  var filtered = [];
  var test = courses.length;
  for (var i = 0; i < courses.length; i++) {
    for (var j = 0; j < whitelist.length; j++) {
      if (courses[i].shortname.match(whitelist[j])) {
        filtered.push(courses[i]);
      }
    }
  }
  return filtered;
}

function getCoursesContent(url, token, courses) {
  var content = [];
  for (i = 0; i < courses.length; i++) {
    var params = {
      "method"  : "post",
      "payload" : "courseid=" + courses[i].id + "&wsfunction=core_course_get_contents&wstoken=" + token
    }
    var response = UrlFetchApp.fetch(url + "/webservice/rest/server.php?moodlewsrestformat=json", params);
    content.push(JSON.parse(response));
    content[content.length - 1].name = courses[i].shortname;
    content[content.length - 1].id   = courses[i].id; 
  }
  return content;
}

function extractFileUrls(content, token) {
  var fileUrls = [];
  for (var i = 0; i < content.length; i++) {
    for (var j = 0; j < content[i].length; j++) {
      for (var k = 0; k < content[i][j].modules.length; k++) {
        if (content[i][j].modules[k].hasOwnProperty("contents")) {
          for (var l = 0; l < content[i][j].modules[k].contents.length; l++) {
            if (content[i][j].modules[k].contents[l].type == "file") {
              var fileUrl = new Object();
              fileUrl.course = content[i].name;
              fileUrl.module = content[i][j].modules[k].name;
              fileUrl.fileName = content[i][j].modules[k].contents[l].filename;
              fileUrl.url = content[i][j].modules[k].contents[l].fileurl;
              fileUrl.time = new Date(content[i][j].modules[k].contents[l].timemodified * 1000);
              fileUrls.push(fileUrl);
            }
          }
        }
      }
    }
  }
  return fixFileUrls(fileUrls, token);
}

function fixFileUrls(fileUrls, token) {
  for (var i = 0; i < fileUrls.length; i++) {
    fileUrls[i].url = fileUrls[i].url.replace("?forcedownload=1", "") + "?token=" + token;
  }
  return fileUrls;
}