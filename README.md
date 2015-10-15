# A responsive, browser-based PHR.

## Dev Setup

From the app directory run `npm install [packageName]` for installing grunt and all the dependencies listed on "package.json". Or download a zip https://www.dropbox.com/s/o11rx6ipozy403a/node_modules.zip?dl=0 and uncompress it on the project folder.

### Run local server

Run `grunt` then navigate to http://127.0.0.1:3000/ to see this page in browser. If you make any changes, grunt will compile again the app and you could see the changes refreshing the page.

### Server files

For runing on a web server you just need the files under the "www" folder.

### Phonegap files

The phonegap project is under the "app" folder inside the project folder.


### Compile for Ios

For compiling the native version of the app you have to open the terminal on the project folder, and run `grunt build` firts and then `grunt cordova_ios`. After that, open "eHealthRecords.com/app/platforms/ios/eHealth Records.xcodeproj" with Xcode and from the menu go to "Product/archive". When the compilation end, a window will be open and you have to select "Export", then select "Save for Ad Hoc Deployment" and follow the workflow to export the file. When this finish, you have to upload the file TestFlight.