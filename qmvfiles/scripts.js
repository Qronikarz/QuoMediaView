// Paste your QuoMediaView JSON string in quotes below for automatic loading on start (remember to keep a backup and save changes):
var qmv_data_autoload_holder = ''
//var qmv_data_autoload_holder = '' // 2nd loader for quicker switching in testing

// Empty QuoMediaView JSON string template
var qmv_data_template = '{"quomediaviewdb":[{"qmv_settings":[{"customthumbnails":true},{"maxshownresults":28},{"infoicon":"&#x2609;"},{"searchbar":"#90ee90"},{"blocklist":"#ffc0cb"},{"b_picture":"#808080"},{"b_animated":"#ffa500"},{"b_video":"#0000ff"},{"baselocation":""},{"chosentheme":"ultradark"},{"filethumbaspectratio":true},{"filethumbsize":192},{"sidepanelwidth":36},{"leftmouseclick":"sidepanelpreview"},{"previewresults":true},{"resultsviewmode":"gridview"},{"version":"1.0"},{"blockedtags":[]}]},{"qmv_folders":[{"0":""}]},{"qmv_tags":[{"group-1":[{"settings":["bordergridtags","#008000","show","a_3"]},{"tags":[{"a1":[0,"picture"]},{"a2":[0,"animation"]},{"a3":[0,"video"]}]}]},{"group-2":[{"settings":["filetypetags","#87ceeb","show","b_6"]},{"tags":[{"b1":[0,"jpeg"]},{"b2":[0,"png"]},{"b3":[0,"webp"]},{"b4":[0,"gif"]},{"b5":[0,"webm"]},{"b6":[0,"mp4"]}]}]},{"group-3":[{"settings":["filetechtags","#d3d3d3","show","c_1"]},{"tags":[{"c1":[0,"audio"]}]}]}]},{"qmv_files":[]}]}'

// Settings section
var maxshownresults = 32 // How many files are displayed on one page
var customthumbnails = true // Enables custom thumbnails
var infoicon = "&#x2609;" // Info icon in the tag menu
var baselocation = "" // Allows to fake the gallery being located elsewhere
var filethumbaspectratio = true // Switches between square thumbnails and the ones that keep aspect ratio
var filethumbsize = 192 // Thumbnails size in grid results view
var sidepanelwidth = 36 // Side panel preview size
var leftmouseclick = "sidepanelpreview" // Lets functions know what left mouse click is supposed to do
var previewresults = true // Loads actual images or videos when they don't have custom set thumbnail, may cause performance issues on slow drives
var resultsviewmode = "gridview" // Changing how the search results are presented - grid or list

var filethumborderstyle = "solid" // Thumbnail border style //hidden - not in the settings
var filethumbordersize = 2 // Thumbnail border size //hidden - not in the settings. Remember to adjust the margin or padding in styles.css

// Variables for functions
var loaded_qmv = "" // Stores loaded and parsed QMV JSON data
var tags_collection = [] // All tags with ID, names, file count and descriptions
var search_results = [] // Stores files that matched the search
var blocked_tags_ids = [] // Persistent blocklist for tag ids
var rotation_value = 0 // Keeping the rotation value when using buttons to rotate - 2 clicks on 90deg left = 180deg left
var current_file = 0 // Current file in all section views
var current_page = 1 // Current page in results view
var lightbox_interval = "" // Interval for Lightbox slideshow. Timing is handled inside slideshow function



// Loads single media view or full database automatically
if (decodeURI(window.location).search("qmv_mode=singlefileview") !== -1) {
	section_open("singlefileview")
} else if (qmv_data_autoload_holder !== "") {
	document.getElementById("qmvjson_loadinput").value = qmv_data_autoload_holder
	loading("start")
}

// Loads QMV JSON string with settings and other needed things
function loading(state) {
	if (state === "start") {	
		var loaddata = document.getElementById("qmvjson_loadinput").value
		loaded_qmv = JSON.parse(loaddata.trim())
		document.getElementById("qmv_json_export_holder").value = ""
		qmv_updater()
	}
	//loading settings
	var settingslen = loaded_qmv.quomediaviewdb[0].qmv_settings.length
	for (var i = 0; i < settingslen; i++) {
		switch (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0]) {
			case "customthumbnails":
				customthumbnails = loaded_qmv.quomediaviewdb[0].qmv_settings[i].customthumbnails
				document.getElementById("sidesetting_customthumbnails").checked = customthumbnails
				break;
			case "maxshownresults":
				maxshownresults = loaded_qmv.quomediaviewdb[0].qmv_settings[i].maxshownresults
				document.getElementById("sidesetting_maxshownresults").value = maxshownresults
				break;
			case "infoicon":
				infoicon = loaded_qmv.quomediaviewdb[0].qmv_settings[i].infoicon
				document.getElementById("sidesetting_infoicon").value = infoicon
				break;
			case "searchbar":
				document.getElementById("easystylechange_searchbar").innerHTML += "#searchbar {background-color:" + loaded_qmv.quomediaviewdb[0].qmv_settings[i].searchbar + "}"
				document.getElementById("sidesetting_searchbar").value = loaded_qmv.quomediaviewdb[0].qmv_settings[i].searchbar
				break;
			case "blocklist":
				document.getElementById("easystylechange_blocklist").innerHTML += "#blocklist {color:" + loaded_qmv.quomediaviewdb[0].qmv_settings[i].blocklist + "}"
				document.getElementById("sidesetting_blocklist").value = loaded_qmv.quomediaviewdb[0].qmv_settings[i].blocklist
				break;
			case "b_picture":
				document.getElementById("easystylechange_b_picture").innerHTML += ".picture {border: " + filethumbordersize + "px " + filethumborderstyle + " " + loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_picture + "}"
				document.getElementById("sidesetting_b_picture").value = loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_picture
				break;
			case "b_animated":
				document.getElementById("easystylechange_b_animated").innerHTML += ".animated {border: " + filethumbordersize + "px " + filethumborderstyle + " " + loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_animated + "}"
				document.getElementById("sidesetting_b_animated").value = loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_animated
				break;
			case "b_video":
				document.getElementById("easystylechange_b_video").innerHTML += ".video {border: " + filethumbordersize + "px " + filethumborderstyle + " " + loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_video + "}"
				document.getElementById("sidesetting_b_video").value = loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_video
				break;
			case "baselocation":
				baselocation = loaded_qmv.quomediaviewdb[0].qmv_settings[i].baselocation
				document.getElementById("sidesetting_baselocation").value = baselocation
				break;
			case "chosentheme":
				document.getElementById("themingfile").href = "qmvfiles/theme_" + loaded_qmv.quomediaviewdb[0].qmv_settings[i].chosentheme + ".css"
				if (loaded_qmv.quomediaviewdb[0].qmv_settings[i].chosentheme === "ultradark") {
					document.getElementById("sidesetting_chosentheme_ultradark").checked = true
				} else if (loaded_qmv.quomediaviewdb[0].qmv_settings[i].chosentheme === "lightlite") {
					document.getElementById("sidesetting_chosentheme_lightlite").checked = true
				}
				break;
			case "filethumbaspectratio":
				filethumbaspectratio = loaded_qmv.quomediaviewdb[0].qmv_settings[i].filethumbaspectratio
				document.getElementById("sidesetting_filethumbaspectratio").checked = loaded_qmv.quomediaviewdb[0].qmv_settings[i].filethumbaspectratio
				break;
			case "filethumbsize":
				filethumbsize = loaded_qmv.quomediaviewdb[0].qmv_settings[i].filethumbsize
				document.getElementById("sidesetting_filethumbsize").value = loaded_qmv.quomediaviewdb[0].qmv_settings[i].filethumbsize
				break;
			case "sidepanelwidth":
				sidepanelwidth = loaded_qmv.quomediaviewdb[0].qmv_settings[i].sidepanelwidth
				document.getElementById("sidesetting_sidepanelwidth").value = loaded_qmv.quomediaviewdb[0].qmv_settings[i].sidepanelwidth
				break;
			case "leftmouseclick":
				leftmouseclick = loaded_qmv.quomediaviewdb[0].qmv_settings[i].leftmouseclick
				if (loaded_qmv.quomediaviewdb[0].qmv_settings[i].leftmouseclick === "sidepanelpreview") {
					document.getElementById("sidesetting_leftmouseclick_sidepanelpreview").checked = true
				} else if (loaded_qmv.quomediaviewdb[0].qmv_settings[i].leftmouseclick === "lightbox") {
					document.getElementById("sidesetting_leftmouseclick_lightbox").checked = true
				}
				break;
			case "previewresults":
				previewresults = loaded_qmv.quomediaviewdb[0].qmv_settings[i].previewresults
				document.getElementById("sidesetting_previewresults").checked = loaded_qmv.quomediaviewdb[0].qmv_settings[i].previewresults
				break;
			case "resultsviewmode":
				resultsviewmode = loaded_qmv.quomediaviewdb[0].qmv_settings[i].resultsviewmode
				if (loaded_qmv.quomediaviewdb[0].qmv_settings[i].resultsviewmode === "gridview") {
					document.getElementById("sidesetting_resultsviewmode_gridview").checked = true
				} else if (loaded_qmv.quomediaviewdb[0].qmv_settings[i].resultsviewmode === "listview") {
					document.getElementById("sidesetting_resultsviewmode_listview").checked = true
				}
				break;
			case "version":
				document.getElementById("qmv_stats_version").innerHTML = loaded_qmv.quomediaviewdb[0].qmv_settings[i].version
				break;
			case "creationdate":
				document.getElementById("qmv_stats_data").innerHTML = loaded_qmv.quomediaviewdb[0].qmv_settings[i].creationdate
				break;
			case "blockedtags":
				blocked_tags_ids = loaded_qmv.quomediaviewdb[0].qmv_settings[i].blockedtags
		}
	}
	thumbnails_styling()
	if (state === "start") {
		var folders_length = loaded_qmv.quomediaviewdb[1].qmv_folders.length
		for (var i = 0; i < folders_length; i++) {
			var folderid = Object.keys(loaded_qmv.quomediaviewdb[1].qmv_folders[i])
			document.getElementById("qmv_available_folders_list").innerHTML += "<option value='" + loaded_qmv.quomediaviewdb[1].qmv_folders[i][folderid] + "'></option>"
		}
		document.getElementById("functionless_logo").style.display = "none"
		document.getElementById("qmv_logo").style.display = "inline"
		document.getElementById("menu_controls").style.display = "block"
		document.getElementById("searchresults_main").removeChild(document.getElementById("qmvloadingsection"))
		document.getElementById("searchresults_pagination").style.display = "block"
		render_tags("start")
	}
}

