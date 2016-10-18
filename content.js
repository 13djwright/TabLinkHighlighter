var pageLoadTimer = setInterval (pageLoadFinished, 500); //used to update the page continuously
var backgroundColor = "8AFFB";
var selector = "background";
var debug;
var links;
function pageLoadFinished(){
    //page not loaded if no links
    if(links.length > 0) {
        //get the options from storage
        chrome.storage.sync.get(function(items){
            if(items.selector != undefined) {
                selector = items.selector;
            }
            if( items.color != undefined) {
                backgroundColor = items.color;
            }
            debug = items.debugOption;
        });

        //get all open tabs and process results
        chrome.runtime.sendMessage({data: "getTabs"}, function(response) {
            if(debug) {
                console.log("Scanning page and comparing open tabs.");
            }
            var tabs = response.data;
            //make sure there are tabs
            if(!tabs) {
                if(debug) {
                    console.log("Error: No tabs found.");
                }
            }
            else {
                //TODO: change the process of getting links to be more customizable
                links = document.querySelectorAll("div > h3 > a");
                if(links.length == 0) {
                    if(debug) {
                        console.log('Error: querySelectorAll returned 0 results.');
                    }
                }
                //get the links, and data-href's (these come from opening a link in a new tab (the href changes to a weird google search)
                for(var i = 0; i < links.length; i++) {

                    var link = links[i].href.replace(/.*?:\/\//g, "");
                    //links with a # symbol usually points to a different section on the same page
                    if(link.indexOf('#') != -1) {
                        link = link.substr(0, link.indexOf('#'));
                    }

                    //the href in an anchor is obfuscated sometimes and there might be a non-obfuscated href in the data tag
                    var data_href = links[i].getAttribute("data-href");
                    if(data_href) {
                        data_href = data_href.replace(/.*?:\/\//g, "");
                        if(data_href.indexOf('#') != -1) {
                            data_href = data_href.substr(0, data_href.indexOf('#'));
                        }
                        if(data_href.substr(-1) == '/') {
                            data_href = data_href.substr(0, data_href.length - 1);
                        }
                    }
                    
                    if(link.substr(-1) == '/') {
                        link = link.substr(0, link.length - 1);
                    }

                    if(debug) {
                        console.log("Found link: ", link);
                    }

                    var real_href = links[i]; //save actual anchor tag to change style to
                    if(link) {
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
                        //FIXME: What if real_href exists and has a background/color but is not open in another tab
                        //reset back if tab is closed
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
            }
        });
    }
    else {
        if(debug) {
            console.log("page not loaded, please wait.");
        }
    }
}
