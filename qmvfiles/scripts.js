//you can paste your QuoMediaView JSON string below for automatic loading on start:
var qmvdbholder = ''
//var qmvdbholder = '' //backup for quicker switching

//empty QuoMediaView JSON string
var qmvdbtemplate = '{"quomediaviewdb":[{"qmv_settings":[{"thumbnails":true},{"gridcount":28},{"infoicon":"&#x2609;"},{"searchbar":"#90ee90"},{"banbar":"#ffc0cb"},{"b_picture":"#808080"},{"b_animated":"#ffa500"},{"b_video":"#0000ff"},{"version":"1.0"},{"baselocation":""},{"language":"en"}]},{"qmv_folders":[{"0":""}]},{"qmv_tags":[{"group-1":[{"settings":["bordergridtags","#008000","show","a_3"]},{"tags":[{"a1":[0,"picture"]},{"a2":[0,"animated"]},{"a3":[0,"video"]}]}]},{"group-2":[{"settings":["filetypetags","#87ceeb","show","b_6"]},{"tags":[{"b1":[0,"jpg"]},{"b2":[0,"png"]},{"b3":[0,"webp"]},{"b4":[0,"gif"]},{"b5":[0,"webm"]},{"b6":[0,"mp4"]}]}]},{"group-3":[{"settings":["filetechtags","#d3d3d3","show","c_1"]},{"tags":[{"c1":[0,"audio"]}]}]}]},{"qmv_files":[]}]}'

// some global variables

var globaldb = "" //stores loaded JSON data
var tagscollection = [] //all tags with ID, names, count and descriptions
var testarray = [] //testing pushing arrays and objects

var taggroupslen = 0 //to know how many tag groups there are without modifying data

var maxgridcount = 28 //how many media files are displayed on the page
var thumbnails = true //enables thumbnails
var infoicon = "&#x2609;" //stores used icon for info on tags
var baselocation = "" //allows to simulate the gallery being located elsewhere
var gridaspectratio = true //switches between square thumbnails and the ones that keep aspect ratio
var gridthumbsize = 192 //stores thumbnails size for custom values
var gridborderstyle = "solid" //hidden setting for thumbnail border style
var gridbordersize = 2 //hidden setting for thumbnail border size. Remember to adjust the margin or padding in styles.css
var sidepanelwidth = 36 //side panel preview width that will be removed from main grid view
var leftmclick = "sidepreviewpanel" //for functions to know what left mouse click needs to activate

var rotationvalue = 0 //for changing the rotation of viewed files

var searchquery = "" //keeps current search without blocklist
var inbigview = 0 //current media in big view box
var inmediaedit = 0 //current media in media edit
var currentpage = 1 //current page
var changeguard = 0 //keeps track of any changes to tags/files/settings
var insidepanelpreview = 0 //current media in side panel preview
var sidepreviewpanelactive = false //keeps track if the side panel is currently visible

var lightboxtimer = "" //time interval for lightbox slideshow

//shows warning icon to remind that there were made any changes to the database
function changesnotify() {
	if (changeguard === 1) {
		document.getElementById("savenotifier").style.visibility = "visible"
		window.onbeforeunload = function(){
		return "Do you want to leave?"
		}
	}
}

//keeps page from closing after making changes
if (changeguard === 1) {
	window.onbeforeunload = function(){
		return "Do want to leave?"
	}
}

// to view files with tags, details, path and few test tools
function singlemediaview() {
	document.getElementById("maingridview").style.display = "none"
	document.getElementById("singlemediaview").style.display = "block"
	document.getElementById("menucontrols").removeChild(document.getElementById("settings"))
	document.getElementById("menu").removeChild(document.getElementById("menulist"))
	var locationstring = decodeURI(window.location.hash)
	var mediaparams = locationstring.split("#")
	var filetype = mediaparams[2].split(".")[1].toLowerCase()
	if (filetype === "mp4" || filetype === "webm" || filetype === "ogg") {
		document.getElementById("mainframe").innerHTML = "<video id='mainvideo' class='mainmedia' src='" + mediaparams[2] + "' oncanplay='singlemediaview_continued()' controls>Your browser doesn't display videos.</video>"
	} else {
		document.getElementById("mainframe").innerHTML = "<span id='mainpicturelink'><img src='" + mediaparams[2] + "' id='mainpicture' class='mainmedia' onload='singlemediaview_continued()'/></span>"
	}
}

//continues loading details when picture or video is loaded
function singlemediaview_continued() {
	var locationstring = decodeURI(window.location.hash)
	var mediaparams = locationstring.split("#")
	//mediaparams[2] - relative path
	//mediaparams[3] - tag names
	//mediaparams[4] - media description
	var tagnamesarray = mediaparams[3].split(",")
	var description = ""
	if (mediaparams.length === 5) {
		description = mediaparams[4]
	}
	
	document.getElementById("menu").innerHTML += "<h4>File info</h4><hr />"
	document.getElementById("menu").innerHTML += "Relative path:<ul id='smv_filepath' class='smv_list'><li>" + mediaparams[2] + "</li></ul>"
	document.getElementById("menu").innerHTML += "Tags:<ul id='smv_filetags' class='smv_list'></ul>"
	var linktagslen = tagnamesarray.length
	for (var i = 0; i < linktagslen; i++) {
		tagname = tagnamesarray[i].replaceAll("_"," ")
		document.getElementById("smv_filetags").innerHTML += "<li>" + tagname + "</li>"
	}
	if (description !== "") {
		document.getElementById("menu").innerHTML += "Description:<ul id='smv_description' class='smv_list'><li>" + description + "</li></ul>"
	}
	
	
	var filewidth = ""
	var fileheight = ""
	
	var filetype = mediaparams[2].split(".")[1].toLowerCase()
	if (filetype === "mp4" || filetype === "webm" || filetype === "ogg") {
		document.getElementById("mainframe").innerHTML = "<video id='mainvideo' class='mainmedia' src='" + mediaparams[2] + "' controls>Your browser doesn't display videos.</video>"
		
		/*
		document.getElementById("menu").innerHTML += "Details:<ul id='smv_details' class='smv_list'></ul>"
		
		//nothing below works here but in web console it works, maybe because of browsers don't allowing autoplay or something
		document.getElementById("smv_details").innerHTML += "<li>Duration: " + document.getElementById("mainvideo").duration + "</li>"
		filewidth = document.getElementById("mainvideo").videoHeight
		fileheight = document.getElementById("mainvideo").videoWidth
		*/
		
		document.getElementById("menu").innerHTML += "<hr /><h4>Tools:</h4><button id='smv_rotleft' onclick='filerotate(\"mainvideo\",\"left\")'>&#x21B6;</button><button id='smv_rotright' onclick='filerotate(\"mainvideo\",\"right\")'>&#x21B7;</button>"
	} else {
		document.getElementById("mainframe").innerHTML = "<span id='mainpicturelink'><img src='" + mediaparams[2] + "' id='mainpicture' class='mainmedia'/></span>"
		document.getElementById("menu").innerHTML += "Details:<ul id='smv_details' class='smv_list'></ul>"
		document.getElementById("menu").innerHTML += "Current path:<ul id='smv_filecurrentpath' class='smv_list'><li>" + document.getElementById("mainpicture").currentSrc.replace("%20"," ") + "</li></ul>"
		filewidth = document.getElementById("mainpicture").naturalWidth
		fileheight = document.getElementById("mainpicture").naturalHeight
		document.getElementById("smv_details").innerHTML += "<li>Width: " + filewidth + "</li>"
		document.getElementById("smv_details").innerHTML += "<li>Height: " + fileheight + "</li>"
		document.getElementById("menu").innerHTML += "<hr /><h4>Tools:</h4><button id='smv_rotleft' onclick='filerotate(\"mainpicture\",\"left\")'>&#x21B6;</button><button id='smv_rotright' onclick='filerotate(\"mainpicture\",\"right\")'>&#x21B7;</button>"
	}
}

//test tool to rotate viewed files
function filerotate(rotationid,direction) {
	if (direction === "right") {
		rotationvalue += 90
	}
	if (direction === "left") {
		rotationvalue -= 90
	}
	document.getElementById(rotationid).style.transform = "rotate(" + rotationvalue + "deg)"
}

//loading single media view or loading full database automatically
if (decodeURI(window.location.hash).startsWith("#qmv_smv")) {
	singlemediaview()
} else if (qmvdbholder !== "") {
	document.getElementById("loader").value = qmvdbholder
	loading()
}

//loading empty DB
function loademptyqmv() {
	document.getElementById("loader").value = qmvdbtemplate
	loading()
}