// Renders tags in 3 places - menu, filesedit and tagsedit
function render_tags(action) {
	var list_holder = ""
	var file_tags_holder = ""
	var tags_edit_holder = ""
	tags_collection = []
	document.getElementById("available_tags_datalist").innerHTML = ""
	var taggroups_length = loaded_qmv.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < taggroups_length; i++) {
		var group_id = Object.keys(loaded_qmv.quomediaviewdb[2].qmv_tags[i])[0]
		var group_name = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[0]
		var color = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[1]
		var show_check = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[2]
		file_tags_holder += "<span id='" + group_id + "_section' class='tagcellsgroup' style='color: " + color + "'>"
		tags_edit_holder += "<div id='tg_div_" + i + "'><input type='text' id='" + group_id + "_n' value='" + group_name.replaceAll("_", " ") + "' onchange='tags_changer(\"group\",\"" + group_id + "\",\"name\")'/> <label for='" + group_id + "_c'>Color:</label><input type='color' id='" + group_id + "_c' value='" + color + "' onchange='tags_changer(\"group\",\"" + group_id + "\",\"color\")'/> <label for='" + group_id + "_h'>Hide tag group:</label><input type='checkbox' id='" + group_id + "_h' onchange='tags_changer(\"group\",\"" + group_id + "\",\"showhide\")'"
		if (show_check === "hide") {
			tags_edit_holder += " checked /> "
		} else {
			tags_edit_holder += " /> "
		}
		if (i !== 0) {
			tags_edit_holder += "Delete tag group:<input type='button' onclick='tags_changer(\"group\",\"" + group_id + "\",\"delete\")' value='X' />"
		}
		tags_edit_holder += "<br /><br /><div id='tg_tags_" + i + "'>"
		var group_tags_length = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags.length
		for (var j = 0; j < group_tags_length; j++) {
			var tag_array_holder = []
			var tag_id = Object.keys(loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j])[0]
			var tag_name = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][1]
			document.getElementById("available_tags_datalist").innerHTML += "<option value='" + tag_name + "'>"
			var tag_count = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][0]
			var tag_description = ""
			if (loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][2] !== undefined) {
				tag_description = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][2]
			}
			file_tags_holder += "<div id='" + tag_id + "_tbd' class='tagborder clickable' style='border-color: " + color + "' onclick='file_changer(\"tag-add\",\"" + tag_id + "\")' title='" + group_name.replaceAll("_", " ") + "'>" + tag_name.replaceAll("_", " ") + "</div>"
			tags_edit_holder += "<div id='" + tag_id + "'>* <input type='text' id='" + tag_id + "_tn' value='" + tag_name.replaceAll("_", " ") + "' onchange='tags_changer(\"tag\",\"" + tag_id + "\",\"name\")'/> <input type='text' id='" + tag_id + "_td' placeholder='description' value='" + tag_description + "' onchange='tags_changer(\"tag\",\"" + tag_id + "\",\"description\")'/> "
			if (i !== 0) {
				tags_edit_holder += "<input type='button' onclick='tags_changer(\"tag\",\"" + tag_id + "\",\"delete\")' value='X' />"
			}
			tags_edit_holder += "<br /></div></div>"
			tag_array_holder.push(tag_id, tag_name, tag_count, color, tag_description)
			tags_collection.push(tag_array_holder)
			if (loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[2] === "show") {
				list_holder += "<li><span class='menu_tag_link' style='color:" + color + "'><a href='' onclick='blocklisting(\"" + tag_id + "\",\"add\"); return false'>[-]</a> <a href='' onclick='document.getElementById(\"searchbar\").value += \"" + tag_name + " \"; return false'>" + tag_name.replaceAll("_", " ") + " | " + tag_count + "</a>"
				var tag_data_length = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id].length
				if (tag_data_length === 3 && tag_description !== "") {
					list_holder += " <a href='' onclick='tag_info_show(\"" + tag_id + "\"); return false'>" + infoicon + "</a></span></li>"
				} else {
					list_holder += "</span></li>"
				}
			}
		}
		if (i !== 0) {
			file_tags_holder += "<div id='" + group_id + "_newtag' class='tagborder' style='border-color: " + color + "'>new: <input type='text' id='" + group_id + "_qc' onchange='tags_changer(\"tag\",\"" + group_id + "\",\"quickcreate\")' /></div>"
			tags_edit_holder += "<input type='button' onclick='tags_changer(\"tag\",\"" + group_id + "\",\"create\")' value='+' />"
		}
		file_tags_holder += "</span>"
		tags_edit_holder += "<br /><br /></div><br />"
	}
	// Loading blocked tags
	document.getElementById("blocklist").innerHTML = ""
	blocked_tags_ids_length = blocked_tags_ids.length
	for (var j = 0; j < blocked_tags_ids_length; j++) {
		blocklisting(blocked_tags_ids[j],"load")
	}
	document.getElementById("tags_list").innerHTML = list_holder
	document.getElementById("filesedit_tagcellsbox").innerHTML = file_tags_holder
	document.getElementById("tagsedit_form").innerHTML = tags_edit_holder
	document.getElementById("qmv_stats_taggroups_count").innerHTML = taggroups_length
	document.getElementById("qmv_stats_tags_count").innerHTML = tags_collection.length
	if (action === "start") {
		searching("")
	}
}

