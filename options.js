// Saves options to chrome.storage
function save_options() {
	var inputColor = document.getElementById('color').value;
	var radio = document.querySelector('input[name="highlight-type"]:checked').value;
	var debug = document.getElementById('debug').checked;
	chrome.storage.sync.set({
		color: inputColor,
		selector: radio,
		debugOption: debug
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get({
		color: '8AFFFB',
		selector: "background",
		debugOption: false
	}, function(items) {
			if(items.selector == "link") {
				document.getElementById("link").checked = true;
			}
			else {
				document.getElementById("background").checked = true;
			}
			document.getElementById('color').value = items.color;
			document.getElementById('debug').checked = items.debugOption;
		});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