// to load JSON string
function loading() {
	var loaddata = document.getElementById("loader")
	globaldb = JSON.parse(loaddata.value)
	document.getElementById("jsonsaveholder").value = ""
	
	//loading settings
	var settingslen = globaldb.quomediaviewdb[0].qmv_settings.length
	for (var i = 0; i < settingslen; i++) {
		switch (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0]) {
			case "thumbnails":
				thumbnails = globaldb.quomediaviewdb[0].qmv_settings[i].thumbnails
				document.getElementById("sidesett_thumb").checked = thumbnails
				break;
			case "gridcount":
				maxgridcount = globaldb.quomediaviewdb[0].qmv_settings[i].gridcount
				document.getElementById("sidesett_maxgrid").value = maxgridcount
				break;
			case "infoicon":
				infoicon = globaldb.quomediaviewdb[0].qmv_settings[i].infoicon
				document.getElementById("sidesett_infoicon").value = infoicon
				break;
			case "searchbar":
				document.getElementById("easystylechange_searchbar").innerHTML += "#searchbar {background-color:" + globaldb.quomediaviewdb[0].qmv_settings[i].searchbar + "}"
				document.getElementById("sidesett_searchbar").value = globaldb.quomediaviewdb[0].qmv_settings[i].searchbar
				break;
			case "banbar":
				document.getElementById("easystylechange_blockbar").innerHTML += "#banbar {background-color:" + globaldb.quomediaviewdb[0].qmv_settings[i].banbar + "}"
				document.getElementById("sidesett_blockbar").value = globaldb.quomediaviewdb[0].qmv_settings[i].banbar
				break;
			case "b_picture":
				document.getElementById("easystylechange_b_picture").innerHTML += ".picture {border: " + gridbordersize + "px " + gridborderstyle + " " + globaldb.quomediaviewdb[0].qmv_settings[i].b_picture + "}"
				document.getElementById("sidesett_b_picture").value = globaldb.quomediaviewdb[0].qmv_settings[i].b_picture
				break;
			case "b_animated":
				document.getElementById("easystylechange_b_animated").innerHTML += ".animated {border: " + gridbordersize + "px " + gridborderstyle + " " + globaldb.quomediaviewdb[0].qmv_settings[i].b_animated + "}"
				document.getElementById("sidesett_b_animated").value = globaldb.quomediaviewdb[0].qmv_settings[i].b_animated
				break;
			case "b_video":
				document.getElementById("easystylechange_b_video").innerHTML += ".video {border: " + gridbordersize + "px " + gridborderstyle + " " + globaldb.quomediaviewdb[0].qmv_settings[i].b_video + "}"
				document.getElementById("sidesett_b_video").value = globaldb.quomediaviewdb[0].qmv_settings[i].b_video
				break;
			case "baselocation":
				baselocation = globaldb.quomediaviewdb[0].qmv_settings[i].baselocation
				document.getElementById("sidesett_baselocation").value = baselocation
				break;
			case "chosentheme":
				document.getElementById("themingfile").href = "qmvfiles/theme_" + globaldb.quomediaviewdb[0].qmv_settings[i].chosentheme + ".css"
				if (globaldb.quomediaviewdb[0].qmv_settings[i].chosentheme === "ultradark") {
					document.getElementById("darkthemesw").checked = true
				} else if (globaldb.quomediaviewdb[0].qmv_settings[i].chosentheme === "lightlite") {
					document.getElementById("lightthemesw").checked = true
				} else {
					document.getElementById("darkthemesw").checked = false
				}
				break;
			case "aspectratio":
				gridaspectratio = globaldb.quomediaviewdb[0].qmv_settings[i].aspectratio
				document.getElementById("sidesett_aspratio").checked = globaldb.quomediaviewdb[0].qmv_settings[i].aspectratio
				break;
			case "thumbsize":
				gridthumbsize = globaldb.quomediaviewdb[0].qmv_settings[i].thumbsize
				document.getElementById("sidesett_thmbsize").value = globaldb.quomediaviewdb[0].qmv_settings[i].thumbsize
				break;
			case "sidepanelwidth":
				sidepanelwidth = globaldb.quomediaviewdb[0].qmv_settings[i].sidepanelwidth
				document.getElementById("sidesett_sppsize").value = globaldb.quomediaviewdb[0].qmv_settings[i].sidepanelwidth
				break;
			case "leftmclick":
				leftmclick = globaldb.quomediaviewdb[0].qmv_settings[i].leftmclick
				if (globaldb.quomediaviewdb[0].qmv_settings[i].leftmclick === "sidepreviewpanel") {
					document.getElementById("sidesett_sidepanelsw").checked = true
				} else if (globaldb.quomediaviewdb[0].qmv_settings[i].leftmclick === "lightbox") {
					document.getElementById("sidesett_lightboxsw").checked = true
				}
				break;
		}
	}
	gridthumbupdt()
	qmvsettings_updater()
	document.getElementById("settings").style.visibility = "visible"
	document.getElementById("mediagrid").removeChild(document.getElementById("qmvdbstarting"))
	tagsmenu()
}

// to display menu from JSON database
function tagsmenu() {
	var listtowrite = ""
	tagscollection = []
	document.getElementById("availabletags").innerHTML = ""
	var filegroupslen = globaldb.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < filegroupslen; i++) {
		var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
		var tagscolor = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[1]
		var alltagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
		for (var j = 0; j < alltagslen; j++) {
			var tagid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0]
			var taglen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid].length
			var tagname = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][1]
			document.getElementById("availabletags").innerHTML += "<option value='" + tagname + "'>"
			tagscollection.push(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])
			if (globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[2] === "show") {
				listtowrite += "<li><a style='text-decoration:none;color:" + tagscolor + ";' href='' onclick='document.getElementById(\"banbar\").value += \"" + tagname + " \"; return false'>[-]</a> <a style='text-decoration:none;color:" + tagscolor + ";' href='' onclick='document.getElementById(\"searchbar\").value += \"" + tagname + " \"; return false'>" + tagname.replaceAll("_", " ") + " (" + globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][0] + ")</a>"
				
				// checks if the tag has description
				if (taglen === 3 && globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][2] !== "") {
					listtowrite += " <a style='text-decoration:none;color:" + tagscolor + ";'href='' onclick='alert(\"" + globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][2] + "\"); return false'>" + infoicon + "</a></li>"
				} else {
					listtowrite += "</li>"
				}
			}
		} 
	}
	document.getElementById("tagslist").innerHTML = listtowrite
	searching("")
}

// to search files matching the searched tags or all files
function searching(tagname) {
	searchquery = tagname.trim()
	// special case when all files are displayed
	if (tagname.trim() === "") {
		testarray = []
		var allfileslen = globaldb.quomediaviewdb[3].qmv_files.length
		var tagscollectionlen = tagscollection.length
		for (var i = 0; i < allfileslen; i++) {
			var arrayholder = []
			var fileid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0]
			var filedatalen = globaldb.quomediaviewdb[3].qmv_files[i][fileid].length
			var filepath = ""
			var filename = ""
			var filetagnames = []
			var filetagids = []
			var filethumbpath = ""
			var filethumbname = ""
			var filedescription = ""
			var fileborder = ""
			for (var j = 0; j < filedatalen; j++) {
				var filedataid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0]
				switch (filedataid) {
					case "name":
						var folderid = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].name[1]
						filepath = ""
						var folderslen = globaldb.quomediaviewdb[1].qmv_folders.length
						for (var p = 0; p < folderslen; p++) {
							if (Object.keys(globaldb.quomediaviewdb[1].qmv_folders[p])[0] === folderid) {
								filepath = globaldb.quomediaviewdb[1].qmv_folders[p][folderid]
							}
						}
						filename = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].name[0]
						break;
					case "tags":
						var filetagslen = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags.length
						for (var k = 0; k < filetagslen; k++) {
							switch (globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags[k]) {
								case "a1":
									fileborder = "picture"
									break;
								case "a2":
									fileborder = "animated"
									break;
								case "a3":
									fileborder = "video"
									break;
							}
							for (var l = 0; l < tagscollectionlen; l++) {
								var tagscollectionid = Object.keys(tagscollection[l])[0]
								if (globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags[k] === tagscollectionid) {
									filetagnames.push(tagscollection[l][tagscollectionid][1])
									filetagids.push(tagscollectionid)
								}
							}
						}
						break;
					case "thmb":
						var thmbfolderid = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].thmb[1]
						filethumbpath = globaldb.quomediaviewdb[1].qmv_folders[thmbfolderid]
						for (var q = 0; q < folderslen; q++) {
							if (Object.keys(globaldb.quomediaviewdb[1].qmv_folders[q])[0] === thmbfolderid) {
								filethumbpath = globaldb.quomediaviewdb[1].qmv_folders[q][thmbfolderid]
							}
						}
						filethumbname = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].thmb[0]
						break;
					case "desc":
						filedescription = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j][filedataid]
						break;
				}
			
				//checks if it is the last loop
				if (j === filedatalen - 1) {
					arrayholder.push(fileid,filepath,filename,filethumbpath,filethumbname,fileborder,filetagids,filetagnames,filedescription)
					testarray.push(arrayholder)
				}			
			}
		}
		searchreverser()
		displaytemptest()
	} else {
		testarray = []
		var allfileslen = globaldb.quomediaviewdb[3].qmv_files.length
		var tagscollectionlen = tagscollection.length
		for (var i = 0; i < allfileslen; i++) {
			var arrayholder = []
			var fileid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0]
			var filedatalen = globaldb.quomediaviewdb[3].qmv_files[i][fileid].length
			var filepath = ""
			var filename = ""
			var filetagnames = []
			var filetagids = []
			var filethumbpath = ""
			var filethumbname = ""
			var filedescription = ""
			var fileborder = ""
			for (var j = 0; j < filedatalen; j++) {
				var filedataid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0]
				switch (filedataid) {
					case "name":
						var folderid = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].name[1]
						filepath = ""
						var folderslen = globaldb.quomediaviewdb[1].qmv_folders.length
						for (var p = 0; p < folderslen; p++) {
							if (Object.keys(globaldb.quomediaviewdb[1].qmv_folders[p])[0] === folderid) {
								filepath = globaldb.quomediaviewdb[1].qmv_folders[p][folderid]
							}
						}
						filename = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].name[0]
						break;
					case "tags":
						var filetagslen = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags.length
						for (var k = 0; k < filetagslen; k++) {
							switch (globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags[k]) {
								case "a1":
									fileborder = "picture"
									break;
								case "a2":
									fileborder = "animated"
									break;
								case "a3":
									fileborder = "video"
									break;
							}
							for (var l = 0; l < tagscollectionlen; l++) {
								var tagscollectionid = Object.keys(tagscollection[l])[0]
								if (globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags[k] === tagscollectionid) {
									filetagnames.push(tagscollection[l][tagscollectionid][1])
									filetagids.push(tagscollectionid)
								}
							}
						}
						break;
					case "thmb":
						var thmbfolderid = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].thmb[1]
						filethumbpath = globaldb.quomediaviewdb[1].qmv_folders[thmbfolderid]
						for (var q = 0; q < folderslen; q++) {
							if (Object.keys(globaldb.quomediaviewdb[1].qmv_folders[q])[0] === thmbfolderid) {
								filethumbpath = globaldb.quomediaviewdb[1].qmv_folders[q][thmbfolderid]
							}
						}
						filethumbname = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].thmb[0]
						break;
					case "desc":
						filedescription = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j][filedataid]
						break;
				}
			
				//checks if it is the last loop
				if (j === filedatalen - 1) {
					arrayholder.push(fileid,filepath,filename,filethumbpath,filethumbname,fileborder,filetagids,filetagnames,filedescription)
					testarray.push(arrayholder)
				}			
			}
		}
		var searchresultsarraylen = testarray.length
		var searchedtags = tagname.trim().split(" ")
		var searchedtagslen = searchedtags.length
		var tempresultsarray = []
		for (var m = 0; m < searchresultsarraylen; m++) {
			var filetagslen = testarray[m][7].length
			searchstring = ""
			for (var n = 0; n < searchedtagslen; n++) {
				for (var o = 0; o < filetagslen; o++) {
					if (testarray[m][7][o] === searchedtags[n]) {
						searchstring += "1"
					} else {
						searchstring += "0"
					}
				}
				var checking = (searchstring.match(/1/g)||[]).length
				if (n === searchedtagslen - 1 && checking === searchedtagslen) {
					tempresultsarray.push(testarray[m])
				}
			}
		}
		testarray = tempresultsarray
		searchreverser()
		displaytemptest()
	}
}