// Handles searching with given search query while skipping the files with blocked tags
function searching(search_query) {
	var all_files_length = loaded_qmv.quomediaviewdb[3].qmv_files.length
	document.getElementById("qmv_stats_files_count").innerHTML = all_files_length
	document.getElementById("qmv_stats_preloadfiles_count").innerHTML = all_files_length
	var blocked_results = []
	// Checking if blocklist isn't empty and searching files that include the tags in it
	var blocked_tags_ids_length = blocked_tags_ids.length
	if (blocked_tags_ids_length > 0) {
		for (var blockedtag = 0; blockedtag < blocked_tags_ids_length; blockedtag++) {
			for (var i = 0; i < all_files_length; i++) {
				var file_id = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i])[0]
				if (!blocked_results.includes(file_id)) {
					var file_data_length = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id].length
					for (var j = 0; j < file_data_length; j++) {
						var file_data_id = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j])[0]
						if (file_data_id === "tags") {
							if (loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags.includes(blocked_tags_ids[blockedtag])) {
								blocked_results.push(file_id)
							}
						}
					}
				}
			}
		}
	}
	var found_files = []
	// Searching for files that match the used tags
	var temp_found = []
	for (var i = 0; i < all_files_length; i++) {
		var file_id = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i])[0]
		if (!blocked_results.includes(file_id)) {
			if (search_query.trim() !== "") {
				var searched_tags = search_query.trim().toLowerCase().split(" ")
				var searched_tags_length = searched_tags.length
				for (var searchedtag = 0; searchedtag < searched_tags_length; searchedtag++) {
					if (searchedtag === 0 || temp_found.includes(file_id)) {
						var tag_id = return_tag_id(searched_tags[searchedtag])
						var file_data_length = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id].length
						for (var j = 0; j < file_data_length; j++) {
							var file_data_id = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j])[0]
							if (file_data_id === "tags") {
								if (loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags.includes(tag_id) && !temp_found.includes(file_id)) {
									temp_found.push(file_id)
								} else if (!loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags.includes(tag_id) && temp_found.includes(file_id)) {
									var file_id_place =  temp_found.indexOf(file_id)
									temp_found.splice(file_id_place,1)
								}
							}
						}
					}
					if (searchedtag === searched_tags_length - 1) {
						found_files = temp_found
					}
				}
			} else {
				// If search query is empty show all files
				found_files.push(file_id)
			}
		}
	}
	// Preparing search results in an easy to read way for rendering functions
	search_results = []
	current_page = 1
	var found_files_length = found_files.length
	var tags_collection_length = tags_collection.length
	for (var found_file = 0; found_file < found_files_length; found_file++) {
		for (var i = 0; i < all_files_length; i++) {
			var file_id = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i])[0]
			if (found_files[found_file] === file_id) {
				var file_data_holder = []
				var file_path = ""
				var file_name = ""
				var border = ""
				var tags = []
				var thumbnail_path = ""
				var thumbnail_name = ""
				var description = ""
				var file_data_length = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id].length
				for (var j = 0; j < file_data_length; j++) {
					var file_data_nameid = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j])[0]
					switch (file_data_nameid) {
						case "name":
							var file_folder_id = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].name[1]
							var folders_length = loaded_qmv.quomediaviewdb[1].qmv_folders.length
							for (var k = 0; k < folders_length; k++) {
								if (Object.keys(loaded_qmv.quomediaviewdb[1].qmv_folders[k])[0] === file_folder_id) {
									file_path = loaded_qmv.quomediaviewdb[1].qmv_folders[k][file_folder_id]
								}
							}
							file_name = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].name[0]
							break;
						case "tags":
							var file_tags_length = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags.length
							var tags_holder = []
							for (var k = 0; k < file_tags_length; k++) {
								switch (loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags[k]) {
									case "a1":
										border = "picture"
										break;
									case "a2":
										border = "animated"
										break;
									case "a3":
										border = "video"
										break;
								}
								for (var l = 0; l < tags_collection_length; l++) {
									if (loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags[k] === tags_collection[l][0]) {
										tags_holder.push(tags_collection[l][1])
									}
								}
								if (k === file_tags_length - 1) {
									tags.push(tags_holder)
								} 
							}
							break;
						case "thmb":
							var thumbnail_folder_id = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].thmb[1]
							var folders_length = loaded_qmv.quomediaviewdb[1].qmv_folders.length
							for (var k = 0; k < folders_length; k++) {
								if (Object.keys(loaded_qmv.quomediaviewdb[1].qmv_folders[k])[0] === thumbnail_folder_id) {
									thumbnail_path = loaded_qmv.quomediaviewdb[1].qmv_folders[k][thumbnail_folder_id]
								}
							}
							thumbnail_name = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].thmb[0]
							break;
						case "desc":
							description = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].desc
							break;
					}
					if (j === file_data_length - 1) {
						file_data_holder.push(file_id,file_path,file_name,border,tags,thumbnail_path,thumbnail_name,description)
						search_results.push(file_data_holder)
					}
				}
			}
		}
	}
	search_results.reverse()
	render_results()
}

// Adding and removing tags to/from blocklist
function blocklisting(tag_id,state) {
	switch (state) {
		case "add":
			if (!blocked_tags_ids.includes(tag_id)) {
				var qmv_settings_length = loaded_qmv.quomediaviewdb[0].qmv_settings.length
				for (var i = 0; i < qmv_settings_length; i++) {
					if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "blockedtags") {
						loaded_qmv.quomediaviewdb[0].qmv_settings[i].blockedtags.push(tag_id)
					}
				}
				searching(document.getElementById('searchbar').value)
				blocklisting(tag_id,"load")
			}
			break;
		case "load":
			document.getElementById("blocklist").innerHTML += "<div id='blocklist_" + tag_id + "' class='blocked_tag clickable' onclick='blocklisting(\"" + tag_id + "\",\"remove\")'><span class='blocked_tag_x'>X</span> " + return_tag_name(tag_id).replaceAll("_", " ") + ",</div> "
			break;
		case "remove":
			var tag_id_place = blocked_tags_ids.indexOf(tag_id)
			var qmv_settings_length = loaded_qmv.quomediaviewdb[0].qmv_settings.length
			for (var i = 0; i < qmv_settings_length; i++) {
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "blockedtags") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].blockedtags.splice(tag_id_place,1)
				}
			}
			searching(document.getElementById('searchbar').value)
			document.getElementById("blocklist").removeChild(document.getElementById("blocklist_" + tag_id))
			break;
	}
}

// Renders the results in the main results view either in grid or list
function render_results() {
	document.getElementById("current_page").innerHTML = current_page + " of " + Math.ceil(search_results.length / maxshownresults)
	document.getElementById("pagetitle").innerHTML = ""
	// add search query to page title
	if (document.getElementById('searchbar').value !== "") {
		document.getElementById("pagetitle").innerHTML = document.getElementById('searchbar').value + " | "
	}
	document.getElementById("pagetitle").innerHTML += "page " + current_page + " of " + Math.ceil(search_results.length / maxshownresults) + " (" + search_results.length + ") | QuoMediaView"
	document.getElementById("searchresults_main").innerHTML = ""
	if (resultsviewmode === "listview") {
		document.getElementById("searchresults_main").innerHTML = "<table id='resultslisttable'><thead><tr><th>Icon</th><th>File Name</th><th>Type</th></tr></thead><tbody id='resultstableinside'></tbody></table>"
	}
	var start_position = (maxshownresults * current_page) - maxshownresults
	var end_position = maxshownresults * current_page
	for (; start_position < end_position; start_position++) {
		if (search_results[start_position] != undefined) {
			var full_path = search_results[start_position][1] + search_results[start_position][2]
			var full_thumbnail_path = search_results[start_position][5] + search_results[start_position][6]
			var border = search_results[start_position][3]
			var description = search_results[start_position][7]
			var preload_files_check = ""
			if (previewresults !== true) {
				preload_files_check = "qmv/fileloadblocker"
			}
			var linktags = ""
			var tags_length = search_results[start_position][4].length
			for (var i = 0; i < tags_length; i++) {
				if (i === tags_length - 1) {
					linktags += search_results[start_position][4][i]
				} else {
					linktags += search_results[start_position][4][i] + ","
				}
			}
			var file_render_string = ""
			if (resultsviewmode === "listview") {
				file_render_string += "<tr onclick='lmc_redirect(" + start_position + ")'><td><div class='listviewiconbox'>"
			} else {
				file_render_string += "<div class='thmbnl_box' onclick='lmc_redirect(" + start_position + ")'><a href='quomediaview.html?qmv_mode=singlefileview&path=" + baselocation + full_path + "&tags=" + linktags + "&description=" + description + "' class='linklesslink'>"
			}
			if (return_file_display_tag(search_results[start_position][2]) === "video" && previewresults === true) {
				file_render_string += "<video"
			} else {
				file_render_string += "<img"
			}
			file_render_string += " src='" + baselocation
			if (customthumbnails === true && search_results[start_position][6] !== "") {
				file_render_string += full_thumbnail_path
			} else {
				file_render_string += preload_files_check + full_path
			}
			file_render_string += "' class='"
			if (resultsviewmode === "listview") {
				file_render_string += "listviewicon " + border + "' /></div></td><td>" + search_results[start_position][2] + "</td><td>" + search_results[start_position][3] + "</td></tr>"
			} else {
				file_render_string += "thmbnl " + border + "' /></a></div>"
			}
			if (resultsviewmode === "listview") {
				document.getElementById("resultstableinside").innerHTML += file_render_string
			} else {
				document.getElementById("searchresults_main").innerHTML += file_render_string
			}
		}
	}
	// Prevents opening images with left mouse button to allow opening lightbox and side panel preview
	var image_links = document.getElementsByClassName("linklesslink");
	var image_links_length = image_links.length
	for (var i = 0; i < image_links_length; i++) {
		image_links[i].addEventListener("click", function(event){event.preventDefault()});
	}
}

