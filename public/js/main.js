var thePageWrapper = document.getElementById("page");
var theSideBar = document.getElementById("sidebar");
var bodywrapper = document.getElementById("bodywrapper");
var thesidebarCollapsebtn = document.getElementById("sidebarCollapse");
var navSearchForm = document.getElementById("navSearchForm");
var navBarElement = document.getElementById("navbar");
var navbarnavlinks = document.getElementsByClassName("theme-item");
var mainFrame = document.getElementById("mainframe");
var tk, refresh;
try {
	tk = atob(sessionStorage.getItem('session'))
	refresh = atob(sessionStorage.getItem('refresh'))
	if (tk != undefined) {
		var uris = JSON.parse(atob(sessionStorage.getItem('lkto')))//JSON.parse(atob(getCookie("lkto")));
		let nowTime = Math.floor(Date.now() / 1000);
		let tokenTime = jwt_decode(tk)
		let username = tokenTime.preferred_username
		tokenTime = tokenTime.exp
		if (nowTime > tokenTime) {
			sessionStorage.setItem('session', '')
			window.location.href = `/index.html`
		}
		document.getElementById('username').innerHTML = username
	}
} catch (err) {
	window.location.href = `/index.html`
}
window.setInterval(refreshToken, 1000 * 60 * 4)
function gethtml(title, url) {
	let tmp = '';
	if (title != 'IRO') {
		tmp = `<i class="data-feather" id="list${title}" data-feather="eye-off"></i>`
	}
	return `<div class="row" id="${title}">
				<div class="col-md-12">
					<div class="card">
						<div class="content">
							<div>
								<h5>
								`+ tmp + ` ${title}
								</h5>
							</div>
							<div class="card">
								<iframe id="iframe_${title}" src="${url + '?session=' + tk}" height="600"
									scrolling="yes"></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>`
}

function togglePartner(title, myurl, theframe) {
	if (theframe.innerHTML.indexOf(title) !== -1) {
		scrollToTopFunction()
		document.getElementById(title).remove();

	} else {
		if (title != 'IRO') theframe.insertAdjacentHTML('beforeend', gethtml(title, myurl));
		else theframe.insertAdjacentHTML('afterbegin', gethtml(title, myurl));
		feather.replace();
		if (title != 'IRO') document.getElementById(`list${title}`).addEventListener("click", function () {
			togglePartner(title, myurl, mainFrame)
		});


	}
}

function logout() {
	sessionStorage.clear()
	window.location.href = "/index.html"
}

for (el of uris) {
	document.getElementById('adduris').insertAdjacentHTML('beforeend', `<li class="${el.name}"><a class="dropdown-item" href="#${el.name}"> ${el.name} </a></li>`);
	document.getElementById('adduriside').insertAdjacentHTML('beforeend', `<li class="${el.name}" ><a href="#${el.name}"><i class="data-feather theme-item" data-feather="tool"></i> <span class="theme-item"> ${el.name} </span></a></li>`)
	let class1 = document.getElementsByClassName(`${el.name}`)
	let title = `${el.name}`
	let myurl = `${el.uri}` // ?session=${tk} Here there's a token appended to the url

	for (var i = 0; i < class1.length; i++) {
		if (el.name == 'TIM RAE') {
			class1[i].addEventListener("click", function () {
				window.open(myurl, '_blank').focus();
			});
		} else {
			class1[i].addEventListener("click", function () {
				togglePartner(title, myurl, mainFrame)
			});
		}
	}
	if (el.tool === 1 && el.name != 'TIM RAE') togglePartner(title, myurl, mainFrame)
}

if (el.name != 'TIM RAE') document.getElementById('adduriside').insertAdjacentHTML('beforeend', `
<li class="lktres"><a href="#${el.name}"><i class="data-feather theme-item" data-feather="trash"></i> <span
								class="theme-item"> Clear </span></a></li>`);


let class1 = document.getElementsByClassName("lktres")
for (var i = 0; i < class1.length; i++) {
	class1[i].addEventListener("click", function () {
		mainFrame.innerHTML = "";
		let iro = uris.filter(obj => { return obj.tool === 1 })[0]
		console.log(iro)
		togglePartner(iro.name, iro.uri, mainFrame)
	});
}

