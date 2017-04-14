var main_dir  = "";
var whitelist=[];
var dbx_token = "";
var mdl_token = ""
var mdl_url   = ""

function sync() {
  var files = getFiles(mdl_url, mdl_token, whitelist);
  for (var i = 0; i < files.length; i++) {
    var fPath = main_dir + files[i].course + "/" + files[i].module + "/" + files[i].fileName;
    var date = getFileTimeStamp(fPath, dbx_token);
    if ((date == false) || (date < files[i].time)) {
      uploadFile(fPath, downloadFile(files[i].url), files[i].time, dbx_token);
    }
  }
}

function downloadFile(url) {
  return UrlFetchApp.fetch(url).getContent();
}