// Changes current page in clean way
function pagination_pagechange(chosenpage) {
	var pagescount = Math.ceil(search_results.length / maxshownresults)
	switch (chosenpage) {
		case "first":
			if (current_page > 1) {
				current_page = 1
				render_results()
			}
			break;
		case "previous":
			if (current_page > 1) {
				current_page -= 1
				render_results()
			}
			break;
		case "next":
			if (current_page < pagescount) {
				current_page += 1
				render_results()
			}
			break;
		case "last":
			if (current_page < pagescount) {
				current_page = pagescount
				render_results()
			}
			break;
		default:
			if (chosenpage <= pagescount && chosenpage > 0 && chosenpage !== current_page) {
				current_page = chosenpage
				render_results()
			}
			break;
	}
}

// Catches the left mouse click and redirects it to selected left mouse click mode
function lmc_redirect(mediaid) {
	current_file = mediaid
	section_open(leftmouseclick)
}

// Handles opening view sections
function section_open(selectedsection) {
	switch (selectedsection) {
		case "lightbox":
			document.getElementById("menu").style.display = "none"
			document.getElementById("searchresults").style.display = "none"
			document.getElementById("lightbox").style.display = "block"
			document.getElementById("lightbox").setAttribute('onkeydown','shortcut_handler("lightbox",event)')
			window.addEventListener("keydown", keyboard_shortcuts)
			file_viewer(selectedsection)
			break;
		case "filesedit":
			document.getElementById("searchresults").style.display = "none"
			document.getElementById("lightbox").style.display = "none"
			document.getElementById("filesedit").style.display = "block"
			document.getElementById("menu").style.display = "block"
			document.getElementById("menu_list").style.display = "none"
			document.getElementById("qmvinfostats").style.display = "none"
			document.getElementById("menu_sidesettings").style.display = "block"
			file_viewer(selectedsection)
			break;
		case "sidepanelpreview":
			document.getElementById("lightbox").style.display = "none"
			document.getElementById("menu").style.display = "block"
			document.getElementById("searchresults").style.display = "block"
			document.getElementById("searchresults_main").style.width = "" + (100 - sidepanelwidth) + "%"
			document.getElementById("sidepanelpreview").style.width = "" + sidepanelwidth + "%"
			document.getElementById("sidepanelpreview").style.display = "block"
			file_viewer(selectedsection)
			break;
		case "settings":
			document.getElementById("menu_list").style.display = "none"
			document.getElementById("menu_sidesettings").style.display = "block"
			break;
		case "tagsedit":
			document.getElementById("menu_sidesettings").style.display = "none"
			document.getElementById("searchresults").style.display = "none"
			document.getElementById("qmvinfostats").style.display = "none"
			document.getElementById("tagsedit").style.display = "block"
			document.getElementById("menu_list").style.display = "block"
			break;
		case "singlefileview":
			document.getElementById("menu_list").style.display = "none"
			document.getElementById("searchresults").style.display = "none"
			document.getElementById("singlefileview").style.display = "block"
			document.getElementById("singlefileview_infobox").style.display = "block"
			file_viewer(selectedsection)
			break;
		case "qmvinfostats":
			document.getElementById("menu_sidesettings").style.display = "none"
			document.getElementById("searchresults").style.display = "none"
			document.getElementById("filesedit").style.display = "none"
			document.getElementById("tagsedit").style.display = "none"
			document.getElementById("qmvinfostats").style.display = "block"
			document.getElementById("menu_list").style.display = "block"
	}
}

// Displays file and it's details in a specified section
function file_viewer(viewingmode) {
	rotation_value = 0
	var linktags = ""
	var filepath = ""
	var filetype = ""
	var filedescription = ""
	if (viewingmode !== "singlefileview") {
		var filetagslen = search_results[current_file][4].length
		for (var i = 0; i < filetagslen; i++) {
			if (i === filetagslen - 1) {
				linktags += search_results[current_file][4][i]
			} else {
				linktags += search_results[current_file][4][i] + ","
			}
		}
		var singlemvpath = "quomediaview.html?qmv_mode=singlefileview&path=" + baselocation + search_results[current_file][1] + search_results[current_file][2] + "&tags=" + linktags
		if (search_results[current_file ][7] !== "") {
			filedescription = search_results[current_file][7]
			singlemvpath += "&description=" + filedescription
		}
		if (viewingmode === "lightbox" || viewingmode === "sidepanelpreview") {
			document.getElementById(viewingmode + "_newtablink").href = singlemvpath
		}
		filepath = baselocation + search_results[current_file][1] + search_results[current_file][2]
		filetype = search_results[current_file][3]
	} else if (viewingmode === "singlefileview") {
		var browser_address = decodeURI(window.location)
		var address_string = browser_address.split("?")
		var address_parameters = address_string[1].split("&")
		var address_parameters_length = address_parameters.length
		for (var i = 0; i < address_parameters_length; i++) {
			if (address_parameters[i].startsWith("path")) {
				filepath = address_parameters[i].split("=")[1]
			}
			if (address_parameters[i].startsWith("tags")) {
				linktags = address_parameters[i].split("=")[1]
			}
			if (address_parameters[i].startsWith("description")) {
				filedescription = address_parameters[i].split("=")[1]
			}
		}
		filetype = return_file_display_tag(filepath)
	}
	var viewingmodestring = '"' + viewingmode + '"'
	if (filetype === "video") {
		viewingmodestring += ', "video"'
		document.getElementById(viewingmode + "_filebox").innerHTML = "<video src='" + filepath + "' id='" + viewingmode + "_file_display' oncanplay='file_viewer_afterload(" + viewingmodestring + ")' class='main_file_display' controls>Your browser can not display videos</video>"
	} else {
		viewingmodestring += ', "img"'
		document.getElementById(viewingmode + "_filebox").innerHTML = "<img src='" + filepath + "' id='" + viewingmode + "_file_display' onload='file_viewer_afterload(" + viewingmodestring + ")' class='main_file_display'/>"
	}
	if (viewingmode === "sidepanelpreview" || viewingmode === "singlefileview" || viewingmode === "filesedit") {
		if (viewingmode === "sidepanelpreview" || viewingmode === "singlefileview") {
			document.getElementById(viewingmode + "_fileinfo_locationname").innerHTML = filepath
			document.getElementById(viewingmode + "_fileinfo_description").innerHTML = filedescription
			document.getElementById(viewingmode + "_fileinfo_fullpath").innerHTML = document.getElementById(viewingmode + "_file_display").currentSrc.replaceAll("%20"," ")
		}
		tags_string = ""
		if (viewingmode === "sidepanelpreview" || viewingmode === "filesedit") {
			var links_color_array = search_results[current_file][4][0]
			var links_color_array_length = links_color_array.length
			for (var i = 0; i < links_color_array_length; i++) {
				var tag_color = return_tag_color(links_color_array[i])
				var tag_id = return_tag_id(links_color_array[i])
				if (viewingmode === "sidepanelpreview") {
					tags_string += "<span style='color:" + tag_color + "'>"
				} else if (viewingmode === "filesedit") {
					tags_string += "<div id='filesedit_filetag_" + tag_id + "' class='clickable file_tag' onclick='file_changer(\"tag-remove\",\"" + tag_id + "\")' style='color:" + tag_color + "'><span class='file_tag_x'>X</span> "
				}
				tags_string += links_color_array[i].replaceAll("_", " ")
				if (i === links_color_array_length - 1) {
					if (viewingmode === "sidepanelpreview") {
						tags_string += "</span>"
					} else if (viewingmode === "filesedit") {
						tags_string += "</div> "
					}
				} else {
					if (viewingmode === "sidepanelpreview") {
						tags_string += "</span>, "
					} else if (viewingmode === "filesedit") {
						tags_string += ",</div> "
					}
				}
			}
		} else {
			tags_string = linktags.replaceAll(',', ', ').replaceAll('_', ' ')
		}
		if (viewingmode !== "filesedit") {
			document.getElementById(viewingmode + "_fileinfo_tags").innerHTML = tags_string
		} else {
			document.getElementById(viewingmode + "_file_tags").innerHTML = tags_string
		}
	}
	if (viewingmode === "filesedit") {
		document.getElementById(viewingmode + "_file_foldermain").value = search_results[current_file][1]
		document.getElementById(viewingmode + "_file_namemain").value = search_results[current_file][2]
		document.getElementById(viewingmode + "_file_folderthumb").value = search_results[current_file][5]
		document.getElementById(viewingmode + "_file_namethumb").value = search_results[current_file][6]
		document.getElementById(viewingmode + "_file_description").value = search_results[current_file][7]
	}
}

