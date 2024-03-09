# QuoMediaView
Portable offline media tagging board inspired by booru sites.
![Starting/Main site view with grid thumbnails](https://raw.githubusercontent.com/Qronikarz/QuoMediaView/cd92469eea589b39ae2364892fa73ea7c4ec8fba/main_screen.png "QMV starting and main results page")

# Features 
* Search media with custom tags
* Mouse friendly
* Highly customizable and themable
* Fully offline and portable even from USB memory
* Data saved in exportable JSON format
* Different viewing methods of media - side panel, lightbox, new tab, file edit
* No frameworks used - Pure/Vanilla JavaScript, HTML5 and CSS3

# Current update focus
WARNING, decided to switch to pre-release versioning as I will be testing various ideas and everything is expected to break. New 1.0 version will come after all current issues and features are fixed/added. Use current versions without any warranty that they'll be able to update.

QMV v0.3 - File details update - size, resolution, framerate, duration. Need of manual fixing of QMV JSON. Sponsored by not having portable file browser that reads video duration.
For even more future plans visit QuoMediaView GitHub Issues

# Compatibility requirements
Modern HTML5 browser with JavaScript enabled and access to files in a folder.

QuoMediaView shouldn't use anything that needs browsers higher than Firefox 115 and Chromium 109 which are the last Windows 7 browsers

It was started on Firefox Quantum on Windows 7 and later finished in Linux Mint 20 which remains the main OS for now.

It should also work on other Operating Systems such as macOS, iOS, BSD and Android, but it wasn't tested there.

# Why was it created?
Two main things at the time: wanting to have one image in many folders that describe what is on the image and .webp format which windows 7 didn't support. Adding to that was also the need to open .gif files and videos in different apps. Due to no patience with running a server with already existing projects it was decided to make my own media tagging board inspired by anime fanart sites. It needed to be portable on USB, don't require setting up any servers and be easy to use.

# Installing
1. Download the files
2. Move them to a folder of your choosing

# Browsing existing databases
1. Open the quomediaview.html using your favorite browser (it needs to have access to all files in the folder)
2. Copy and Paste QMV JSON code into text input you see at the start or into the beginning of .js file if you're not going to make any more changes
3. Press enter and wait few seconds for it to load

* Clicking with left mouse button opens side panel or lightbox (configurable in settings)
* Lightbox uses whole screen, has an autohide toolbar and a slide show mode with two directions - next and random. It also allows using arrow keys and Esc
* Side panel is used for quick preview of files and shows relative file path, file description, tags of the file and some details like resolution
* Clicking with mouse wheel or with right mouse click by opening in new tab/window opens a single media view subpage which has some css tools and filters
* Search by either typing the tags yourself (replace the space with underscore) or by clicking the name of the tag in the menu
* If you want to search multiple tags separate them with space
* Searching will only return results which have all of the tags you typed
* The minus icon next to tag name is used for blocking the tags
* Settings buttons opens side menu with options to change pretty much everything and a button to open QMV InfoStats page
* In QMV InfoStats you can see some details of the current database you're looking at and also export it or move to other section

# Creating new databases and adding new files
1. Generate empty QuoMediaView JSON code either before loading the code or in the QMV Info Stats menu
2. Load it
3. Add images either by dragging them over to your browser (but not to the menu area) or from the settings using file input (you can select multiple files at once)
4. You can set folders, file name, thumbnails, description, tags and delete them from database in filesedit view
5. You MUST set folder with filename since QuoMediaView doesn't automatically know where your files are placed

# Few tips and good practices
* Tags MUST be unique in the whole database
* There is support for many folders, but having all media in first folder with id 1 makes it easier to add new files since this folder id is used by default
* QuoMediaView has access only to files that have correct paths. So if you change the folder or file name in your computer it won't work without also changing it in QuoMediaView
* Tags replace spaces with underscores
* Tags shouldn't use symbols to not risk breaking the JSON save structure. (UTF-8 letters like for example polish ones - ą ć ę ł ń ó ś ż ź work so you can try experimenting with your own)
* Keep a backup of exported QuoMediaView JSON. You can even throw it into password protected archive if you want. Especially keep a backup if you use auto loading from js file to not overwrite it when updating the file manually.
* Before adding new files to the QMV database you should check for duplicates in your OS. I reccomend using [qarmin's'czkawka](https://github.com/qarmin/czkawka) for that.

# Name explanation
Name doesn't mean anything.

Qview name was used when developing it, but due to it already being used in multiple places I decided to go for a unique name for easier internet searching. I also wanted it to have something sounding a little Polish, but the only thing that came in mind was "quo vadis" which is not in fact a Polish phrase but it was a book written by a famous Polish writer which most people in Poland heard about so I settled on that.

# Demo/Example database
It was made by downloading public domain media from specific websites and adding some of author's own images that were needed to showcase some features.

If you are by any chance an owner of some image just contact me and it will be removed

# License
AGPL was the only choice since QuoMediaView is essentially just a web page which makes it possible to exploit GPL and all the changes to QMV should be available to all users.

# Contributions
Code contributions will not be accepted.

Users are free to fork it and change it in any way they want with respect to the license.
