# QuoMediaView
![QMV Logo](/qmvfiles/quomediaview.svg)
Offline image board inspired by booru sites
![starting site](https://raw.githubusercontent.com/MrQuerter/QuoMediaView/4651fcae50616426b7ad17c043d140768378a9ae/screens/Zrzut%20ekranu%20z%202021-05-25%2018-01-26.png)
# Why?
I always sorted my photos in folders and then run % search in windows, but it had some issues and you could only get one image to one folder so describing them was a pain. Additionaly webp pictures didn't have thumbnails and I couldn't use the % search on linux so the disadvantages piled up and I decided to create my own image viewer. It is inspired by booru sites, but only the front visuals. All of the other stuff is my own creation and I don't even know how they handle adding files and editing existing ones on other booru image boards
# Name
At first it was named qview, but not long ago I googled it and it was already used and even in some cases trademarked so I wanted to change it. I wanted to use some polish words, but the only word that came to my mind starting on q was quo which isn't even polish word just it is used in one of the famous old books by H Sienkiewicz - "Quo Vadis", but in the program name quo doesn't mean anything.
# Features
* clean/pure JS, HTML and CSS without any frameworks or libraries
* doesn't need a server, it's only front-end
* doesn't modify images
* doesn't use cookies
* runs from USB memory sticks (though I don't recommend adding some gigantic 8K resolution photos on USB 2.0 memory stick, be realistic)
* displays all of the images in database in big view allowing you to quickly browse every added file even if it's a video
* displays all search results in one grid with different colored borders for different types: photos, videos and animations
* pseudo dynamic changes of nearly everything in the database meaning you can quickly see differences
* searching by tags or blocking by tags
* displaying single files on another page with a rotate buttons working even with videos
* tags are sorted by groups, can have simple descriptions, all of them can be hidden or changed color
* thumbnails added primarily just for gifs which I couldn't figure out how to stop from autoplaying, but they work with pictures and videos
* keeps aspect ratio of media on every possible viewing mode
* automatic loading by pasting the JSON string into .js file
# Installation
If it's your first time using it I highly recommend downloading all files so you can check the demo database and see how it works for yourself. If not just copy the .html .js and .css files to a folder of your choosing and just run the .html file
# Using
When loading the site you are presented with 2 choices:
* load JSON string
* load empty database
To add new files you can drag and drop them on the section on the right of the menu or go to options and use the file input. Then the files are automatically added with folder id "1" which you must only type once in media editing window so I highly recommend only using 1 folder since then you can be certain there are no duplicates. The support for more folders is available but then you have to manually pick folder for every file which is somehow made more easy by adding it to datalist.
One of the big features is the search bar where you can type tag names or click them with mouse through menu or datalist inside (it's also the best way to search for a tag). It will only display files that have all the tags that you searched for. By click on [-] sign you can add a tag to block or type it yourself, it will block or images that have this tag.
# Important Tips
* the most important tag that you must choose are "picture" "video" or "animated" tags. They are used to add borders to the grid and in some cases even display the file since video needs different tags.
* DO NOT EVER USE \ " ' symbols because they break JSON structure. There's probably more signs that do the same, but I know only these
* If you want to create a new tag just remember to replace spaces (" ") with underscores ("_"). Only then it will work with search. If you made a mistake just go to tag editor and find it.
* As I wrote earlier I recommend keeping files in one folder
* If you decide to use automatic loading which I also plan to use myself, I suggest keeping a backup in different place. You can even encrypt it or throw it into password protected archive. When I'll be updating them
# Compatibility
I started it when I still was using windows 7, but most of it was finished on linux mint. In both cases the Firefox Browser was used. You can look at the images in screens folder to see how it's supposed to look on a 1920x1080 screen on my computer. If you have different OS or different browser you can share if everything works. Maybe I'll even consider fixing stuff that's not working.
# Contributions
I will generally not accept any code or pull requests. I want to keep this all to myself so I can relicense it or close it whenever I feel like. You can however fork it and make your own, just remember to make it compatible with current JSON database so your future image board users don't need to waste more time creating a new DB from scratch
# License
I decided to license it with AGPL because let's be honest this just a front-end and if I wanted to have it available remotely anyone could look inside and take it. So by open-sourcing it I can at least kind of prevent it because with this license everyone needs to contribute (which might contradict above section, but forks are good)
# Future updates
I wouldn't expect updates soon because I consider it done for now, but in case I get iritated with something there could a surprise update
* sorting videos by duration (this one is the most likely since on Linux Mint I can't sort files by length and it starts to throw me off)
* sorting tags by number not a string (you can sort the number tags manualy for now)
* radio tag group types (there are leftover in code for this, not complete of course)
* translations support (I started it already, but decided to drop it)
* more tools on media viewer page (maybe black and white or other css filters)
# Goals
Don't treat it as super serious list, just some goals that I'd think would be nice to meet
* watch a positive review by tech youtuber
* read a positive review by front-end site
* hear a positive review by other people
* know that it's used by celebrity
* download new fork made by someone other
* download a database made by someone other