// Continues displaying media after it has loaded to get more details about it
function file_viewer_afterload(viewingmode, filetype) {
	if (viewingmode === "sidepanelpreview" || viewingmode === "singlefileview") {
		if (filetype === "video") {
			document.getElementById(viewingmode + "_fileinfo_details").innerHTML = "Width: " + document.getElementById(viewingmode + "_file_display").videoWidth + "<br />"
			document.getElementById(viewingmode + "_fileinfo_details").innerHTML += "Height: " + document.getElementById(viewingmode + "_file_display").videoHeight
		} else {
			document.getElementById(viewingmode + "_fileinfo_details").innerHTML = "Width: " + document.getElementById(viewingmode + "_file_display").naturalWidth + "<br />"
			document.getElementById(viewingmode + "_fileinfo_details").innerHTML += "Height: " + document.getElementById(viewingmode + "_file_display").naturalHeight
		}
	}
}

// Displays tag info when clicking on infoicon in tags menu // in the future rewrite it as a dialog tag instead of js alert
function tag_info_show(tag_id) {
	var tags_collection_length = tags_collection.length
	for (var i = 0; i < tags_collection_length; i++) {
		if (tags_collection[i][0] === tag_id) {
			alert(tags_collection[i][4])
		}
	}
}

// Shows warning icon and activates exit confirmation to remind that changes were made to qmv database
function warn_changes_made() {
	document.getElementById("save_warning").style.display = "inline"
	window.onbeforeunload = function(){return ""}
}

// Handles keyboard shortcuts in lightbox
function keyboard_shortcuts() {
	switch (event.key) {
		case "Escape":
			section_close("generalexit")
			break;
		case "ArrowLeft":
			file_switch('previous','lightbox')
			break;
		case "ArrowRight":
			file_switch('next','lightbox')
			break;
	}
}

// Rotates given file by specified amount //rework in the future to accept values from 0-360
function file_rotate(rotationid,value) {
	switch (value) {
		case "right":
			if (rotation_value === 360) {
				rotation_value = 90
			} else {
				rotation_value += 90
			}
			break;
		case "left":
			if (rotation_value === 0) {
				rotation_value = 270
			} else {
				rotation_value -= 90
			}
			break;
		default:
			rotation_value = value * 1
	}
	if (rotation_value === 360 || rotation_value === 0 || rotation_value === 180) {
		document.getElementById(rotationid + "_file_display").style.transform = "rotate(" + rotation_value + "deg)"
	} else {
		var rotation_string = ""
		var f_width = document.getElementById(rotationid + "_file_display").width
		var f_height = document.getElementById(rotationid + "_file_display").height
		if (f_width === 0 && f_height === 0) {
			f_width = document.getElementById(rotationid + "_file_display").videoWidth
			f_height = document.getElementById(rotationid + "_file_display").videoHeight
		}
		var transl_width = (((f_width - f_height) / 2) / f_width) * 100
		var transl_height = (((f_width - f_height) / 2) / f_height) * 100
		if (f_width > f_height) {
			if (rotation_value === 90) {
				rotation_string += "rotate(" + rotation_value + "deg) translate(" + Math.abs(transl_width) + "%, " + Math.abs(transl_height) + "%)"
			} else if (rotation_value === 270) {
				rotation_string += "rotate(" + rotation_value + "deg) translate(-" + transl_width + "%, -" + transl_height + "%)"
			}
		} else {
			if (rotation_value === 90) {
				rotation_string += "rotate(" + rotation_value + "deg) translate(" + transl_width + "%, " + transl_height + "%)"
			} else if (rotation_value === 270) {
				rotation_string += "rotate(" + rotation_value + "deg) translate(" + Math.abs(transl_width) + "%, " + Math.abs(transl_height) + "%)"
			}
		}
		document.getElementById(rotationid + "_file_display").style.transform = rotation_string
	}
}

// Applies css filters to chosen file
function file_cssfilter(fileid,chosenfilter,value) {
	var filter_string = ""
	switch (chosenfilter) {
		case "brightness":
			filter_string = "brightness(" + value + "%)"
			break;
		case "contrast":
			filter_string = "contrast(" + value + "%)"
			break;
		case "hue-rotate":
			filter_string = "hue-rotate(" + value + "deg)"
			break;
		case "invert":
			filter_string = "invert(" + value + "%)"
			break;
		case "saturate":
			filter_string = "saturate(" + value + "%)"
			break;
	}
	document.getElementById(fileid + "_file_display").style.filter = filter_string
}

// Returns tag id from given name
function return_tag_id(tagname) {
	var tags_collection_length = tags_collection.length
	for (var i = 0; i < tags_collection_length; i++) {
		if (tags_collection[i][1].toLowerCase() === tagname.toLowerCase()) {
			return tags_collection[i][0]
		}
	}
}

// Returns tag name from given id
function return_tag_name(tagid) {
	tags_collection_length = tags_collection.length
	for (var i = 0; i < tags_collection_length; i++) {
		if (tags_collection[i][0] === tagid) {
			return tags_collection[i][1]
		}
	}
}

// Returns tag color from given id
function return_tag_color(tagname) {
	var tags_collection_length = tags_collection.length
	for (var i = 0; i < tags_collection_length; i++) {
		if (tags_collection[i][1].toLowerCase() === tagname.toLowerCase()) {
			return tags_collection[i][3]
		}
	}
}

// Returns what tag to use to display file based on file name
function return_file_display_tag(filename) {
	var file_extensions = filename.toLowerCase().split(".")
	var file_extension_last = file_extensions[file_extensions.length - 1]
	if (file_extension_last === "mp4" || file_extension_last === "webm" || file_extension_last === "ogg") {
		return "video"
	} else {
		return "img"
	}
}

// Return folder id from path or make a new one if it doesn't exist yet
function return_folder_id(path) {
	var folders_length = loaded_qmv.quomediaviewdb[1].qmv_folders.length       
	for (var folder = 0 ; folder < folders_length; folder++) {
		var qmv_folder_id = Object.keys(loaded_qmv.quomediaviewdb[1].qmv_folders[folder])[0]
		if (loaded_qmv.quomediaviewdb[1].qmv_folders[folder][qmv_folder_id] === path) {
			return qmv_folder_id
		} else if (folder === folders_length - 1 && loaded_qmv.quomediaviewdb[1].qmv_folders[folder][qmv_folder_id] !== path) {
			var new_folder_number = qmv_folder_id * 1 + 1
			var new_folder_string = '{"' + new_folder_number + '":"' + path + '"}'
			var new_folder_object = JSON.parse(new_folder_string)
			loaded_qmv.quomediaviewdb[1].qmv_folders.push(new_folder_object)
			document.getElementById("qmv_available_folders_list").innerHTML += "<option value='" + path + "'></option>"
			return new_folder_number
		}
	}
}

