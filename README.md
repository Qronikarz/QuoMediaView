# QuoMediaView
Offline media tagging board inspired by booru sites.
![starting site](https://raw.githubusercontent.com/MrQuerter/QuoMediaView/4651fcae50616426b7ad17c043d140768378a9ae/screens/Zrzut%20ekranu%20z%202021-05-25%2018-01-26.png)

# Features 
* Search your media with your own tags
* Mouse friendly
* Set your own colors for pretty much anything
* Fully offline, can even be run from USB
* Data is saved using JSON and doesn't require any cookies
* Set your own thumbnails for every file
* Keeps aspect ratio
* 2 different viewing methods of files
* No frameworks used - Pure/Vanilla JavaScript, HTML5 and CSS3
* Clickable subpages for which you can customize the number of files shown

# Installing
1. Download zip file using green "code" button on project site or clone it with git
2. Extract it to a folder of your choosing

# Browsing existing databases
1. Open the quomediaview.html using your browser
2. Copy and Paste the JSON code into text input you see at the start or into the .js file if you're not making any changes
3. You can browse all of your media using tags that you added to either search for them or block them.

* Clicking with left mouse button opens lightbox where you can quickly view your media with clicks in near fullscreen mode
* Clicking with middle mouse button or with right mouse click by opening in new tab/window opens a media view subpage where you can see some details such as path, name, used tags and have the ability to rotate every media including videos
* search by either typing the tags yourself (replace the space with underscore) or by clicking the name of the tag or minus button
* if you want to search multiple tags separate them with space
* search will only return results which pass all of the required tags you chose. If you type two tags in search bar and one in block bar it will only show files that have both of the searched tags and it will not show any that have the blocked tag.
* due to how it is currently implemented (my skill also was at fault) you must first use the search bar and then block bar. It may be improved in the future.

# Creating new databases and adding new files
1. Generate empty quomediaview JSON code either before loading the code or in the settings
2. Load it
3. Add images either by dragging them over to your browser or from the settings using file input (you can select multiple at once)
4. Edit interface will automatically open and you can set folders, file name, thumbnails, description, tags and delete them from database.
5. You MUST set folder with filename and only one of the border tags or it will not work correctly.

* Tags MUST be unique in the whole database
* Tags that have more than 1 word MUST have the space sign replaced with underscore "_" sign
* You can edit existing files by clicking the edit button and clicking the thumbnails of the image/animation/video you want to change

# Few tips and good practices
* Even though quomediaview supports having your media in few different folders I recommend keeping them in one folder because the 1st folder is automatically used when adding files so it takes less to set them up
* all of the files are added into the database with relative location of the .html file so changing the folders will require making changes in database
* Tags must have spaces replaced with underscore which also means it is best to not create any tags that use them for different reason
* I recommend keeping the tag names just with text and numbers. No symbols so the JSON code structure isn't destroyed. (utf-8 letters like for example polish ą ę ł ć ń ó ź etc. work so you can try experimenting)
* I recommend naming your files without spaces, but didn't notice anything to break with few ones that I forgot to rename
* Keep a backup of your database JSON code on a different drive just in case. You can even encrypt it. It is up to you to save it whenever you make any changes. Especially keep this in mind when using the automatic loading from .js file since if you replace it with updated version from github you will lose your pasted JSON code.

# Options and tag editing
In options there are few things you can set/use:
* open tags editing menu
* add new files using file input
* showing thumbnails (if you added any)
* max number of files on 1 subpage
* info icon that shows when you added an explanation to one of your tags
* colors of search & block bars and thumbnail border colors
* virtual location which you can use to make the quomediaview think it is located elsewhere. It is useful if you have a USB memory stick that is already sorted with images few folders inside, but want to have .html file of quomediaview show on the first opening.
* sorting all tags alphabetically (numbers don't sort from smallest to biggest so keep this in mind)
* resetting the settings to default (only the settings)
* exporting existing database to JSON code so you can save it or creating an empty new database

In tags editing menu you can:
* change the tag group name
* change the tag group color
* hide the tag group from displaying in the menu (search will still be possible)
* delete the tag group
* change the name of existing tags
* add explanation to existing tags
* delete existing tags
* add new tags
* add new tag groups

# Name explanation
Name doesn't mean anything.

I used the qview name when developing it, but due to it already being used in multiple places I decided to go for a unique name for easier internet searching. I also wanted it to have something sounding a little Polish, but the only thing that came in mind was "quo vadis" which is not in fact Polish but it was a book written by a famous Polish writer which most people heard about so I settled on that.

# Why it was created
It was created because I found sorting all my images, memes and videos a bother since there's no good way to group them with folders when they can have multiple things in them. You would need to make a copy or shortcut for every folder in 2 folders, but then it takes more space or is messy with shortcuts.

I have stumbled upon anime fanart sites and there was a perfect grid based view with tags which seemed perfect for my sorting problem so after a while of thinking about it and me being even more bothered due to .webp format not being supported on windows 7 and having to keep videos and gifs in different folders I started to work on quomediaview.
I needed it to be portable on USB, don't require setting up any servers and be easy to use.

# Compatibility requirements
Modern HTML5 browser with JavaScript enabled and access to files in a folder.

QuoMediaView shouldn't use anything that requires features from Firefox 116 and above. Bonus points for also supporting Chromium browsers below version 110. Which essentialy means Firefox 115 and Chromium 109 which are the last Windows 7 browsers is the upper limit requirement for new features.

I have started making it on Firefox Quantum on Windows 7 and later moved to Linux Mint 20 which I continue to use after updating

It should also work on other Operating Systems such as macOS, iOS, BSD and android but I don't have access to these first two and QMV wasn't made with smartphones in mind so it might not be mobile friendly. Feel free to inform me if or how it works if you tried it on those Operating Systems.

# Demo/Example database
It was made by downloading public domain media and few of my own photos and images that I needed to showcase some features that didn't make it yet.
All my own media in demo/example database excluding the QuoMediaView Logo I am also releasing to public domain because I can do that and it sounds fair when I used other public domain media.

If you are by any chance an owner of some image just contact me and I will remove it from here

# License
I decided to use AGPL because I want it to be always available to users. AGPL is the only choice since GPL can be exploited in some cases and QuoMediaView being essentially a web page makes this even easier.

# Contributions
I will not accept any code contributions.
I want to keep total ownership of the code so I can dual license it when there's such a need. 

You are free to fork it and I would be thrilled to see it happen since the QMV JSON code should be portable and someone more talented than me can make a better version of QuoMediaView so it would be nice to see it.

# Known issues & Future updates
Moved to GitHub Issues for easier managing + to have the issue count irritate and nag the main developer. 