//removing matched files from search
function banning(tagname) {
	var searchresultsarraylen = testarray.length
	var searchedtags = tagname.trim().split(" ")
	var searchedtagslen = searchedtags.length
	var filestoban = []
	for (var i = 0; i < searchresultsarraylen; i++) {
		var filetagslen = testarray[i][7].length
		for (var j = 0; j < searchedtagslen; j++) {
			for (var k = 0; k < filetagslen; k++) {
				if (testarray[i][7][k] === searchedtags[j]) {
					filestoban.push(i)
				}
			}
		}
		if (i === searchresultsarraylen - 1) {
			filestoban.sort(function(a, b){return b - a})
			var filestobanlen = filestoban.length
			for (var l = 0; l < filestobanlen; l++) {
				testarray.splice(filestoban[l],1)
			}
		}
	}
	displaytemptest()
}

// to show newest files on the start of array
function searchreverser() {
	testarray.reverse()
}

//displays the files and subpages
function displaytemptest() {
	document.getElementById("mediagrid").innerHTML = ""
	var gridlen = testarray.length
	var startid = (maxgridcount * currentpage) - maxgridcount
	var endid = maxgridcount * currentpage
	for (; startid < endid; startid++) {
		
		if (testarray[startid] != undefined) {
			//testarray[startid][0] - file id
			//testarray[startid][1]	- file path
			//testarray[startid][2] - file name
			//testarray[startid][3]	- thumbnail path
			//testarray[startid][4] - thumbnail name
			//testarray[startid][5] - type of border
			//testarray[startid][6] - tag ids of the file
			//testarray[startid][7] - tag names of the file
			//testarray[startid][8] - description
			
			var disp_fullpath = testarray[startid][1] + testarray[startid][2]
			var disp_fullthumbpath = testarray[startid][3] + testarray[startid][4]
			var disp_border = testarray[startid][5]
			var disp_description = testarray[startid][8]
			var disp_linktags = ""
			var filetagslen = testarray[startid][7].length
			for (var i = 0; i < filetagslen; i++) {
				if (i === filetagslen - 1) {
					disp_linktags += testarray[startid][7][i]
				} else {
					disp_linktags += testarray[startid][7][i] + ","
				}
			}
			
			if (testarray[startid][5] === "video") {
				if (thumbnails === true && testarray[startid][3] !== "" && testarray[startid][4] !== "") {
					if (testarray[startid][8] !== "") {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "#" + disp_description + "' class='linklesslink'><img src='" + baselocation + disp_fullthumbpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					} else {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "' class='linklesslink'><img src='" + baselocation + disp_fullthumbpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					}
				} else {
					if (testarray[startid][8] !== "") {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "#" + disp_description + "' class='linklesslink'><video src='" + baselocation + disp_fullpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					} else {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "' class='linklesslink'><video src='" + baselocation + disp_fullpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					}
				}
				
			} else {
				if (thumbnails === true && testarray[startid][3] !== "" && testarray[startid][4] !== "") {
					if (testarray[startid][8] !== "") {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "#" + disp_description + "' class='linklesslink'><img src='" + baselocation + disp_fullthumbpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					} else {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "' class='linklesslink'><img src='" + baselocation + disp_fullthumbpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					}
				} else {
					if (testarray[startid][8] !== "") {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "#" + disp_description + "' class='linklesslink'><img src='" + baselocation + disp_fullpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					} else {
						document.getElementById("mediagrid").innerHTML += "<div class='thmbnl_box' onclick='lmouseclickredirect(" + startid + ")'><a href='quomediaview.html#qmv_smv#" + baselocation + disp_fullpath + "#" + disp_linktags + "' class='linklesslink'><img src='" + baselocation + disp_fullpath + "' class='thmbnl " + disp_border + "' /></a></div>"
					}
				}
			}
		}
	}
	
	var pagesamount = Math.ceil(gridlen / maxgridcount)
	document.getElementById("navlist").innerHTML = ""
	
	if (pagesamount < 11) {
		for (var i = 1; i <= pagesamount; i++) {
			if (i === currentpage) {
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + i + "</li></a>"
			} else {
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
			}
			
			if (i === pagesamount) {
			document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
			}
		} 
	} else {
			
		//rework this later to make it have just a little dignity
		switch (currentpage) {
			case 1:
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + 1 + "</li></a>" //case here
				for (var i = 2; i <= 8; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + pagesamount + "; displaytemptest(); return false'><li>" + pagesamount + "</li></a>"
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case 2:
				for (var i = 1; i < 2; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = 3; i <= 8; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + pagesamount + "; displaytemptest(); return false'><li>" + pagesamount + "</li></a>"
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case 3:
				for (var i = 1; i < 3; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = 4; i <= 8; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + pagesamount + "; displaytemptest(); return false'><li>" + pagesamount + "</li></a>"
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case 4:
				for (var i = 1; i < 4; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = 5; i <= 8; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + pagesamount + "; displaytemptest(); return false'><li>" + pagesamount + "</li></a>"
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case 5:
				for (var i = 1; i < 5; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = 6; i <= 8; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + pagesamount + "; displaytemptest(); return false'><li>" + pagesamount + "</li></a>"
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
			
			//not requiring special	treatment
			default:
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + 1 + "; displaytemptest(); return false'><li>" + 1 + "</li></a>"
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				for (var i = currentpage - 3; i < currentpage; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = currentpage + 1; i < currentpage + 4; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + pagesamount + "; displaytemptest(); return false'><li>" + pagesamount + "</li></a>"
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
			//happy
			
			case pagesamount - 4:
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + 1 + "; displaytemptest(); return false'><li>" + 1 + "</li></a>"
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				for (var i = pagesamount - 7; i < pagesamount - 4; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = pagesamount - 3; i <= pagesamount; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case pagesamount - 3:
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + 1 + "; displaytemptest(); return false'><li>" + 1 + "</li></a>"
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				for (var i = pagesamount - 7; i < pagesamount - 3; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = pagesamount - 2; i <= pagesamount; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case pagesamount - 2:
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + 1 + "; displaytemptest(); return false'><li>" + 1 + "</li></a>"
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				for (var i = pagesamount - 7; i < pagesamount - 2; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = pagesamount - 1; i <= pagesamount; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case pagesamount - 1:
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + 1 + "; displaytemptest(); return false'><li>" + 1 + "</li></a>"
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				for (var i = pagesamount - 7; i < pagesamount - 1; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + currentpage + "</li></a>" //case here
				for (var i = pagesamount; i <= pagesamount; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
				
			case pagesamount:
				document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + 1 + "; displaytemptest(); return false'><li>" + 1 + "</li></a>"
				document.getElementById("navlist").innerHTML += "<a href=''><li class='hiddennavpage'>...</li></a>"
				for (var i = pagesamount - 7; i < pagesamount; i++) {
					document.getElementById("navlist").innerHTML += "<ul><a href='' onclick='currentpage = " + i + "; displaytemptest(); return false'><li>" + i + "</li></a>"
				}
				document.getElementById("navlist").innerHTML += "<ul><li id='currentpage'>" + pagesamount + "</li></a>" //case here
				document.getElementById("navlist").innerHTML += "<li id='pageselect'><form autocomplete='off' id='navpageform' onsubmit='currentpage = document.getElementById(\"navpageselect\").value * 1; displaytemptest(); return false'><input type='number' id='navpageselect' value='1' min='1'/></form></li></ul>"
				break;
		}		
	}

	//change page title with some info
	if (searchquery === "") {
		document.getElementById("pagetitle").innerHTML = searchquery + "page " + currentpage + " of " + pagesamount + " (" + testarray.length + ") | QuoMediaView"
	} else {
		document.getElementById("pagetitle").innerHTML = searchquery + " | page " + currentpage + " of " + pagesamount + " (" + testarray.length + ") | QuoMediaView"
	}
	linksdisabler()
}

//prevents opening images with left mouse button
function linksdisabler() {
	var imagelinks = document.getElementsByClassName("linklesslink");
	var imagelinkslen = imagelinks.length
	for (var i = 0; i < imagelinkslen; i++) {
		imagelinks[i].addEventListener("click", function(event){event.preventDefault()});
	}
}

//opens big viewer
function bigviewer(chosenmedia) {
	document.getElementById("menu").style.display = "none"
	document.getElementById("maingridview").style.display = "none"
	document.getElementById("bigviewbox").style.display = "block"
	inbigview = chosenmedia * 1
	document.getElementById("mediabig").innerHTML = chosenmedia
	document.getElementById("bvb_sidepanelbtnparent").innerHTML = "<input type='button' onclick='insidepanelpreview = " + inbigview + "; sidepanelpreviewer()' value='Side panel' title='Open file in Side panel' id='bvb_sidepanelbtn' />"
	document.getElementById("bvb_editbtnparent").innerHTML = "<input type='button' onclick='inmediaedit = " + inbigview + "; editmedia()' value='Edit' title='Open file in edit mode' id='bvb_editbtn' />"
	var disp_linktags = ""
	var filetagslen = testarray[chosenmedia][7].length
	for (var i = 0; i < filetagslen; i++) {
		if (i === filetagslen - 1) {
			disp_linktags += testarray[chosenmedia][7][i]
		} else {
			disp_linktags += testarray[chosenmedia][7][i] + ","
		}
	}
	var singlemvpath = "quomediaview.html#qmv_smv#" + baselocation + testarray[chosenmedia][1] + testarray[chosenmedia][2] + "#" + disp_linktags
	if (testarray[chosenmedia][8] !== "") {
		singlemvpath += "#" + testarray[chosenmedia][8]
	}
	document.getElementById("bvb_newtablink").href = singlemvpath
	var filepath = baselocation + testarray[chosenmedia][1] + testarray[chosenmedia][2]
	var filetype = testarray[chosenmedia][5]
	if (filetype === "video") {
		document.getElementById("mediabig").innerHTML = "<video src='" + filepath + "' class='bigmainmedia' controls>Your browser can not display videos</video>"
	} else {
		document.getElementById("mediabig").innerHTML = "<img src='" + filepath + "' class='bigmainmedia'/>"
	}
}

//go to previous media
function bvb_prev() {
	if (inbigview !== 0) {
		bigviewer(inbigview - 1)
	}
}

//go to next media
function bvb_next() {
	if (inbigview !== testarray.length - 1) {
		bigviewer(inbigview + 1)
	}
}

//closes big viewer
function bigviewclose() {
	document.getElementById("bigviewbox").style.display = "none"
	document.getElementById("menu").style.display = "block"
	document.getElementById("maingridview").style.display = "block"
}

//opens options menu
function editoptions() {
	document.getElementById("menulist").style.display = "none"
	document.getElementById("menusidesettings").style.display = "block"
}

//sorting tags (for now only by name)
function tagsorter() {
	var allgroupslen = globaldb.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < allgroupslen; i++) {
		var referencearray = []
		var sortingarray = []
		var sortedarray = []
		var groupname = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
		var tagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupname][1].tags.length
		for (var j = 0; j < tagslen; j++) {
			var tagid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupname][1].tags[j])[0]
			var tagname = globaldb.quomediaviewdb[2].qmv_tags[i][groupname][1].tags[j][tagid][1]
			referencearray.push(globaldb.quomediaviewdb[2].qmv_tags[i][groupname][1].tags[j])
			sortingarray.push(tagname)
			if (j === tagslen - 1) {
				sortingarray.sort()
				for (var k = 0; k < tagslen; k++) {
					for (var l = 0; l < tagslen; l++) {
						var temptagid = Object.keys(referencearray[l])
						if (sortingarray[k] === referencearray[l][temptagid][1]) {
							sortedarray.push(referencearray[l])
						}
					}
				}
			}
		}
		globaldb.quomediaviewdb[2].qmv_tags[i][groupname][1].tags = sortedarray
	}
	changeguard = 1
	changesnotify()
	tagsmenu()
}

//adds new empty files to database
function mediauploadinput() {
	var filescount = document.getElementById("fileadder").files.length
	var fileslenbefore = globaldb.quomediaviewdb[3].qmv_files.length
	for (var i = 0; i < filescount; i++) {
		var filename = document.getElementById("fileadder").files[i].name
		var lastfile = globaldb.quomediaviewdb[3].qmv_files.length - 1
		var nextavailableid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[lastfile])[0] * 1 + 1
		var emptyfilestring = '{"' + nextavailableid + '":[{"name":["' + filename + '","1"]},{"tags":[]}]}'
		var emptyfileobject = JSON.parse(emptyfilestring)
		globaldb.quomediaviewdb[3].qmv_files.push(emptyfileobject)
	}
	changeguard = 1
	changesnotify()
	searching("")
	inmediaedit = filescount - 1
	editmedia()
}

//opens media editing menu for and loads basic structure
function editmedia() {
	document.getElementById("maingridview").style.display = "none"
	document.getElementById("bigviewbox").style.display = "none"
	document.getElementById("mediaedit").style.display = "block"
	document.getElementById("menu").style.display = "block"
	document.getElementById("menulist").style.display = "none"
	document.getElementById("menusidesettings").style.display = "block"
	var allgroupslen = globaldb.quomediaviewdb[2].qmv_tags.length
	var tagstowrite = ""
	for (var i = 0; i < allgroupslen; i++) {
		var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
		var groupname = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[0]
		var tagscolor = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[1]
		tagstowrite += "<div id='" + groupid + "_section' class='tagcellsgroup'><br />" + groupname + ":<br />"
		var alltagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
		for (var j = 0; j < alltagslen; j++) {
			var tagid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0]
			var tagname = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][1]
			tagstowrite += "<div id='" + tagid + "_tagcelldiv' class='tagborder' style='border: 1px solid " + tagscolor + "; color:" + tagscolor + "'><label for='" + tagid +"_tagcell'>" + tagname + "</label>"
			/* old code for radio group type, may use it in the future
			if (grouptype === "radio") {
				tagstowrite += "<input type='radio' name='gridborder' value='" + tagid + "' id='" + tagid + "_tagcell' onchange='tagcellswitch(\"" + tagid + "_tagcelldiv\",\"radio\",\"" + tagscolor + "\",\"full\")'/>"
			} else 
			*/
			tagstowrite += "<input type='checkbox' value='" + tagid + "' id='" + tagid + "_tagcell' onchange='tagcellswitch(\"" + tagid + "_tagcelldiv\",\"checkbox\",\"" + tagscolor + "\",\"full\")'/>"
			tagstowrite += "</div>"
		}
		//excluding first group from adding more tags into it
		if (i !== 0) {
			var tagidarray = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[3].split("_")
			var nexttagnumber = tagidarray[1] * 1 + 1
			var nexttagid = tagidarray[0] + nexttagnumber
			tagstowrite += "<div id='" + nexttagid + "_tagcelldiv' class='tagborder' style='border: 1px solid " + tagscolor + "; color:" + tagscolor + "'><label for='" + nexttagid +"_tagcell'>new: </label><input type='text' id='" + nexttagid + "_tagcellnew' onchange='quicktagadder(\"" + groupid + "\")' style='background-color: transparent; color:" + tagscolor + "' /></div>"
		}
		tagstowrite += "</div>"
		
	}
	document.getElementById("me_availablefolders").innerHTML = ""
	var folderslen = globaldb.quomediaviewdb[1].qmv_folders.length
	for (var k = 0; k < folderslen; k++) {
		var folderid = Object.keys(globaldb.quomediaviewdb[1].qmv_folders[k])
		document.getElementById("me_availablefolders").innerHTML += "<option value='" + globaldb.quomediaviewdb[1].qmv_folders[k][folderid] + "'></option>"
	}
	document.getElementById("me_tagcellsdiv").innerHTML = tagstowrite
	
	document.getElementById("me_tagcellsdiv").innerHTML += "<div id='divforquickgroupadder' class='tagcellsgroup'><br /><button onclick='quickgroupadder()'>Add new tag group</button></div>"
	
	document.getElementById("me_foldermain").value = ""
	document.getElementById("me_namemain").value = ""
	document.getElementById("me_folderthumb").value = ""
	document.getElementById("me_namethumb").value = ""
	document.getElementById("me_description").value = ""
	
	//loading the values from the opened file
	var filetypearray = testarray[inmediaedit][2].split(".")
	var lastext = filetypearray.length - 1
	if (filetypearray[lastext] === "mp4" || filetypearray[lastext] === "webm" || filetypearray[lastext] === "ogg") {
		document.getElementById("mediamini").innerHTML = "<video src='" + baselocation + testarray[inmediaedit][1] + testarray[inmediaedit][2] + "' class='preview' controls />"
	} else {
		document.getElementById("mediamini").innerHTML = "<img src='" + baselocation + testarray[inmediaedit][1] + testarray[inmediaedit][2] + "' class='preview' />"
	}
	
	document.getElementById("me_foldermain").value = testarray[inmediaedit][1]
	document.getElementById("me_namemain").value = testarray[inmediaedit][2]
	
	if (testarray[inmediaedit][3] !== "") {
		document.getElementById("me_folderthumb").value = testarray[inmediaedit][3]
	}
	
	if (testarray[inmediaedit][4] !== "") {
		document.getElementById("me_namethumb").value = testarray[inmediaedit][4]
	}
	
	if (testarray[inmediaedit][8] !== "") {
		document.getElementById("me_description").value = testarray[inmediaedit][8]
	}
	
	//loading tags
	var filetagslen = testarray[inmediaedit][6].length
	for (var m = 0; m < filetagslen; m++) {
		var filetagid = testarray[inmediaedit][6][m]
		var tagcelldiv = filetagid + "_tagcelldiv"
		if (document.getElementById(tagcelldiv) !== null) {
			var groupslen = globaldb.quomediaviewdb[2].qmv_tags.length
			for (var n = 0; n < groupslen; n++) {
				var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[n])[0]
				var alltagslen = globaldb.quomediaviewdb[2].qmv_tags[n][groupid][1].tags.length
				for (var o = 0; o < alltagslen; o++) {
					if (filetagid === Object.keys(globaldb.quomediaviewdb[2].qmv_tags[n][groupid][1].tags[o])[0]) {
						var tagcolor = globaldb.quomediaviewdb[2].qmv_tags[n][groupid][0].settings[1]
						tagcellswitch(tagcelldiv,"checkbox",tagcolor,"visual")
					}
				}
			}
		}
	}
}


//handling updating of everything else in files other than tags
function filesettupdate(settid,extraparam) {
	
	//file names
	if (settid === "me_filename") {
		var enteredname = ""
	
		if (extraparam === "main") {
			enteredname = document.getElementById("me_namemain").value
		}
	
		if (extraparam === "thumb") {
			enteredname = document.getElementById("me_namethumb").value
		}
		
		//finding file
		var fileslen = globaldb.quomediaviewdb[3].qmv_files.length
		for (var i = 0; i < fileslen; i++) {
			var fileid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0]
			if (testarray[inmediaedit][0] === fileid) {
				var fileparamslen = globaldb.quomediaviewdb[3].qmv_files[i][fileid].length
				for (var j = 0; j < fileparamslen; j++) {
					if (extraparam === "main") {
						if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0] === "name") {
							globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].name[0] = enteredname
							testarray[inmediaedit][2] = enteredname
							editmedia()
						}
					} else if (extraparam === "thumb") {
						thumbcheck = false
						if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0] === "thmb") {
							thumbcheck = true
						}
						if (j === fileparamslen - 1) {
							if (thumbcheck === true) {
								globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].thmb[0] = enteredname
								testarray[inmediaedit][4] = enteredname
							} else {
								var newthumbstring = '{"thmb":["' + enteredname + '",""]}'
								var newthumbobject = JSON.parse(newthumbstring)
								globaldb.quomediaviewdb[3].qmv_files[i][fileid].push(newthumbobject)
								testarray[inmediaedit][4] = enteredname
							}
						}
					}
				}
			}
		}		
	}
	
	//file paths
	if (settid === "me_path") {
		var enteredpath = ""
	
		if (extraparam === "main") {
			enteredpath = document.getElementById("me_foldermain").value
		}
	
		if (extraparam === "thumb") {
			enteredpath = document.getElementById("me_folderthumb").value
		}
	
		var	folderid = 0
		//retrieving folder id
		var folderslen = globaldb.quomediaviewdb[1].qmv_folders.length       
		for (var i = 0 ; i < folderslen; i++) {
			var inbasefolderid = Object.keys(globaldb.quomediaviewdb[1].qmv_folders[i])[0]
			if (globaldb.quomediaviewdb[1].qmv_folders[i][inbasefolderid] === enteredpath) {
				folderid = inbasefolderid
			} else if (i === folderslen - 1 && globaldb.quomediaviewdb[1].qmv_folders[i][inbasefolderid] !== enteredpath) {
				var newfolderid = inbasefolderid * 1 + 1
				var newfolderstring = '{"' + newfolderid + '":"' + enteredpath + '"}'
				var newfolderobject = JSON.parse(newfolderstring)
				globaldb.quomediaviewdb[1].qmv_folders.push(newfolderobject)
				folderid = newfolderid
			}
		}

		//finding file
		var fileslen = globaldb.quomediaviewdb[3].qmv_files.length
		for (var i = 0; i < fileslen; i++) {
			var fileid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0]
			if (testarray[inmediaedit][0] === fileid) {
				var fileparamslen = globaldb.quomediaviewdb[3].qmv_files[i][fileid].length
				for (var j = 0; j < fileparamslen; j++) {
					if (extraparam === "main") {
						if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0] === "name") {
							globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].name[1] = "" + folderid
							testarray[inmediaedit][1] = enteredpath
							editmedia()
						}
					} else if (extraparam === "thumb") {
						thumbcheck = false
						if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0] === "thmb") {
							thumbcheck = true
						}
						if (j === fileparamslen - 1) {
							if (thumbcheck === true) {
								globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].thmb[1] = "" + folderid
								testarray[inmediaedit][3] = enteredpath
							} else {
								var newthumbstring = '{"thmb":["","' + folderid + '"]}'
								var newthumbobject = JSON.parse(newthumbstring)
								globaldb.quomediaviewdb[3].qmv_files[i][fileid].push(newthumbobject)
								testarray[inmediaedit][3] = enteredpath
							}
						}
					}
				}
			}
		}		
	}
	
	//file description
	if (settid === "me_desc") {
		var fileslen = globaldb.quomediaviewdb[3].qmv_files.length
		for (var i = 0; i < fileslen; i++) {
			var fileid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0]
			if (testarray[inmediaedit][0] === fileid) {
				var fileparamslen = globaldb.quomediaviewdb[3].qmv_files[i][fileid].length
				for (var j = 0; j < fileparamslen; j++) {
					desccheck = false
					if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0] === "desc") {
						desccheck = true
					}
					if (j === fileparamslen - 1) {
						var newdescription = document.getElementById("me_description").value
						if (desccheck === true) {
							globaldb.quomediaviewdb[3].qmv_files[i][fileid][j]["desc"] = newdescription
							testarray[inmediaedit][8] = newdescription
						} else {
							var newdescstring = '{"desc":"' + newdescription + '"}'
							var newdescobject = JSON.parse(newdescstring)
							globaldb.quomediaviewdb[3].qmv_files[i][fileid].push(newdescobject)
							testarray[inmediaedit][8] = newdescription
						}
					}
				}
			}
		}
	}
	changeguard = 1
	changesnotify()
}