document.getElementById("radioCompactView").addEventListener("click", function () {
	//alert('yoyo1');
	theSideBar.style.display = "none";
	thePageWrapper.classList.add("container");
	bodywrapper.classList.remove("container-fluid");
	bodywrapper.classList.add("container");
	navBarElement.classList.add("container");
	thesidebarCollapsebtn.style.display = "none";
	setVisible('.navbrandarea1', true);
	setVisible('.navbrandarea2', true);
	setCookie("compactView", "true", 1);
});

document.getElementById("radioFullView").addEventListener("click", function () {
	//alert('yoyo2');
	thePageWrapper.classList.remove("container");
	bodywrapper.classList.remove("container");
	bodywrapper.classList.add("container-fluid");
	navBarElement.classList.remove("container");
	thesidebarCollapsebtn.style.display = "block";
	theSideBar.style.display = "block";
	removeViewSizeCookie();
});

checkCookie();

thesidebarCollapsebtn.addEventListener("click", pinSideBar);

function pinSideBar() {
	if (theSideBar.classList.contains("active")) {
		theSideBar.classList.toggle('active');
		setVisible('.navbrandarea1', false);
		setVisible('.navbrandarea2', false);
		setCookie("sidebarUnpinned", "true", 1);
	} else {
		theSideBar.classList.toggle('active');
		setVisible('.navbrandarea1', true);
		setVisible('.navbrandarea2', true);
		//theSideBar.classList.remove('active');
		//theSideBar.style.display = "none";
		removeCookieSidebar();
	}
}

function refreshToken() {
	let query_body = {
		"token": atob(sessionStorage.getItem('session')),
		"refresh": atob(sessionStorage.getItem('refresh'))
	}
	fetch('/api/refresh', {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(query_body)
	})
		.then((response) => {
			if (response.status === 201) {
				response.json().then((data) => {
					sessionStorage.setItem('session', (btoa(data.token)))
					sessionStorage.setItem('refresh', (btoa(data.refresh)))
					let oldtoken = tk;
					tk = data.token;
					refresh = data.refresh;
					for (el of uris) {
						el.uri = el.uri.replace(oldtoken, tk)
					}
					let url = new URL(window.location.href);
					let search_params = url.searchParams;
					search_params.set('session', tk);
					url.search = search_params.toString();
					window.history.replaceState(null, document.title, url.toString())
				})
					.catch((error) => {
						//handle error TODO: handle this
						alert(error)
					});
			} else {
				response.json().then((error) => {
					alert(error.msg)
				})
					.catch((error) => {
						//handle error TODO: handle this
						alert(error)
					});
			}
		})
}

function checkCookie() {
	var sidebarUnpinned = getCookie("sidebarUnpinned");
	var colornumber = getCookie("colornumber");
	var theSideBar = document.getElementById("sidebar");
	if (sidebarUnpinned != null) {
		theSideBar.classList.toggle('active');
		setVisible('.navbrandarea1', false);
		setVisible('.navbrandarea2', false);
	}

	if (colornumber === '0') {
		theSideBar.style.background = getSpecificColor('0');
		navBarElement.style.background = getSpecificColor('0');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
	}
	if (colornumber === '1') {
		theSideBar.style.background = getSpecificColor('1');
		navBarElement.style.background = getSpecificColor('1');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
	}
	if (colornumber === '2') {
		theSideBar.style.background = getSpecificColor('2');
		navBarElement.style.background = getSpecificColor('2');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
	}
	if (colornumber === '3') {
		theSideBar.style.background = getSpecificColor('3');
		navBarElement.style.background = getSpecificColor('3');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
	}
	if (colornumber === '4') {
		theSideBar.style.background = getSpecificColor('4');
		navBarElement.style.background = getSpecificColor('4');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#767676';
		}
	}



	var compactView = getCookie("compactView");

	if (compactView != null) {
		bodywrapper.classList.remove("container-fluid");
		bodywrapper.classList.add("container");
		navBarElement.classList.remove("container-fluid");
		navBarElement.classList.add("container");
		thesidebarCollapsebtn.style.display = "none";
		theSideBar.style.display = "none";
		setVisible('.navbrandarea1', true);
		setVisible('.navbrandarea2', true);
	} else {
		bodywrapper.classList.remove("container");
		bodywrapper.classList.add("container-fluid");
		navBarElement.classList.remove("container");
		navBarElement.classList.add("container-fluid");
		thesidebarCollapsebtn.style.display = "block";
		theSideBar.style.display = "block";
	}



}

function setCookie(name, value, daysToLive) {
	var cookie = name + "=" + encodeURIComponent(value);
	cookie += ";SameSite=None; Secure; max-age=" + (1 * 24 * 60 * 60);
	document.cookie = cookie;
}

