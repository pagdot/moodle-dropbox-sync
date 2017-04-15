# moodle-dropbox-sync
Google Apps Script to copy files from moodle courses to a Dropbox folder

# Setup
 * Create a new Google Apps Script project https://script.google.com/intro
 * Create files in project
 * copy source files into project
 * configure global vars (see *Configuration*)
 * Run Project and/or set triggers (Edit/Current Project's Triggers)

## Configuration
change the global variables:
 * `main_dir`: the Path in your Dropbox folder to put the file structure
 * `whitelist`: a list of strings to filter courses
 * `dbx_token`: your Dropbox developer token. See the *Token*-Section
 * `mdl_token`: your Moodle webservice token. See the *Token*-Section
 * `mdl_url`: your Moodle server address
 
## Tokens

### Dropbox
 1. Open https://dropbox.github.io/dropbox-api-v2-explorer/#files_copy
 2. Click on *Get Token*
 3. Copy generated Token
 
### Moodle
 1. Replace *HOST* with your Moodle server address, *USERNAME* with your username and *PASSWORD* with your password when opening link https://HOST/login/token.php?username=USERNAME&password=PASSWORD&service=moodle_mobile_app
 2. copy Token from HTTP response
