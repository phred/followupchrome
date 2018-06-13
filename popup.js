(function() {
	// Error handling
	var error = document.getElementById('errorarea');
	var showError = function(msg) {
		error.innerText = msg;
		setTimeout(function() {
			error.innerText = '';
		}, 4000);
	}

	// Presets
	var addy = document.getElementById('addy');
	var presets = {
		'near': {
			'Tonight': '915pm',
			'Tomorrow': 'tomorrow'
		},
		'week1': {
			'+1w': '1w',
			'Saturday': 'saturday',
			'Monday': 'monday',
		},
		'week2': {
			'+1m': '+1month',
			'+3m': '+3months',
		}
	}
	var presetarea = document.getElementById('presetarea');
	var generatePresetButton = function(name, action) {
		if(typeof(action) == "string") {
			action = function() {
				return this;
			}.bind(action);
		}
		var button = document.createElement('button');
		button.textContent = name;
		button.addEventListener('click', function() {
			addy.value = action();
		});
		return button;
	}
	for(var preset in presets) {
		var container = document.createElement('div');
		var subpresets = presets[preset];
		if (typeof(presets[preset]) == "string") {
			container = presetarea
			subpresets = {};
			subpresets[preset] = presets[preset];
		}
		for(var subpreset in subpresets) {
			container.appendChild(generatePresetButton(subpreset, subpresets[subpreset]));
		}
		presetarea.appendChild(container);
	}

	// Send button
	var send = document.getElementById('send');
	send.addEventListener('click', function() {
		chrome.tabs.query({
			"active": true,
			"currentWindow": true
		}, function(tab) {
			if(tab == undefined || tab == null || tab.length == 0) {
				showError('Could not get active tab');
				return;
			}
			tab = tab[0];
			var subject = encodeURIComponent(tab.title);
			var body = encodeURIComponent(tab.url);
			chrome.tabs.create({
				'url': 'mailto:'+addy.value+'@followupthen.com?subject='+subject+'&body='+body,
				'active': true
			});
		});
	});
})()
