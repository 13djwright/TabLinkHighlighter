var pageLoadTimer = setInterval (pageLoadFinished, 500); //used to update the page continuously
var backgroundColor;
var selector;
var debug;
function pageLoadFinished(){
	var links = document.querySelectorAll("div > h3 > a"); //get all the google search results
	//if we didn't get any, then the page was not loaded completely.
	if(links.length > 0) {
		//clearInterval(pageLoadTimer); dont clear so that it runs constantly making it "dynamic"
		//get the options from storage
		chrome.storage.sync.get(function(items){
			if(items.selector != undefined) {
				selector = items.selector;
			}
			else {
				selector = "background";
			}
			if( items.color != undefined) {
				backgroundColor = items.color;
			}
			else {
				backgroundColor = "8AFFFB";
			}
			debug = items.debugOption;
		});
		
		//here we need to get all the tabs currently open, and use the call back to check the links on the page
		chrome.runtime.sendMessage({data: "getTabs"}, function(response) {
			if(debug) {
				console.log("Scanning page and comparing open tabs.");
			}
			var tabs = response.data;
			//make sure there are tabs
			if(!tabs) {
				if(debug) {
					console.log("No Tabs could be found!! Most likely an error.");
				}
			}
			else {
				//get the links again, just to make sure
				links = document.querySelectorAll("h3 > a");
				if(links.length == 0) {
					if(debug) {
						console.log('query found nothing.');
					}
				}
				//get the links, and data-href's (these come from opening a link in a new tab (the href changes to a weird google search)
				for(var i = 0; i < links.length; i++) {
					var link = links[i].href.replace(/.*?:\/\//g, "");
					if(link.indexOf('#') != -1) {
						link = link.substr(0, link.indexOf('#'));
					}
					/*if(link.indexOf('?') != -1) {
						link = link.substr(0, link.indexOf('?'));
					}*/
					var data_href = links[i].getAttribute("data-href");
					//if there was a data-href, get rid of stuff
					if(data_href) {
						data_href = data_href.replace(/.*?:\/\//g, "");
						if(data_href.indexOf('#') != -1) {
							data_href = data_href.substr(0, data_href.indexOf('#'));
						}
						/*if(data_href.indexOf('?') != -1) {
							data_href = data_href.substr(0, data_href.indexOf('?'));
						}*/
						if(data_href.substr(-1) == '/') {
							data_href = data_href.substr(0, data_href.length - 1);
						}
					}
					if(link.substr(-1) == '/') {
						link = link.substr(0, link.length - 1);
					}
					if(debug) {
						console.log("found link: ", link);
					}
					var real_href = links[i]; //this is the actual anchor tag we can change based on comparing
					if(link) {
						//FIXED: Change this so it looks up in a hash rather than two for loops for efficiency
						//See if the link either the link or the data-href in the tabs hash
						if(tabs[link] == 1 || tabs[data_href] == 1) {
							if(selector == "background") {
								real_href.style.background = "#" + backgroundColor;
								real_href.style.color = "";
							}
							else {
								real_href.style.color = "#" + backgroundColor;
								real_href.style.background = "none";
							}
						}
						//the else is used in case a tab is closed, and the background has already been changed.
						else {
							if(selector == "background") {
								real_href.style.background = "none";
							}
							else {
								real_href.style.color = "";
							}
						}
					}
				}
				//console.log("End comparing.");
			}
		});
	}
	else {
		if(debug) {
			console.log("page not loaded, please wait.");
		}
	}
}