//quick changing of file names
function nameselect(type) {
	if (type === "main") {
		document.getElementById("me_namemain").value = document.getElementById("me_nameupload").files[0].name
		filesettupdate("me_filename","main")
	} else if (type === "thumb") {
		document.getElementById("me_namethumb").value = document.getElementById("me_thumbupload").files[0].name
		filesettupdate("me_filename","thumb")
	}
}

//deletes the file from search array and database
function filedelete() {
    var fileslen = globaldb.quomediaviewdb[3].qmv_files.length 
    for (var i = 0; i < fileslen; i++) { 
        var fileidinside = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0] 
        if (fileidinside === testarray[inmediaedit][0]) { 
            //delete the tags count from qmv_tags 
            var fileparamslen = globaldb.quomediaviewdb[3].qmv_files[i][fileidinside].length 
            for (var j = 0; j < fileparamslen; j++) { 
                if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileidinside][j])[0] === "tags") { 
                    var filetagslen = globaldb.quomediaviewdb[3].qmv_files[i][fileidinside][j].tags.length 
                    for (var k = 0; k < filetagslen; k++) { 
                        var tglen = globaldb.quomediaviewdb[2].qmv_tags.length 
                        for (var l = 0; l < tglen; l++) { 
                            var tgname = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[l])[0] 
                            var innertagslen = globaldb.quomediaviewdb[2].qmv_tags[l][tgname][1].tags.length 
                            for (var m = 0; m < innertagslen; m++) { 
                                var tagid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[l][tgname][1].tags[m])[0] 
                                if (tagid === globaldb.quomediaviewdb[3].qmv_files[i][fileidinside][j].tags[k]) { 
                                    globaldb.quomediaviewdb[2].qmv_tags[l][tgname][1].tags[m][tagid][0] -= 1 
                                } 
                            } 
                             
                        } 
                    } 
                } 
            } 
             
            //delete file from qmv_files 
            globaldb.quomediaviewdb[3].qmv_files.splice(i,1)     
            testarray.splice(inmediaedit,1) 
            break; 
        } 
    }
	
	//when it is the only file in search
	if (inmediaedit === 0 && testarray.length === 0) {
		backtomain()

	//when it is the last file in search and there are others
	} else if (inmediaedit === testarray.length && inmediaedit !== 0) {
		inmediaedit -= 1
		editmedia()
		
	//when there are other files in search
	} else {
		editmedia()
	}
	
	changeguard = 1
	changesnotify()
}

