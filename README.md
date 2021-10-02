# QuoMediaView
Offline image board inspired by booru sites
![starting site](https://raw.githubusercontent.com/MrQuerter/QuoMediaView/4651fcae50616426b7ad17c043d140768378a9ae/screens/Zrzut%20ekranu%20z%202021-05-25%2018-01-26.png)

# Features
* search images in your folder using your own tags through search and block bars
* tagging images/animations and videos using clickable graphical user interface
* setting your own colors for search bar, block bar, media borders and tag groups
* fully offline so you can run it from USB memory sticks or anywhere else you want
* doesn't need any Cookies or Web Storage
* setting your own thumbnails if you want to
* keeps aspect ratio of your images both on single view and search thumbnails
* everything including settings is saved in JSON format
* automatic loading of your media database by pasting JSON code into .js file in provided space
* 2 different viewing methods of files: a) by clicking with left mouse button which opens lightbox; b) by middle or right clicking the image which opens detailed view with info and rotate buttons
* your database is displayed using subpages with newest added files on the front and you can choose how many thumbnails one page can display
* no frameworks - pure/vanilla JavaScript, HTML5 and CSS3

# Installing
1. Download zip file using green "code" button on project site or clone it with git
2. Extract it to a folder of your choosing
3. Open the quomediaview.html using your browser

# Browsing existing databases
1. Copy and Paste the JSON code into text input you see at the start or into the .js file if you're not making any changes
2. You can browse all of your media using tags that you added to either search for them or block them.

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

# Name and why was it created
Name doesn't mean anything since I used the qview name when developing it, but due to it already being used in multiple places I decide to go for unique name. I also wanted it to have something polish sounding, but the only thing that came in mind was "quo vadis" by famous polish writer so I used it.
It was created because I found sorting all my images/memes and videos a bother since there's no good way to group them with folders when they can have multiple things in them so you would need to put them in 2 folders, but then it takes more space. I stumbled upon anime fanart sites and there was a perfect grid based view with tags which seemed perfect for the task so after a while of thinking about it and me being even more bothered due to .webp format not being supported on windows 7 and having to keep videos and gifs in different folders since gallery viewers can't show videos I started to work on quomediaview.
It needed to be portable, don't require setting up any servers and be easy to use.

# Compatibility
I started it on windows 7 firefox, I don't remember the version but it was after the Quantum Edition and finished it also on firefox Quantum Edition, but this time on linux mint. So you should be able to run it if you use windows 7 or newer versions and relatively recent linux distros. I still don't know everything about it and all the different file systems, but it should work without problems anyway. Other systems may work, but you need to have HTML5 compatible browser and mobile versions will still show the same stuff that is visible on desktop since it was not altered for mobile (most of the stuff is even now in percentage instead of pixels so it may change accordingly, but it was mostly created to be used on normal 1920x1080 screen). You can let me know if it doesn't run on devices that should be compatible.

# Demo Database
It was used by adding few of my own photos and downloading the images from public domain sites, but in the event you are the owner of one of them contact me and I'll delete them. I also release all of mine images that I added here to public domain so you can use them if you want (this does not include the quomediaview logo from the qmvfiles folder)

# License and contributions
It is licensed in AGPL because even though the probability of someone taking the code and closing it is extremely low I still want it to be always available to users. AGPL is perfect for that because you technically can upload it to the server and then use it to serve users a webpage. Don't know why wyou would use this project for that, but whatever. 
I will not accept any contributions because I want to keep total control of this project so I can license it on different terms to people that would want to have it available differently and it is harder to do so while you have many people working on the project. You are free to fork it and I would even want to see it being done because you can easily swap the quomediaview since JSON code is portable and someone more talented than me can make a better version so it would be nice to see it. This one will always be kept as the simplest one without any frameworks.

# Known issues
* sorting tags doesn't sort numbers from smallest to biggest

# Future updates
Don't expect them soon:
* duration attribute for the video files (and animations?) so you can sort them by length
* improved lightbox view with better controls that don't take space and few tools like rotating
* dynamically changing settings so you don't need to click "save"
* changing the size of thumbnails with preview
* changing the size of thumbnail borders (and style?)
* toggling the square thumbnails so it doesn't leave the spaces but loses the aspect ratio
* displaying options on the left side in place of tags menu so you can preview all the changes
* new tools in the detailed view like for example zoomin in/out, css filters (sepia, black&white)
* rotating images on your own angle not multiples of 90 degrees
* better subpages javascript code (function will not change but it will be less frustrating)
* interface translations support (you can translate tags currently, but nothing else this easily)
* more sorting tags options including the numbers from smallest to biggest and reversed
* statistics page where you can see total/average duration of your videos, average tag count, biggest tags, smallest tag count. (size of your database?)
* merging the search and block bar in one text input. Searched tags won't have any change, but blocked tags would need a minus "-" sign in front of them
* auto assigning of border tags and filetypes
* light mode and a new .css file with just the visuals for easy change of styles
* software that scans your files and creates a database where you must only tag them with your own tags since it would know location, name and filetypes
