
//TODO: Get the options from the storage and return the results to content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.data === "getTabs"){
	var tabs = {};
		chrome.tabs.query({}, function(t) {
				for (var i = 0; i < t.length; i++) {
					var temp = t[i].url;
					var fin = temp.replace(/.*?:\/\//g, "");
					if(fin.indexOf('#') != -1) {
						fin = fin.substr(0, fin.indexOf('#'));
					}
					/*if(fin.indexOf('?') != -1) {
						fin = fin.substr(0, fin.indexOf('?'));
					}*/
					if(fin.substr(-1) == '/') {
						fin = fin.substr(0, fin.length - 1);
					}
					tabs[fin] = 1;
				}
				sendResponse({data: tabs});
			}
		);
		return true;
	}
  });

  