//adding new tags from media edit window
function quicktagadder(groupid) {
	var groupslen = globaldb.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < groupslen; i++) {
		if (groupid === Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]) {
			var letterarray = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[3].split("_")
			var tagscolor = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[1]
			var newnumber = letterarray[1] * 1 + 1
			var newtagid = letterarray[0] + newnumber
			globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[3] = letterarray[0] + "_" + newnumber
			var tagname = document.getElementById(newtagid + "_tagcellnew").value
			var tagstring = '{"' + newtagid + '":[0,"' + tagname + '"]}'
			var tagobject = JSON.parse(tagstring)
			globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.push(tagobject)
			document.getElementById(groupid + "_section").removeChild(document.getElementById(newtagid + "_tagcelldiv"))
			
			//adding newly created tagcell
			document.getElementById(groupid + "_section").innerHTML += "<div id='" + newtagid + "_tagcelldiv' class='tagborder' style='border: 1px solid " + tagscolor + "; color:" + tagscolor + "'><label for='" + newtagid +"_tagcell'>" + tagname + "</label><input type='checkbox' value='" + newtagid + "' id='" + newtagid + "_tagcell' onchange='tagcellswitch(\"" + newtagid + "_tagcelldiv\",\"checkbox\",\"" + tagscolor + "\",\"full\")'/></div>"
			
			//adding new text input
			var tagidarray = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[3].split("_")
			var nexttagnumber = tagidarray[1] * 1 + 1
			var nexttagid = tagidarray[0] + nexttagnumber
			document.getElementById(groupid + "_section").innerHTML += "<div id='" + nexttagid + "_tagcelldiv' class='tagborder' style='border: 1px solid " + tagscolor + "; color:" + tagscolor + "'><label for='" + nexttagid +"_tagcell'>new: </label><input type='text' id='" + nexttagid + "_tagcellnew' onchange='quicktagadder(\"" + groupid + "\")' style='background-color: transparent; color:" + tagscolor + "' /></div>"
			
			changeguard = 1
			changesnotify()
		}
	}
}

//adding new tags from media edit window
function quickgroupadder() {
	var lastgroup = globaldb.quomediaviewdb[2].qmv_tags.length - 1
	var lastgroupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[lastgroup])[0]
	var groupidarray = lastgroupid.split("-")
	var newgroupnumber = groupidarray[1] * 1 + 1
	var newgroupid = "group-" + newgroupnumber
	var lettersarray = "abcdefghijklmnopqrstuvwxyz".split("")
	
	
	//add to globaldb
	var jsonletterid = lettersarray[newgroupnumber - 1] + "_0"
	var taggroupstring = '{"' + newgroupid + '":[{"settings":["' + newgroupid + '-name","#808080","show","' + jsonletterid + '"]},{"tags":[]}]}'
	var taggroupobject = JSON.parse(taggroupstring)
	globaldb.quomediaviewdb[2].qmv_tags.push(taggroupobject)
	
	editmedia()
	changeguard = 1
	changesnotify()
}

// to handle dropping files //base code provided by MDN
function dropHandler(ev) {

	ev.preventDefault()
	
	if (ev.dataTransfer.items) {
		var newfilescount = 0
		for (var i = 0; i < ev.dataTransfer.items.length; i++) {
			if (ev.dataTransfer.items[i].kind === 'file') {
				newfilescount += 1
				var file = ev.dataTransfer.items[i].getAsFile()
				var filename = file.name
				var lastfile = 0
				if (globaldb.quomediaviewdb[3].qmv_files.length !== 0) {
					var lastfile = globaldb.quomediaviewdb[3].qmv_files.length - 1
				}
				var nextavailableid = 0
				if (globaldb.quomediaviewdb[3].qmv_files.length !== 0) {
					var nextavailableid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[lastfile])[0] * 1 + 1
				}
				var emptyfilestring = '{"' + nextavailableid + '":[{"name":["' + filename + '","1"]},{"tags":[]}]}'
				var emptyfileobject = JSON.parse(emptyfilestring)
				globaldb.quomediaviewdb[3].qmv_files.push(emptyfileobject)
			}
		}
		changeguard = 1
		changesnotify()
		searching("")
		inmediaedit = newfilescount - 1
		editmedia()
	} else {
		var newfilescount = 0
		// Use DataTransfer interface to access the file(s)
		for (var i = 0; i < ev.dataTransfer.files.length; i++) {
			newfilescount += 1
			var filename = ev.dataTransfer.files[i].name
			var lastfile = 0
			if (globaldb.quomediaviewdb[3].qmv_files.length !== 0) {
				var lastfile = globaldb.quomediaviewdb[3].qmv_files.length - 1
			}
			var nextavailableid = 0
			if (globaldb.quomediaviewdb[3].qmv_files.length !== 0) {
				var nextavailableid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[lastfile])[0] * 1 + 1
			}
			var emptyfilestring = '{"' + nextavailableid + '":[{"name":["' + filename + '","1"]},{"tags":[]}]}'
			var emptyfileobject = JSON.parse(emptyfilestring)
			globaldb.quomediaviewdb[3].qmv_files.push(emptyfileobject)
		}
		changeguard = 1
		changesnotify()
		searching("")
		inmediaedit = newfilescount - 1
		editmedia()
	}
}

//preventing dragged files from opening
function dragOverHandler(ev) {
	ev.preventDefault()
}