// Sorts tags in every tag group by name
function tagsorter() {
	var allgroupslen = loaded_qmv.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < allgroupslen; i++) {
		var referencearray = []
		var sortingarray = []
		var sortedarray = []
		var groupname = Object.keys(loaded_qmv.quomediaviewdb[2].qmv_tags[i])[0]
		var tagslen = loaded_qmv.quomediaviewdb[2].qmv_tags[i][groupname][1].tags.length
		for (var j = 0; j < tagslen; j++) {
			var tagid = Object.keys(loaded_qmv.quomediaviewdb[2].qmv_tags[i][groupname][1].tags[j])[0]
			var tagname = loaded_qmv.quomediaviewdb[2].qmv_tags[i][groupname][1].tags[j][tagid][1]
			referencearray.push(loaded_qmv.quomediaviewdb[2].qmv_tags[i][groupname][1].tags[j])
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
		loaded_qmv.quomediaviewdb[2].qmv_tags[i][groupname][1].tags = sortedarray
	}
	warn_changes_made()
	render_tags("")
}

// Passes files from file upload input to file adding function
function file_upload() {
	var filescount = document.getElementById("file_uploader").files.length
	for (var i = 0; i < filescount; i++) {
		var file = document.getElementById("file_uploader").files[i]
		file_add(file.name, file.size, file.type)
	}
	warn_changes_made()
	section_close("generalexit")
	render_tags("start")
	section_open('filesedit')
}

// Manages every change to file data in filesedit view
function file_changer(action,extraparam) {
	if (action === "name" || action === "folder" || action === "description") {
		var typed_string = document.getElementById("filesedit_file_" + action + extraparam).value
	}
	var files_length = loaded_qmv.quomediaviewdb[3].qmv_files.length
	for (var i = 0; i < files_length; i++) {
		var file_id = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i])[0]
		if (search_results[current_file][0] === file_id) {
			// Deleting file
			if (action === "delete") {
				var removal_tags_length = search_results[current_file][4][0].length
				for (var removetag = 0; removetag < removal_tags_length; removetag++) {
					tags_changer("tag",return_tag_id(search_results[current_file][4][0][removetag]),"count_minus")
				}
				loaded_qmv.quomediaviewdb[3].qmv_files.splice(i,1)     
				search_results.splice(current_file,1)
				break;
			}
			var file_data_length = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id].length
			for (var j = 0; j < file_data_length; j++) {
				// Main file name and folder
				if (extraparam === "main" && Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j])[0] === "name") {
					if (action === "name") {
						loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].name[0] = typed_string
						search_results[current_file][2] = typed_string
					}
					if (action === "folder") {
						loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].name[1] = "" + return_folder_id(typed_string)
						search_results[current_file][1] = typed_string
					}
				}
				// Adding/Removing tags
				if (action === "tag-add" || action === "tag-remove") {
					if (Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j])[0] === "tags") {
						var inside_action = action.split("-")[1]
						var tag_id = "" + extraparam
						var tag_place = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags.indexOf(extraparam)
						if (inside_action === "add") {
							if (tag_place === -1) {
								if (extraparam === "a1" || extraparam === "a2" || extraparam === "a3") {
									var old_radio_tag = loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags[0]
									tags_changer("tag",loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags[0],"count_minus")
									loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags[0] = extraparam
									var search_results_tag_place = search_results[current_file][4][0].indexOf(return_tag_name(old_radio_tag))
									search_results[current_file][4][0][search_results_tag_place] = return_tag_name(extraparam)
									tags_changer("tag",extraparam,"count_plus")
								} else {
									loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags.push(extraparam)
									search_results[current_file][4][0].push(return_tag_name(extraparam))
									tags_changer("tag",extraparam,"count_plus")
								}
							}
						} else if (inside_action === "remove") {
							if (tag_place !== -1) {
								if (extraparam !== "a1" && extraparam !== "a2" && extraparam !== "a3") {
									loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].tags.splice(tag_place,1)
									var search_results_tag_place = search_results[current_file][4][0].indexOf(return_tag_name(extraparam))
									search_results[current_file][4][0].splice(search_results_tag_place,1)
									tags_changer("tag",extraparam,"count_minus")
								}
							}
						}
					}
				}
				// thumbnail name and folder
				if (extraparam === "thumb") {
					var found_thumbnail = false
					if (Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j])[0] === "thmb") {
						found_thumbnail = true
						if (action === "name") {
							loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].thmb[0] = typed_string
							search_results[current_file][6] = typed_string
						}
						if (action === "folder") {
							loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j].thmb[1] = "" + return_folder_id(typed_string)
							search_results[current_file][5] = typed_string
						}
					}
					if (j === file_data_length - 1 && found_thumbnail === false) {
						var new_thumb_name = ""
						var new_thumb_folder_id = ""
						if (action === "name") {
							new_thumb_name = typed_string
							search_results[current_file][6] = typed_string
						}
						if (action === "folder") {
							new_folder_id = return_folder_id(typed_string)
							search_results[current_file][5] = typed_string
						}
						var new_thumb_string = '{"thmb":["' + new_thumb_name  + '","' + new_thumb_folder_id + '"]}'
						var new_thumb_object = JSON.parse(new_thumb_string )
						loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id].push(new_thumb_object)
					}
				}
				// File description
				if (action === "description") {
					found_description = false
					if (Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j])[0] === "desc") {
						found_description = true
						loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id][j]["desc"] = typed_string
						search_results[current_file][7] = typed_string
					}
					if (j === file_data_length - 1 && found_description === false) {
						var new_description_string = '{"desc":"' + typed_string + '"}'
						var new_description_object = JSON.parse(new_description_string)
						loaded_qmv.quomediaviewdb[3].qmv_files[i][file_id].push(new_description_object)
						search_results[current_file][7] = typed_string
					}
				}
			}
		}
	}
	if (action === "delete") {
		if (current_file === 0 && search_results.length === 0) {
			section_close("filesedit")
			searching("")
		} else if (current_file === search_results.length && current_file !== 0) {
			current_file -= 1
			file_viewer("filesedit")
		} else {
			file_viewer("filesedit")
		}
	}
	if (action !== "delete") {
		file_viewer("filesedit")
	}
	warn_changes_made()
}

// Handles dropped items and passes them to file uploading function
function item_drop(droppeditems) {
	droppeditems.preventDefault()
	if (!droppeditems.dataTransfer.items) {
		for (var i = 0; i < droppeditems.dataTransfer.items.length; i++) {
			if (droppeditems.dataTransfer.items[i].kind === 'file') {
				var file = droppeditems.dataTransfer.items[i].getAsFile()
				file_add(file.name, file.size, file.type)
			}
		}
	}  else {
		for (var i = 0; i < droppeditems.dataTransfer.files.length; i++) {
			var file = droppeditems.dataTransfer.files[i]
			file_add(file.name, file.size, file.type)
		}
	}
	warn_changes_made()
	render_tags("start")
	section_open('filesedit')
}

// Prevents openning dragged files by browser
function item_drag(item) {
	item.preventDefault()
}

// Closes opened view sections
function section_close(selectedsection) {
	document.getElementById("filesedit").style.display = "none"
	document.getElementById("tagsedit").style.display = "none"
	document.getElementById("menu_sidesettings").style.display = "none"
	document.getElementById("qmvinfostats").style.display = "none"
	document.getElementById("searchresults").style.display = "block"
	document.getElementById("menu_list").style.display = "block"
	document.getElementById("searchresults_pagination").style.visibility = "visible"
	document.getElementById("searchresults_main").style.width = "100%"
	document.getElementById("sidepanelpreview").style.display = "none"
	document.getElementById("lightbox").style.display = "none"
	lightbox_slideshow("stop")
	window.removeEventListener("keydown", keyboard_shortcuts)
	document.getElementById("menu").style.display = "block"
	switch (selectedsection) {
		case "generalexit":
			render_tags("")
			break;
		case "filesedit":
			render_results()
			break;
	}
}