function removeCookieSidebar() {
	document.cookie = "sidebarUnpinned=; expires=Thu, 01 Jan 1900 00:00:00 UTC;";
}

function removeColorCookie() {
	document.cookie = "colornumber=; expires=Thu, 01 Jan 1900 00:00:00 UTC;";
}
function removeViewSizeCookie() {
	document.cookie = "compactView=; expires=Thu, 01 Jan 1900 00:00:00 UTC;";
}

function getCookie(cookieName) {
	var cookieArr = document.cookie.split(";");
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split("=");
		if (cookieName == cookiePair[0].trim()) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
	return null;
}


scrollToTop = document.getElementById("scrollToTop");
window.onscroll = function () { scrollFunction() };
function scrollFunction() {
	if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
		scrollToTop.style.display = "block";
	} else {
		scrollToTop.style.display = "none";
	}
}


function scrollToTopFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0;
}

function onReady(callback) {
	var intervalId = window.setInterval(function () {
		if (document.getElementsByTagName('body')[0] !== undefined) {
			window.clearInterval(intervalId);
			callback.call(this);
		}
	}, 500);
}

function setVisible(selector, visible) {
	document.querySelector(selector).style.display = visible ? 'block'
		: 'none';
}

onReady(function () {
	setVisible('#page', true);
	setVisible('#loading', false);
});


function getSpecificColor(colornumber) {
	var linearbackgrounds = [
		'linear-gradient(315deg, #0abcf9 0%, #2c69d1 74%)',

		'linear-gradient(90deg, rgba(2, 0, 36, 1) 0%,rgba(4, 80, 130, 1) 0%, rgba(6, 26, 005, 1) 0%, rgba(0, 212, 255, 1)100%, rgba(2, 0, 36, 1) 100%, rgba(2, 0, 36, 1) 100%)',

		'linear-gradient(147deg, #f71735 0%, #db3445 74%)',

		'linear-gradient(316deg, #f94327 0%, #ff7d14 74%)',
		'#ffff'];

	if (colornumber === '0') {
		return linearbackgrounds[0];
	}
	if (colornumber === '1') {
		return linearbackgrounds[1];
	}

	if (colornumber === '2') {
		return linearbackgrounds[2];
	}

	if (colornumber === '3') {
		return linearbackgrounds[3];
	}
	if (colornumber === '4') {
		return linearbackgrounds[4];
	}

}

function changeColor(colornumber) {
	if (colornumber === '0') {
		theSideBar.style.background = getSpecificColor('0');
		navBarElement.style.background = getSpecificColor('0');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
		setCookie("colornumber", "0", 1);
	}
	if (colornumber === '1') {
		theSideBar.style.background = getSpecificColor('1');
		navBarElement.style.background = getSpecificColor('1');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
		setCookie("colornumber", "1", 1);
	}
	if (colornumber === '2') {
		theSideBar.style.background = getSpecificColor('2');
		navBarElement.style.background = getSpecificColor('2');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
		setCookie("colornumber", "2", 1);
	}
	if (colornumber === '3') {
		theSideBar.style.background = getSpecificColor('3');
		navBarElement.style.background = getSpecificColor('3');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#ffff';
		}
		setCookie("colornumber", "3", 1);
	}
	if (colornumber === '4') {
		theSideBar.style.background = getSpecificColor('4');
		navBarElement.style.background = getSpecificColor('4');
		for (var i = 0, length = navbarnavlinks.length; i < length; i++) {
			navbarnavlinks[i].style.color = '#AAAAAA';
		}
		document.querySelector(".navbrandarea2").style.color = '#008000';
		document.querySelector(".sidebar-title").style.color = '#008000';
		setCookie("colornumber", "4", 1);
	}
}

changeColor('colornumber');


var dropdown = document.getElementsByClassName("sidebar-dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
	dropdown[i].addEventListener("click", function () {
		this.classList.toggle("active");
		var dropdownContent = this.nextElementSibling;
		if (dropdownContent.style.display === "block") {
			dropdownContent.style.display = "none";
		} else {
			dropdownContent.style.display = "block";
		}
	});
}

function myFunction() {
	var element = document.getElementById("sidenavicon");
	element.classList.toggle("sidenaviconopen");
}

function openOverlayNav() {
	document.getElementById("sidebarOverlayNav").style.width = "100%";
}

function closeOverlayNav() {
	document.getElementById("sidebarOverlayNav").style.width = "0%";
}