//handles editing tags and user interface
function tagcellswitch(tagcelldiv,switchtype,tagcolor,mode) {
	//mode = visual - only changes visuals on the site, used on loading the file without changing it
	//mode = full - changes both visuals and tags in database
	var backcolor = "black"
	if (mode === "visual") {
		var tagcellarray = tagcelldiv.split("_")
		var tagcellid = tagcellarray[0] + "_tagcell"
		document.getElementById(tagcellid).checked = true
		document.getElementById(tagcelldiv).style.color = backcolor
		document.getElementById(tagcelldiv).style.backgroundColor = tagcolor
	} else if (mode === "full") {
		
		/*
		rework it in the future when I'm too lazy to only pick one of the border tags
		* 
		if (switchtype === "radio") {
			//reset all to default
			var tagarray = tagcelldiv.split("_")
			var tagid = tagarray[0]
		
			var a1_tcd = document.getElementById("a1_tagcelldiv")
			a1_tcd.style.backgroundColor = backcolor
			a1_tcd.style.color = tagcolor
		
			var a2_tcd = document.getElementById("a2_tagcelldiv")
			a2_tcd.style.backgroundColor = backcolor
			a2_tcd.style.color = tagcolor
		
			var a3_tcd = document.getElementById("a3_tagcelldiv")
			a3_tcd.style.backgroundColor = backcolor
			a3_tcd.style.color = tagcolor
		
			//highlight active
			document.getElementById(tagcelldiv).style.backgroundColor = tagcolor
			document.getElementById(tagcelldiv).style.color = backcolor
		
			//update tag in file
			var fileslen = globaldb.qviewdb[3].qv_files.length
			for (var i = 0; i < fileslen; i++) {
				var fileid = Object.keys(globaldb.qviewdb[3].qv_files[i])[0]
				if (testarray[inmediaedit][0] === fileid) {
					var fileparamslen = globaldb.qviewdb[3].qv_files[i][fileid].length
					for (var j = 0; j < fileparamslen; j++) {
						if (Object.keys(globaldb.qviewdb[3].qv_files[i][fileid][j])[0] === "tags") {
							var tagidplace = globaldb.qviewdb[3].qv_files[i][fileid][j].indexOf(tagid)
							console.log(tagidplace)
						}
					}
				}
			}	
		
		//update tag count
		
		} else 
		*/
		if (switchtype === "checkbox") {
			var tagcellarray = tagcelldiv.split("_")
			var tagcellid = tagcellarray[0] + "_tagcell"
			var tagid = tagcellarray[0]
			if (document.getElementById(tagcellid).checked === true) {
				//visuals
				document.getElementById(tagcelldiv).style.color = backcolor
				document.getElementById(tagcelldiv).style.backgroundColor = tagcolor
				
				//tag count
				var taggroupslen = globaldb.quomediaviewdb[2].qmv_tags.length
				var tagname = ""
				for (var i = 0; i < taggroupslen; i++) {
					var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
					var tagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
					for (var j = 0; j < tagslen; j++) {
						if (Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0] === tagid) {
							tagname = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][1]
							globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][0] += 1
						}
					}
				}
				
				//file
				var fileslen = globaldb.quomediaviewdb[3].qmv_files.length
				for (var i = 0; i < fileslen; i++) {
					var fileid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0]
					if (testarray[inmediaedit][0] === fileid) {
						var fileparamslen = globaldb.quomediaviewdb[3].qmv_files[i][fileid].length
						for (var j = 0; j < fileparamslen; j++) {
							if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0] === "tags") {
								//file
								globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags.push(tagid)
								//search results
								testarray[inmediaedit][6].push(tagid)
								testarray[inmediaedit][7].push(tagname)
							}
						}
					}
				}
			} else {
				//visuals
				document.getElementById(tagcelldiv).style.color = tagcolor
				document.getElementById(tagcelldiv).style.backgroundColor = backcolor
				
				//tag count
				var taggroupslen = globaldb.quomediaviewdb[2].qmv_tags.length
				var tagname = ""
				for (var i = 0; i < taggroupslen; i++) {
					var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
					var tagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
					for (var j = 0; j < tagslen; j++) {
						if (Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0] === tagid) {
							tagname = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][1]
							globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][0] -= 1
						}
					}
				}
				
				//file
				var fileslen = globaldb.quomediaviewdb[3].qmv_files.length
				for (var i = 0; i < fileslen; i++) {
					var fileid = Object.keys(globaldb.quomediaviewdb[3].qmv_files[i])[0]
					if (testarray[inmediaedit][0] === fileid) {
						var fileparamslen = globaldb.quomediaviewdb[3].qmv_files[i][fileid].length
						for (var j = 0; j < fileparamslen; j++) {
							if (Object.keys(globaldb.quomediaviewdb[3].qmv_files[i][fileid][j])[0] === "tags") {
								//file
								var filetagidplace = globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags.indexOf(tagid)
								globaldb.quomediaviewdb[3].qmv_files[i][fileid][j].tags.splice(filetagidplace,1)
								//search results
								var searchresultsidplace = testarray[inmediaedit][6].indexOf(tagid)
								testarray[inmediaedit][6].splice(searchresultsidplace,1)
								testarray[inmediaedit][7].splice(searchresultsidplace,1)
							}
						}
					}
				}
			}
		}
	changeguard = 1
	changesnotify()	
	}
}

//goes to previous media
function mvb_prev() {
	if (inmediaedit !== 0) {
		inmediaedit -= 1
		editmedia()
	}
}

//goes to next media
function mvb_next() {
	if(inmediaedit !== testarray.length - 1) {
		inmediaedit += 1
		editmedia()
	}
}

//opens tag menu to add new tags and rename existing ones
function edittags() {
	document.getElementById("menusidesettings").style.display = "none"
	document.getElementById("maingridview").style.display = "none"
	document.getElementById("tagsedit").style.display = "block"
	document.getElementById("menulist").style.display = "block"
	tagseditloader()
}

//closes every other window and opens maingridview
function backtomain() {
	document.getElementById("mediaedit").style.display = "none"
	document.getElementById("tagsedit").style.display = "none"
	document.getElementById("menusidesettings").style.display = "none"
	editguard = 0
	tagsmenu()
	document.getElementById("maingridview").style.display = "block"
	document.getElementById("menulist").style.display = "block"
	document.getElementById("navigation").style.visibility = "visible"
}

function settings_changer(settchanged) {
	var settingslen = globaldb.quomediaviewdb[0].qmv_settings.length
	for (var i = 0; i < settingslen; i++) {
		switch (settchanged) {
			case "thumbnails":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "thumbnails") {
					globaldb.quomediaviewdb[0].qmv_settings[i].thumbnails = document.getElementById("sidesett_thumb").checked
					thumbnails = document.getElementById("sidesett_thumb").checked
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "gridcount":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "gridcount") {
					globaldb.quomediaviewdb[0].qmv_settings[i].gridcount = document.getElementById("sidesett_maxgrid").value
					maxgridcount = document.getElementById("sidesett_maxgrid").value
					currentpage = 1
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "infoicon":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "infoicon") {
					globaldb.quomediaviewdb[0].qmv_settings[i].infoicon = document.getElementById("sidesett_infoicon").value
					infoicon = document.getElementById("sidesett_infoicon").value
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "baselocation":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "baselocation") {
					globaldb.quomediaviewdb[0].qmv_settings[i].baselocation = document.getElementById("sidesett_baselocation").value
					baselocation = document.getElementById("sidesett_baselocation").value
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "searchbar":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "searchbar") {
					globaldb.quomediaviewdb[0].qmv_settings[i].searchbar = document.getElementById("sidesett_searchbar").value
					document.getElementById("easystylechange_searchbar").innerHTML = "#searchbar {background-color: " + document.getElementById("sidesett_searchbar").value + "}"
				}
				break;
			case "banbar":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "banbar") {
					globaldb.quomediaviewdb[0].qmv_settings[i].banbar = document.getElementById("sidesett_blockbar").value
					document.getElementById("easystylechange_blockbar").innerHTML = "#banbar {background-color: " + document.getElementById("sidesett_blockbar").value + "}"
				}
				break;
			case "b_picture":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "b_picture") {
					globaldb.quomediaviewdb[0].qmv_settings[i].b_picture = document.getElementById("sidesett_b_picture").value
					document.getElementById("easystylechange_b_picture").innerHTML = ".picture {border: " + gridbordersize + "px " + gridborderstyle + " " + document.getElementById("sidesett_b_picture").value + "}"
				}
				break;
			case "b_animated":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "b_animated") {
					globaldb.quomediaviewdb[0].qmv_settings[i].b_animated = document.getElementById("sidesett_b_animated").value
					document.getElementById("easystylechange_b_animated").innerHTML = ".animated {border: " + gridbordersize + "px " + gridborderstyle + " " + document.getElementById("sidesett_b_animated").value + "}"
				}
				break;
			case "b_video":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "b_video") {
					globaldb.quomediaviewdb[0].qmv_settings[i].b_video = document.getElementById("sidesett_b_video").value
					document.getElementById("easystylechange_b_video").innerHTML = ".video {border: " + gridbordersize + "px " + gridborderstyle + " " + document.getElementById("sidesett_b_video").value + "}"
				}
				break;
			case "aspectratio":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "aspectratio") {
					globaldb.quomediaviewdb[0].qmv_settings[i].aspectratio = document.getElementById("sidesett_aspratio").checked
					gridaspectratio = document.getElementById("sidesett_aspratio").checked
					gridthumbupdt()
				}
				break;
			case "thumbsize":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "thumbsize") {
					globaldb.quomediaviewdb[0].qmv_settings[i].thumbsize = document.getElementById("sidesett_thmbsize").value
					gridthumbsize = document.getElementById("sidesett_thmbsize").value
					gridthumbupdt()
				}
				break;
			case "sidepanelwidth":
				if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "sidepanelwidth") {
					globaldb.quomediaviewdb[0].qmv_settings[i].sidepanelwidth = document.getElementById("sidesett_sppsize").value
					sidepanelwidth = document.getElementById("sidesett_sppsize").value
					if (sidepreviewpanelactive === true) {
						sidepanelpreviewer()
					}
				}
				break;
		}
	}
	changeguard = 1
	changesnotify()
}

//imports tags to tags editor
function tagseditloader() {
	var allgroupslen = globaldb.quomediaviewdb[2].qmv_tags.length
	taggroupslen = allgroupslen
	var formcontent = ""
	for (var i = 0; i < allgroupslen; i++) {
		var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
		var tagscolor = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[1]
		var groupname = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[0]
		//group name
		formcontent += "<div id='tg_div_" + i + "'><input type='text' id='" + groupid + "_n' value='" + groupname + "' onchange='tagupdate(\"" + groupid + "_n\")'/> "
		//group color
		formcontent += "<label for='" + groupid + "_c'>Color:</label><input type='color' id='" + groupid + "_c' value='" + tagscolor + "' onchange='tagupdate(\"" + groupid + "_c\")'/> "
		//hide checkbox
		formcontent += "<label for='" + groupid + "_h'>Hide tag group:</label><input type='checkbox' id='" + groupid + "_h' onchange='tagupdate(\"" + groupid + "_h\")'"
		if (globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[2] === "hide") {
			formcontent += " checked /> "
		} else {
			formcontent += " /> "
		}
		//delete button
		formcontent += "<label>Delete tag group:</label><input type='button' onclick='deletetaggroup(\"tg_div_" + i + "\", \"" + groupid + "\")' value='X' /><br /><br /><div id='tg_tags_" + i + "'>"
		var tagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
		for (var j = 0; j < tagslen; j++) {
			var tagid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0]
			var taglen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid].length
			var tagname = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][1]
			//tag name
			formcontent += "<div id='" + tagid + "'>* <input type='text' id='" + tagid + "_tn' value='" + tagname + "' onchange='tagupdate(\"" + tagid + "_tn\")'/> "
			//tag description
			formcontent += "<input type='text' id='" + tagid + "_td' placeholder='description' value='"
			// checks if the tag has description
			if (taglen === 3) {
				if (typeof globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][2] === "string") {
					formcontent += globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][2]
				} 
			}
			formcontent += "' onchange='tagupdate(\"" + tagid + "_td\")'/> <input type='button' onclick='deletetag(\"" + tagid + "\")' value='X' /><br /></div>"
		}
		formcontent += "</div><input type='button' onclick='addnewtag(\"tg_tags_" + i + "\", \"" + groupid + "\")' value='+' /><br /><br /></div><br />"
	}
	formcontent += "<div id='newtaggroupadderdiv'><input type='button' id='newtaggroupadder' onclick='addnewtaggroup()' value='New tag group' /></div>"
	document.getElementById("tagsform").innerHTML = formcontent
}