// Changes settings without save button
function settings_changer(settchanged) {
	var settingslen = loaded_qmv.quomediaviewdb[0].qmv_settings.length
	for (var i = 0; i < settingslen; i++) {
		switch (settchanged) {
			case "customthumbnails":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "customthumbnails") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].customthumbnails = document.getElementById("sidesetting_customthumbnails").checked
					customthumbnails = document.getElementById("sidesetting_customthumbnails").checked
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "maxshownresults":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "maxshownresults") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].maxshownresults = document.getElementById("sidesetting_maxshownresults").value
					maxshownresults = document.getElementById("sidesetting_maxshownresults").value
					current_page = 1
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "infoicon":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "infoicon") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].infoicon = document.getElementById("sidesetting_infoicon").value
					infoicon = document.getElementById("sidesetting_infoicon").value
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "baselocation":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "baselocation") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].baselocation = document.getElementById("sidesetting_baselocation").value
					baselocation = document.getElementById("sidesetting_baselocation").value
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "searchbar":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "searchbar") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].searchbar = document.getElementById("sidesetting_searchbar").value
					document.getElementById("easystylechange_searchbar").innerHTML = "#searchbar {background-color: " + document.getElementById("sidesetting_searchbar").value + "}"
				}
				break;
			case "blocklist":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "blocklist") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].blocklist = document.getElementById("sidesetting_blocklist").value
					document.getElementById("easystylechange_blocklist").innerHTML = "#blocklist {color: " + document.getElementById("sidesetting_blocklist").value + "}"
				}
				break;
			case "b_picture":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "b_picture") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_picture = document.getElementById("sidesetting_b_picture").value
					document.getElementById("easystylechange_b_picture").innerHTML = ".picture {border: " + filethumbordersize + "px " + filethumborderstyle + " " + document.getElementById("sidesetting_b_picture").value + "}"
				}
				break;
			case "b_animated":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "b_animated") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_animated = document.getElementById("sidesetting_b_animated").value
					document.getElementById("easystylechange_b_animated").innerHTML = ".animated {border: " + filethumbordersize + "px " + filethumborderstyle + " " + document.getElementById("sidesetting_b_animated").value + "}"
				}
				break;
			case "b_video":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "b_video") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].b_video = document.getElementById("sidesetting_b_video").value
					document.getElementById("easystylechange_b_video").innerHTML = ".video {border: " + filethumbordersize + "px " + filethumborderstyle + " " + document.getElementById("sidesetting_b_video").value + "}"
				}
				break;
			case "filethumbaspectratio":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "filethumbaspectratio") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].filethumbaspectratio = document.getElementById("sidesetting_filethumbaspectratio").checked
					filethumbaspectratio = document.getElementById("sidesetting_filethumbaspectratio").checked
					thumbnails_styling()
				}
				break;
			case "filethumbsize":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "filethumbsize") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].filethumbsize = document.getElementById("sidesetting_filethumbsize").value
					filethumbsize = document.getElementById("sidesetting_filethumbsize").value
					thumbnails_styling()
				}
				break;
			case "sidepanelwidth":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "sidepanelwidth") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].sidepanelwidth = document.getElementById("sidesetting_sidepanelwidth").value
					sidepanelwidth = document.getElementById("sidesetting_sidepanelwidth").value
					if (document.getElementById("sidepanelpreview").style.display === "block") {
						section_open("sidepanelpreview")
					}
				}
				break;
			case "previewresults":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "previewresults") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].previewresults = document.getElementById("sidesetting_previewresults").checked
					previewresults = document.getElementById("sidesetting_previewresults").checked
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "chosentheme_ultradark":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "chosentheme") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].chosentheme = "ultradark"
					document.getElementById("themingfile").href = "qmvfiles/theme_ultradark.css"
					document.getElementById("sidesetting_chosentheme_ultradark").checked = true
				}
				break;
			case "chosentheme_lightlite":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "chosentheme") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].chosentheme = "lightlite"
					document.getElementById("themingfile").href = "qmvfiles/theme_lightlite.css"
					document.getElementById("sidesetting_chosentheme_lightlite").checked = true
				}
				break;
			case "leftmouseclick_sidepanelpreview":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "leftmouseclick") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].leftmouseclick = "sidepanelpreview"
					leftmouseclick = "sidepanelpreview"
				}
				break;
			case "leftmouseclick_lightbox":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "leftmouseclick") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].leftmouseclick = "lightbox"
					leftmouseclick = "lightbox"
				}
				break;
			case "resultsviewmode_gridview":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "resultsviewmode") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].resultsviewmode = "gridview"
					resultsviewmode = "gridview"
					searching(document.getElementById('searchbar').value)
				}
				break;
			case "resultsviewmode_listview":
				if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[i])[0] === "resultsviewmode") {
					loaded_qmv.quomediaviewdb[0].qmv_settings[i].resultsviewmode = "listview"
					resultsviewmode = "listview"
					searching(document.getElementById('searchbar').value)
				}
				break;
		}
	}
	warn_changes_made()
}

// Resets default settings
function settings_default(setting) {
	var qmv_default = JSON.parse(qmv_data_template)
	default_settings_length = qmv_default.quomediaviewdb[0].qmv_settings.length
	var settings_to_reset = [setting]
	if (setting === "all") {
		settings_to_reset = ["customthumbnails", "maxshownresults", "infoicon", "searchbar", "blocklist", "b_picture", "b_animated", "b_video", "baselocation", "chosentheme", "filethumbaspectratio", "filethumbsize", "sidepanelwidth", "leftmouseclick", "previewresults", "resultsviewmode"]
	}
	settings_to_reset_length = settings_to_reset.length
	for (var i = 0; i < settings_to_reset_length; i++) {
		var setting_name = settings_to_reset[i]
		for (var j = 0; j < default_settings_length; j++) {
			if (setting_name === Object.keys(qmv_default.quomediaviewdb[0].qmv_settings[j])[0]) {
				qmv_settings_length = loaded_qmv.quomediaviewdb[0].qmv_settings.length
				for (var k = 0; k < qmv_settings_length; k++) {
					if (setting_name === Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[k])[0]) {
						loaded_qmv.quomediaviewdb[0].qmv_settings[k][setting_name] = qmv_default.quomediaviewdb[0].qmv_settings[j][setting_name]
					}
				}
			}
		}
	}
	if (setting === "all") {
		warn_changes_made()
		loading("")
		thumbnails_styling()
		searching(document.getElementById('searchbar').value)
		if (document.getElementById("sidepanelpreview").style.display === "block") {
			section_open("sidepanelpreview")
		}
	}
}

// Exports the full QMV database in one line string for saving
function export_qmv(state) {
	if (state === "empty") {
		document.getElementById('qmv_json_export_holder').value = qmv_data_template
	} else if (state === "current") {
		document.getElementById("qmv_json_export_holder").value = JSON.stringify(loaded_qmv).replace("\\","")
	}
}

// Exports search query to readable text for backup purposes or browsing the items and tags in text editor
function export_searchquery() {
	var export_holder = "ste QuoMediaView query:("
	export_holder += document.getElementById('searchbar').value + ")\n"
	search_results_length = search_results.length
	for (var i = 0; i < search_results_length ; i++) {
		var full_path = search_results[i][1] + search_results[i][2]
		var linktags = ""
		var tags_length = search_results[i][4].length
		for (var j = 0; j < tags_length; j++) {
			if (j === tags_length - 1) {
				linktags += search_results[i][4][j]
			} else {
				linktags += search_results[i][4][j] + ","
			}
		}
		export_holder += baselocation + full_path + " (" + linktags.replaceAll("_"," ").replaceAll(",",", ") + ")\n"
	}
	document.getElementById('qmv_searchquery_text_holder').innerHTML = export_holder
}

// Writes a combo of selected size and aspect ratio for styling the thumbnails
function thumbnails_styling() {
	var thmb_aspect = filethumbaspectratio
	var thmb_style = ".thmbnl_box { width: " + filethumbsize + "px; height: " + filethumbsize + "px; } .thmbnl { "
	if (thmb_aspect === true) {
		thmb_style += "max-"
	}
	thmb_style += "width: " + filethumbsize + "px; "
	if (thmb_aspect === true) {
		thmb_style += "max-"
	}
	thmb_style += "height: " + filethumbsize + "px; } .listviewiconbox { width: " + 20 + "px; height: " + 20 + "px; } .listviewicon { "
	if (thmb_aspect === true) {
		thmb_style += "max-"
	}
	thmb_style += "width: " + 20 + "px; "
	if (thmb_aspect === true) {
		thmb_style += "max-"
	}
	thmb_style += "height: " + 20 + "px; }"
	document.getElementById("easystylechange_filethumbs").innerHTML = thmb_style
}

