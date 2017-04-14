function callDropbox(command, parameter, token, header) {
  var payload;
  var url = "";
  var params = {
    "method"  : "post",
    "payload" : "",
    "headers" : {"Authorization" : "Bearer " + token},
    "muteHttpExceptions" : true,
  }
  
  switch (command) {
    case "get_metadata":
      params.payload = JSON.stringify({
        "path": parameter,
      });
      params.contentType = "application/json";
      url = "https://api.dropboxapi.com/2/files/get_metadata";
      break;
    case "upload":
      params.payload = parameter;
      var keys = Object.keys(header)
      for (var i = 0; i < keys.length; i++) {
         params.headers[keys[i]] = header[keys[i]];
      }
      params.contentType = "application/octet-stream";
      url = "https://content.dropboxapi.com/2/files/upload";
      break;
  }
  
  return UrlFetchApp.fetch(url, params);
}

function fileExists(fPath, token) {
  var response = callDropbox("get_metadata", fPath, token);
  if (response[".tag"] == "file") {
    return true;
  } else {
    return false;
  }
}

function getFileTimeStamp(fPath, token) {
  var response = JSON.parse(callDropbox("get_metadata", fPath, token));
  if (response[".tag"] == "file") {
    var arrTime = response.client_modified.split(/[\-TZ\:]+/);
    return Date(arrTime[0], arrTime[1] - 1, arrTime[2], arrTime[3], arrTime[4], arrTime[5]);
  } else {
    return false;
  }
}

function uploadFile(fPath, payload, date, token) {
  var header = {
    "Dropbox-API-Arg" : JSON.stringify({
      "path": fPath,
      "mode": {".tag" : "overwrite"},
      "client_modified": date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "T" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "Z",
      "mute" : true
    })
  }
  callDropbox("upload", payload, token, header);
}