//updates tags
function tagupdate(tagdiv) {
	//xxx_n - tag group name
	//xxx_c - tag group color
	//xxx_h - tag group hide
	//yy_tn - tag name
	//yy_td - tag description
	
	var upcheck = tagdiv.split("_")
	switch (upcheck[1]) {
		case "n":
			var tglen = globaldb.quomediaviewdb[2].qmv_tags.length
			for (var i = 0; i < tglen; i++) {
				var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
				if (groupid === upcheck[0]) {
					globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[0] = document.getElementById(tagdiv).value
					changeguard = 1
					changesnotify()
					tagsmenu()
				}
			}
			break;
		case "c":
			var tglen = globaldb.quomediaviewdb[2].qmv_tags.length
			for (var i = 0; i < tglen; i++) {
				var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
				if (groupid === upcheck[0]) {
					globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[1] = document.getElementById(tagdiv).value
					changeguard = 1
					changesnotify()
					tagsmenu()
				}
			}
			break;
		case "h":
			var tglen = globaldb.quomediaviewdb[2].qmv_tags.length
			for (var i = 0; i < tglen; i++) {
				var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
				if (groupid === upcheck[0]) {
					var hidebox = document.getElementById(tagdiv).checked
					if (hidebox === true) {
						globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[2] = "hide"
					} else {
						globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[2] = "show"
					}
					changeguard = 1
					changesnotify()
					tagsmenu()
				}
			}
			break;
		case "tn":
			var tglen = globaldb.quomediaviewdb[2].qmv_tags.length
			for (var i = 0; i < tglen; i++) {
				var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
				var tagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
				for (var j = 0; j < tagslen; j++) {
					var tagid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0]
					if (tagid === upcheck[0]) {
						globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][1] = document.getElementById(tagdiv).value
						changeguard = 1
						changesnotify()
						tagsmenu()
					}
				}
			}
			break;
		case "td":
			var tglen = globaldb.quomediaviewdb[2].qmv_tags.length
			for (var i = 0; i < tglen; i++) {
				var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
				var tagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
				for (var j = 0; j < tagslen; j++) {
					var tagid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0]
					if (tagid === upcheck[0]) {
						if (document.getElementById(tagdiv).value === "") {
							globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid].splice(2,1)
						} else {
							globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j][tagid][2] = document.getElementById(tagdiv).value
						}
						changeguard = 1
						changesnotify()
						tagsmenu()
					}
				}
			}
			break;												
	}
}

//add new tag
function addnewtag(tagsdivname,taggroupid) {
	var tglen = globaldb.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < tglen; i++) {
		var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
		if (groupid === taggroupid) {
			var lettercount = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[3].split("_")
			var newnumber = lettercount[1] * 1 + 1
			var newtagid = lettercount[0] + newnumber
			document.getElementById(tagsdivname).innerHTML += "<div id='" + newtagid + "'>* <input type='text' id='" + newtagid + "_tn' onchange='tagupdate(\"" + newtagid + "_tn\")'/> <input type='text' id='" + newtagid + "_td' placeholder='description' onchange='tagupdate(\"" + newtagid + "_td\")'/> <input type='button' onclick='deletetag(\"" + newtagid + "\")' value='X' />"
			
			//add to globaldb
			globaldb.quomediaviewdb[2].qmv_tags[i][groupid][0].settings[3] = lettercount[0] + "_" + newnumber
			var tagstring = '{"' + newtagid + '":[0,""]}'
			var tagobject = JSON.parse(tagstring)
			globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.push(tagobject)
			
			changeguard = 1
			changesnotify()
		}
	}
}

//deletes tag
function deletetag(tagdiv) {
	while (document.getElementById(tagdiv).hasChildNodes()) {  
		document.getElementById(tagdiv).removeChild(document.getElementById(tagdiv).firstChild);
	}
	var groupslen = globaldb.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < groupslen; i++) {
		var groupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0]
		var tagslen = globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.length
		for (var j = 0; j < tagslen; j++) {
			if (Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags[j])[0] === tagdiv) {
				globaldb.quomediaviewdb[2].qmv_tags[i][groupid][1].tags.splice(j,1)
				changeguard = 1
				changesnotify()
				tagsmenu()
				break;
			}
		}
	}
}

//adds new tag group
function addnewtaggroup() {
	var lastgroup = globaldb.quomediaviewdb[2].qmv_tags.length - 1
	var lastgroupid = Object.keys(globaldb.quomediaviewdb[2].qmv_tags[lastgroup])[0]
	var groupidarray = lastgroupid.split("-")
	var newgroupnumber = groupidarray[1] * 1 + 1
	var newgroupid = "group-" + newgroupnumber
	var lettersarray = "abcdefghijklmnopqrstuvwxyz".split("")
	document.getElementById("tagsform").removeChild(document.getElementById("newtaggroupadderdiv"))
	document.getElementById("tagsform").innerHTML += "<div id='tg_div_" + newgroupnumber + "' style='background-color:#050505;'><input type='text' id='" + newgroupid + "_n' onchange='tagupdate(\"" + newgroupid + "_n\")' value='" + newgroupid + "-name'/> <label for='" + newgroupid + "_c'>Color:</label><input type='color' id='" + newgroupid + "_c' onchange='tagupdate(\"" + newgroupid + "_c\")' value='#808080'/> <label for='" + newgroupid + "_h'>Hide tag group:</label><input type='checkbox' id='" + newgroupid + "_h' onchange='tagupdate(\"" + newgroupid + "_h\")' /> <label>Delete tag group:</label><input type='button' onclick='deletetaggroup(\"tg_div_" + newgroupnumber + "\", \"" + newgroupid + "\")' value='X' /><br /><br /><div id='tg_tags_" + newgroupnumber + "'></div><input type='button' onclick='addnewtag(\"tg_tags_" + newgroupnumber + "\", \"" + newgroupid + "\")' value='+' /><br /><br /></div><br /><div id='newtaggroupadderdiv'><input type='button' id='newtaggroupadder' onclick='addnewtaggroup()' value='New tag group' /></div>"
	
	
	//add to globaldb
	var jsonletterid = lettersarray[newgroupnumber - 1] + "_0"
	var taggroupstring = '{"' + newgroupid + '":[{"settings":["' + newgroupid + '-name","#808080","show","' + jsonletterid + '"]},{"tags":[]}]}'
	var taggroupobject = JSON.parse(taggroupstring)
	globaldb.quomediaviewdb[2].qmv_tags.push(taggroupobject)
	
	changeguard = 1
	changesnotify()
}

//deletes whole tag group
function deletetaggroup(taggroupdiv, taggroupname) {
	while (document.getElementById(taggroupdiv).hasChildNodes()) {  
		document.getElementById(taggroupdiv).removeChild(document.getElementById(taggroupdiv).firstChild);
	}
	var grouplen = globaldb.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < grouplen; i++) {
		if (Object.keys(globaldb.quomediaviewdb[2].qmv_tags[i])[0] === taggroupname) {
			globaldb.quomediaviewdb[2].qmv_tags.splice(i,1)
			changeguard = 1
			changesnotify()
			tagsmenu()
			break;
		}
	}
}

//resets default settings
function resetsettings() {
	var settingslen = globaldb.quomediaviewdb[0].qmv_settings.length
	for (var i = 0; i < settingslen; i++) {
		switch (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0]) {
			case "thumbnails":
				globaldb.quomediaviewdb[0].qmv_settings[i].thumbnails = true
				thumbnails = true
				document.getElementById("sidesett_thumb").checked = thumbnails
				break;
			case "gridcount":
				globaldb.quomediaviewdb[0].qmv_settings[i].gridcount = 28
				maxgridcount = 28
				currentpage = 1
				document.getElementById("sidesett_maxgrid").value = maxgridcount
				break;
			case "infoicon":
				globaldb.quomediaviewdb[0].qmv_settings[i].infoicon = "&#x2609;"
				infoicon = "&#x2609;"
				document.getElementById("sidesett_infoicon").value = infoicon
				break;
			case "searchbar":
				globaldb.quomediaviewdb[0].qmv_settings[i].searchbar = "#90ee90"
				document.getElementById("easystylechange_searchbar").innerHTML = "#searchbar {background-color: " + "#90ee90" + "}"
				document.getElementById("sidesett_searchbar").value = globaldb.quomediaviewdb[0].qmv_settings[i].searchbar
				break;
			case "banbar":
				globaldb.quomediaviewdb[0].qmv_settings[i].banbar = "#ffc0cb"
				document.getElementById("easystylechange_blockbar").innerHTML = "#banbar {background-color: " + "#ffc0cb" + "}"
				document.getElementById("sidesett_blockbar").value = globaldb.quomediaviewdb[0].qmv_settings[i].banbar
				break;
			case "b_picture":
				globaldb.quomediaviewdb[0].qmv_settings[i].b_picture = "#808080"
				document.getElementById("easystylechange_b_picture").innerHTML = ".picture {border: 2px solid " + "#808080" + "}"
				document.getElementById("sidesett_b_picture").value = globaldb.quomediaviewdb[0].qmv_settings[i].b_picture
				break;
			case "b_animated":
				globaldb.quomediaviewdb[0].qmv_settings[i].b_animated = "#ffa500"
				document.getElementById("easystylechange_b_animated").innerHTML = ".animated {border: 2px solid " + "#ffa500" + "}"
				document.getElementById("sidesett_b_animated").value = globaldb.quomediaviewdb[0].qmv_settings[i].b_animated
				break;
			case "b_video":
				globaldb.quomediaviewdb[0].qmv_settings[i].b_video = "#0000ff"
				document.getElementById("easystylechange_b_video").innerHTML = ".video {border: 2px solid " + "#0000ff" + "}"
				document.getElementById("sidesett_b_video").value = globaldb.quomediaviewdb[0].qmv_settings[i].b_video
				break;
			case "baselocation":
				globaldb.quomediaviewdb[0].qmv_settings[i].baselocation = ""
				baselocation = ""
				document.getElementById("sidesett_baselocation").value = baselocation
				break;
			case "chosentheme":
				globaldb.quomediaviewdb[0].qmv_settings[i].chosentheme = "ultradark"
				document.getElementById("themingfile").href = "qmvfiles/theme_ultradark.css"
				document.getElementById("darkthemesw").checked = true
				break;
			case "aspectratio":
				globaldb.quomediaviewdb[0].qmv_settings[i].aspectratio = true
				gridaspectratio = true
				document.getElementById("sidesett_aspratio").checked = true
				break;
			case "thumbsize":
				globaldb.quomediaviewdb[0].qmv_settings[i].thumbsize = 192
				gridthumbsize = 192
				document.getElementById("sidesett_thmbsize").value = 192
				break;
			case "sidepanelwidth":
				globaldb.quomediaviewdb[0].qmv_settings[i].sidepanelwidth = 36
				sidepanelwidth = 36
				document.getElementById("sidesett_sppsize").value = 36
				break;
			case "leftmclick":
				globaldb.quomediaviewdb[0].qmv_settings[i].leftmclick = "sidepreviewpanel"
				leftmclick = "sidepreviewpanel"
				document.getElementById("sidesett_sidepanelsw").checked = true
				if (sidepreviewpanelactive === true) {
					sidepanelpreviewer()
				}
				break;
		}
	}
	searching(document.getElementById('searchbar').value)
	gridthumbupdt()
	changeguard = 1
	changesnotify()
}

