/*
  Smart WebView 7.0

  MIT License (https://opensource.org/licenses/MIT)

  Smart WebView is an Open Source project that integrates native features into
  WebView to help create advanced hybrid applications (https://github.com/mgks/Android-SmartWebView).

  Explore plugins and enhanced capabilities: (https://mgks.dev/app/smart-webview-documentation#plugins)
  Join the discussion: (https://github.com/mgks/Android-SmartWebView/discussions)
  Support Smart WebView: (https://github.com/sponsors/mgks)

  Your support and acknowledgment of the project's source are greatly appreciated.
  Giving credit to developers encourages them to create better projects.
*/

document.addEventListener('DOMContentLoaded', function() { // use DOMContentLoaded

    const input = document.getElementById('add-img');
    const gallery = document.querySelector('.gallery');
	const urlParams = new URLSearchParams(window.location.search);
	const locParam = urlParams.get('loc');
    const MAX_WIDTH = 240;

    input.addEventListener('change', function() {
        gallery.innerHTML = ''; // clear previous previews

        for (const file of Array.from(this.files)) {
            const reader = new FileReader();

            reader.addEventListener('load', function () {
                const img = document.createElement('img');
                img.src = this.result;

                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_WIDTH) {
                            width *= MAX_WIDTH / height;
                            height = MAX_WIDTH;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    gallery.appendChild(canvas);
                }
            });
            reader.readAsDataURL(file);
        }
    });
});

// cookies handling function
function get_cookies(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
}

function get_location() {
	console.log(window.location);

	let latitude = null;
	let longitude = null;

	// first, try getting location from cookies (online case)
	const latCookie = get_cookies('lat');
	const longCookie = get_cookies('long');

	if (latCookie && longCookie) {  // check if cookies exist and are defined
		latitude = parseFloat(latCookie);
		longitude = parseFloat(longCookie);
	} else {
		// second, if cookies not available (offline), try URL parameters
		const urlParams = new URLSearchParams(window.location.search);
		const locParam = urlParams.get('loc');
		if (locParam) {
			const loc = locParam.split(',');
			if (loc.length === 2) {
				latitude = parseFloat(loc[0]);
				longitude = parseFloat(loc[1]);
			} else {
				console.error("SWVJS Invalid 'loc' parameter format");
			}
		}
	}

	if (latitude !== null && longitude !== null) {
		const locationDiv = document.createElement('div');
		locationDiv.className = 'fetch-loc';
		locationDiv.innerHTML = "<br><b>Latitude: "+latitude+"<br>Longitude: "+longitude+"</b>";
		const locElement = document.querySelector('.fetch-loc');

		if(locElement) { // ensure the element exists. If not create new
			locElement.replaceWith(locationDiv);
		} else {
			document.body.appendChild(locationDiv); // or wherever you want it
		}
	}
}

function print_page(){
	window.print();
}