// Checks if qmv_settings in QMV JSON are up to date with all new features
function qmv_updater() {
	var update_settings = ["customthumbnails", "maxshownresults", "infoicon", "searchbar", "blocklist", "b_picture", "b_animated", "b_video", "baselocation", "chosentheme", "filethumbaspectratio", "filethumbsize", "sidepanelwidth", "leftmouseclick", "previewresults", "resultsviewmode", "version", "creationdate", "blockedtags"]
	var update_settings_length = update_settings.length
	for (var i = 0; i < update_settings_length; i++) {
		var qmv_settings_length = loaded_qmv.quomediaviewdb[0].qmv_settings.length
		var found_setting = false
		for (var j = 0; j < qmv_settings_length; j++) {
			if (Object.keys(loaded_qmv.quomediaviewdb[0].qmv_settings[j])[0] === update_settings[i]) {
				found_setting = true
			} else if (j === qmv_settings_length - 1 && found_setting === false) {
				switch (update_settings[i]) {
					case "creationdate":
						var date_string = new Date().toJSON().slice(0, 10)
						var new_setting_string = '{"creationdate": "' + date_string + '"}'
						var new_setting_object = JSON.parse(new_setting_string)
						loaded_qmv.quomediaviewdb[0].qmv_settings.push(new_setting_object)
						break;
					default:
						var new_setting_string = '{"' + update_settings[i] + '":1}'
						var new_setting_object = JSON.parse(new_setting_string)
						loaded_qmv.quomediaviewdb[0].qmv_settings.push(new_setting_object)
						settings_default(update_settings[i])
						break;
				}
			}
		}
	}
	
	var update_json = ["qmv_settings", "qmv_folders", "qmv_tags", "qmv_files", "qmv_info", "qmv_collections"]
	var update_json_length = update_json.length
	for (var i = 0; i < update_json_length; i++) {
		var qmv_json_objects_length = loaded_qmv.quomediaviewdb.length
		var found_qmvobject = false
		for (var j = 0; j < qmv_json_objects_length; j++) {
			if (Object.keys(loaded_qmv.quomediaviewdb[j])[0] === update_json[i]) {
				found_qmvobject = true
			} //else if (j === qmv_json_objects_length - 1 && found_qmvobject === false) {
				//console.log(update_json[i]) reserved for future version
			//}
		}
	}
}

//automatically moves to next picture in ligthbox
function lightbox_slideshow(state, direction) {
	if (state === "start") {
		var slideshowtiming = prompt("Enter how many seconds each file should stay on screen before changing", "5") * 1000
		if (slideshowtiming !== 0) {
			document.getElementById("lightbox_buttonstopbar").style.display = "none"
			document.getElementById("lightbox_slideshowbtnoff").style.display = "block"
			lightbox_interval = setInterval(file_switch, slideshowtiming, direction, "lightbox")
		}
	} else if (state === "stop") {
		clearInterval(lightbox_interval)
		document.getElementById("lightbox_buttonstopbar").style.display = "block"
		document.getElementById("lightbox_slideshowbtnoff").style.display = "none"
	}
}

// Adds uploaded files to QMV JSON
function file_add(name, size, type) {
	//console.log(size) //in the future use size in file data info
	var last_file = loaded_qmv.quomediaviewdb[3].qmv_files.length - 1
	if (last_file === -1) {
		var next_available_id = 0
	} else {
		var next_available_id = Object.keys(loaded_qmv.quomediaviewdb[3].qmv_files[last_file])[0] * 1 + 1
	}
	var default_folder = 1
	var border_tag = ""
	var file_type_extension = type.split("/")
	if (file_type_extension[1] === "gif" || file_type_extension[1] === "apng") {
		border_tag = "a2"
	} else {
		if (file_type_extension[0] === "image") {
			border_tag = "a1"
		} else if (file_type_extension[0] === "video") {
			border_tag = "a3"
		}
	}
	if (border_tag === "a1" || border_tag === "a2" || border_tag === "a3") {
		tags_changer("tag",border_tag,"count_plus")
	}
	var qmv_json_filestring = '{"' + next_available_id + '":[{"name":["' + name + '","' + default_folder + '"]},{"tags":["' + border_tag
	var file_extension_id = return_tag_id(file_type_extension[1])
	if (file_extension_id !== undefined) {
		qmv_json_filestring += '","' + file_extension_id
		tags_changer("tag",file_extension_id,"count_plus")
	}
	qmv_json_filestring += '"]}]}'
	var qmv_json_fileobject = JSON.parse(qmv_json_filestring)
	loaded_qmv.quomediaviewdb[3].qmv_files.push(qmv_json_fileobject)
}

// Moves to next, previous or other files
function file_switch(action, viewingmode) {
	switch (action) {
		case "previous":
			if (current_file !== 0) {
				current_file -= 1
				file_viewer(viewingmode)
			}
			break;
		case "next":
			if (current_file !== search_results.length - 1) {
				current_file += 1
				file_viewer(viewingmode)
			}
			break;
		case "random":
			var maxselect = search_results.length
			var selected_number = Math.floor(Math.random() * (maxselect + 1))
			if (selected_number === current_file) {
				file_switch('random', viewingmode)
			} else {
				current_file = selected_number * 1
				file_viewer(viewingmode)
			}
	}
}

// Changes every tag detail in tagsedit view
function tags_changer(grouportag,id,action) {
	var taggroups_length = loaded_qmv.quomediaviewdb[2].qmv_tags.length
	for (var i = 0; i < taggroups_length; i++) {
		var group_id = Object.keys(loaded_qmv.quomediaviewdb[2].qmv_tags[i])[0]
		if (action === "create" || action === "quickcreate") {
			if (grouportag === "group") {
				var last_group = loaded_qmv.quomediaviewdb[2].qmv_tags.length - 1
				var last_group_id = Object.keys(loaded_qmv.quomediaviewdb[2].qmv_tags[last_group])[0]
				var groupidcount = last_group_id.split("-")
				var new_group_id = "group-" + (groupidcount[1] * 1 + 1)
				var group_letters = "abcdefghijklmnopqrstuvwxyz".split("")
				var new_group_string = '{"' + new_group_id + '":[{"settings":["' + new_group_id + '-name","inherit","show","' + (group_letters[(groupidcount[1] * 1 + 1) - 1] + "_0") + '"]},{"tags":[]}]}'
				var new_group_object = JSON.parse(new_group_string)
				loaded_qmv.quomediaviewdb[2].qmv_tags.push(new_group_object)
				break;
			}
		}
		if (action === "name" && group_id === id) {
			loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[0] = document.getElementById(id + "_n").value.replaceAll(" ","_")
		}
		if (action === "color" && group_id === id) {
			loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[1] = document.getElementById(id + "_c").value
		}
		if (action === "showhide" && group_id === id) {
			if (document.getElementById(id + "_h").checked === true) {
				loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[2] = "hide"
			} else {
				loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[2] = "show"
			}
		}
		if (action === "delete" && group_id === id) {
			loaded_qmv.quomediaviewdb[2].qmv_tags.splice(i,1)
			break;
		}
		if (grouportag === "tag") {
			var group_tags_length = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags.length
			if (group_tags_length === 0) {
				group_tags_length += 1
			}
			for (var j = 0; j < group_tags_length; j++) {
				if (action !== "create" && action !== "quickcreate") {
					var tag_id = Object.keys(loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j])[0]
				}
				if (action === "create" || action === "quickcreate") {
					if (id === group_id) {
						var lettercount = loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[3].split("_")
						var new_tag_id = lettercount[0] + (lettercount[1] * 1 + 1)
						loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][0].settings[3] = lettercount[0] + "_" + (lettercount[1] * 1 + 1)
						var new_tag_name = ""
						if (action === "quickcreate") {
							new_tag_name = document.getElementById(id + "_qc").value.replaceAll(" ","_")
						}
						var new_tag_string = '{"' + new_tag_id  + '":[0,"' + new_tag_name + '"]}'
						var new_tag_object = JSON.parse(new_tag_string)
						loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags.push(new_tag_object)
						break;
					}
				}
				if (action === "name" && tag_id === id) {
					loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][1] = document.getElementById(id + "_tn").value.replaceAll(" ","_")
				}
				if (action === "count_plus" && tag_id === id) {
					loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][0] += 1
				}
				if (action === "count_minus" && tag_id === id) {
					loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][0] -= 1
				}
				if (action === "description" && tag_id === id) {
					if (document.getElementById(id + "_td").value === "") {
						loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id].splice(2,1)
					} else {
						loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags[j][tag_id][2] = document.getElementById(id + "_td").value
					}
				}
				if (action === "delete" && tag_id === id) {
					loaded_qmv.quomediaviewdb[2].qmv_tags[i][group_id][1].tags.splice(j,1)
					break;
				}
			}
		}
	}
	warn_changes_made()
	render_tags("")
}