//exports new empty database in one line string
function createnewqmvdb() {
	document.getElementById("jsonsaveholder").value = qmvdbtemplate
}

//exports the full database in one line string
function saveqmv() {
	var savedata = JSON.stringify(globaldb)
	savedata = savedata.replace("\\","")
	document.getElementById("jsonsaveholder").value = savedata
}

//theme switch light or dark
function themeswitch(seltheme) {
	var settingslen = globaldb.quomediaviewdb[0].qmv_settings.length
	for (var i = 0; i < settingslen; i++) {
		if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "chosentheme") {
			switch (seltheme) {
				case "dark":
					globaldb.quomediaviewdb[0].qmv_settings[i].chosentheme = "ultradark"
					document.getElementById("themingfile").href = "qmvfiles/theme_ultradark.css"
					break;
				case "light":
					globaldb.quomediaviewdb[0].qmv_settings[i].chosentheme = "lightlite"
					document.getElementById("themingfile").href = "qmvfiles/theme_lightlite.css"
					break;
			}
		}
	}
}

//when called writes a combo of selected size and aspect ratio to styling
function gridthumbupdt() {
	if (gridaspectratio === true) {
		document.getElementById("easystylechange_gridsizespect").innerHTML = ".thmbnl_box { width: " + gridthumbsize + "px; height: " + gridthumbsize + "px; } .thmbnl { max-width: " + gridthumbsize + "px; max-height: " + gridthumbsize + "px; }"
	} else {
		document.getElementById("easystylechange_gridsizespect").innerHTML = ".thmbnl_box { width: " + gridthumbsize + "px; height: " + gridthumbsize + "px; } .thmbnl { width: " + gridthumbsize + "px; height: " + gridthumbsize + "px; }"
	}
}

//checks if qmv_settings are up to date with all features
function qmvsettings_updater() {
	var settingslen = globaldb.quomediaviewdb[0].qmv_settings.length
	var currentsettingslist = ["thumbnails", "gridcount", "infoicon", "searchbar", "banbar", "b_picture", "b_animated", "b_video", "baselocation", "chosentheme", "aspectratio", "thumbsize", "sidepanelwidth", "leftmclick"]
	var currentsettingslistlen = currentsettingslist.length
	for (var j = 0; j < currentsettingslistlen; j++) {
		switch (currentsettingslist[j]) {
			case "thumbnails":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "thumbnails") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"thumbnails": true}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "gridcount":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "gridcount") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"gridcount": 28}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "infoicon":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "infoicon") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"infoicon": "&#x2609;"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "searchbar":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "searchbar") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"searchbar": "#90ee90"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "banbar":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "banbar") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"banbar": "#ffc0cb"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "b_picture":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "b_picture") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"b_picture": "#808080"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "b_animated":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "b_animated") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"b_animated": "#ffa500"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "b_video":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "b_video") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"b_video": "#0000ff"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "baselocation":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "baselocation") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"baselocation": ""}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "chosentheme":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "chosentheme") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"chosentheme": "ultradark"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;				
			case "aspectratio":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "aspectratio") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"aspectratio": true}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "thumbsize":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "thumbsize") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"thumbsize": 192}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
			case "sidepanelwidth":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "sidepanelwidth") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"sidepanelwidth": 36}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;				
			case "leftmclick":
				var foundsetting = false
				for (var i = 0; i < settingslen; i++) {
					if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "leftmclick") {
						foundsetting = true
					} else if (i === settingslen - 1 && foundsetting === false) {
						var texttopush = JSON.parse('{"leftmclick": "sidepreviewpanel"}')
						globaldb.quomediaviewdb[0].qmv_settings.push(texttopush)
					}
				}
				break;
		}
	}
}

//automatically moves to next picture in ligthbox
function lightbox_slideshow(state) {
	if (state === "start") {
		var slideshowtiming = prompt("Enter how many seconds each file should stay on screen before changing", "5") * 1000
		if (slideshowtiming !== 0) {
			document.getElementById("bvbtempbuttonsbar").style.display = "none"
			document.getElementById("bvbslideshowactive").style.display = "block"
			lightboxtimer = setInterval(bvb_next ,slideshowtiming)
		}
	} else if (state === "stop") {
		clearInterval(lightboxtimer)
		document.getElementById("bvbtempbuttonsbar").style.display = "block"
		document.getElementById("bvbslideshowactive").style.display = "none"
	}
}

//opens side panel preview which is basically just smaller, portable single media view
function sidepanelpreviewer() {
	document.getElementById("bigviewbox").style.display = "none"
	document.getElementById("menu").style.display = "block"
	document.getElementById("maingridview").style.display = "block"
	document.getElementById("mediagrid").style.width = "" + (100 - sidepanelwidth) + "%"
	document.getElementById("sidepreviewpanel").style.width = "" + sidepanelwidth + "%"
	document.getElementById("sidepreviewpanel").style.display = "block"
	sidepreviewpanelactive = true
	document.getElementById("spp_lightboxbtnparent").innerHTML = "<input type='button' onclick='bigviewer(" + insidepanelpreview + ")' value='Fullscreen' title='Open file in Lightbox' id='spp_lightboxbtn' />"
	document.getElementById("spp_editbtnparent").innerHTML = "<input type='button' onclick='inmediaedit = " + insidepanelpreview + "; editmedia()' value='Edit' title='Open file in edit mode' id='spp_editbtn' />"
	var disp_linktags = ""
		var filetagslen = testarray[insidepanelpreview][7].length
		for (var i = 0; i < filetagslen; i++) {
			if (i === filetagslen - 1) {
				disp_linktags += testarray[insidepanelpreview][7][i]
			} else {
				disp_linktags += testarray[insidepanelpreview][7][i] + ","
			}
		}
	var singlemvpath = "quomediaview.html#qmv_smv#" + baselocation + testarray[insidepanelpreview][1] + testarray[insidepanelpreview][2] + "#" + disp_linktags
	if (testarray[insidepanelpreview][8] !== "") {
		singlemvpath += "#" + testarray[insidepanelpreview][8]
	}
	document.getElementById("spp_newtablink").href = singlemvpath
	var filepath = baselocation + testarray[insidepanelpreview][1] + testarray[insidepanelpreview][2]
	var filetype = testarray[insidepanelpreview][5]
	if (filetype === "video") {
		document.getElementById("sppmediabox").innerHTML = "<video src='" + filepath + "' id='sppmainmedia' class='bigmainmedia' controls>Your browser can not display videos</video>"
	} else {
		document.getElementById("sppmediabox").innerHTML = "<img src='" + filepath + "' id='sppmainmedia' class='bigmainmedia'/>"
	}
	document.getElementById("sppinfoname").innerHTML = testarray[insidepanelpreview][2]
	document.getElementById("sppinfolocation").innerHTML = baselocation + testarray[insidepanelpreview][1]
	document.getElementById("sppinfodescription").innerHTML = testarray[insidepanelpreview][8]
	
	var filetypes = testarray[insidepanelpreview][2].split(".")
	var filetypeslen = filetypes.length
	var filetypelast = filetypes[filetypeslen - 1].toLowerCase()
	if (filetypelast === "mp4" || filetypelast === "webm" || filetypelast === "ogg") {
		document.getElementById("sppinfodetails").innerHTML = ""
	} else {
		document.getElementById("sppinfodetails").innerHTML = "Width: " + document.getElementById("sppmainmedia").naturalWidth + "<br />"
		document.getElementById("sppinfodetails").innerHTML += "Height: " + document.getElementById("sppmainmedia").naturalHeight
	}
	document.getElementById("sppinfotags").innerHTML = disp_linktags.replaceAll(',', ', ').replaceAll('_', ' ')
	document.getElementById("sppinfofullpath").innerHTML = document.getElementById("sppmainmedia").currentSrc.replace("%20"," ")
}

//closes side panel preview
function sidepanelpreview_close() {
	document.getElementById("mediagrid").style.width = "100%"
	document.getElementById("sidepreviewpanel").style.display = "none"
	sidepreviewpanelactive = false
}

//goes to previous media
function spp_prev() {
	if (insidepanelpreview !== 0) {
		insidepanelpreview -= 1
		sidepanelpreviewer()
	}
}

//goes to next media
function spp_next() {
	if(insidepanelpreview !== testarray.length - 1) {
		insidepanelpreview += 1
		sidepanelpreviewer()
	}
}

//changes selected left mouse click mode
function leftmclickswitcher(selectedmode) {
	var settingslen = globaldb.quomediaviewdb[0].qmv_settings.length
	for (var i = 0; i < settingslen; i++) {
		if (Object.keys(globaldb.quomediaviewdb[0].qmv_settings[i])[0] === "leftmclick") {
			switch (selectedmode) {
				case "sidepreviewpanel":
					globaldb.quomediaviewdb[0].qmv_settings[i].leftmclick = "sidepreviewpanel"
					leftmclick = "sidepreviewpanel"
					break;
				case "lightbox":
					globaldb.quomediaviewdb[0].qmv_settings[i].leftmclick = "lightbox"
					leftmclick = "lightbox"
					break;
			}
		}
	}
}

//catches the left mouse click and redirects it to selected lmc mode
function lmouseclickredirect(mediaarrayid) {
	switch (leftmclick) {
		case "sidepreviewpanel":
			insidepanelpreview = mediaarrayid
			sidepanelpreviewer()
			break;
		case "lightbox":
			inbigview = mediaarrayid
			bigviewer(mediaarrayid)
			break;
	}
}
