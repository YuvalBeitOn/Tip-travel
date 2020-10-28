import { mapService } from './services/mapService.js'

var gMap;
var gLat = 32.0853;
var gLng = 34.7818;
const API = 'AIzaSyCmhCBEHJkdIG3m11Ua7ZsKbz3u9nMJBuI';

mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

// document.querySelector('.search-loc').addEventListener('click', onSearchPlace)

// function onSearchPlace() {
//     var splitInput = document.querySelector('.search-loc').value.split(',');
//     splitInput.join('+');
//     console.log(splitInput);
//     window.open(`https://maps.googleapis.com/maps/api/geocode/json?address=${splitInput}&key=${API}`);
// }


document.querySelector('.curr-location-btn').addEventListener('click', () => {
    getPosition()
        .then(pos => {
            panTo(pos.coords.latitude, pos.coords.longitude);
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
})

document.querySelector('.copy-btn').addEventListener('click', copyToClipboard)


function copyToClipboard() {
    const el = document.createElement('textarea');
    el.value = createUrl();
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

}

export function initMap(lat = 32.0853, lng = 34.7818) {
    renderLocations();
    return _connectGoogleApi()
        .then(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const latSearch = +urlParams.get('lat');
            const lngSearch = +urlParams.get('lng');

            if (latSearch && lngSearch) {
                lat = latSearch;
                lng = lngSearch;
            }
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            google.maps.event.addListener(gMap, "click", (event) => {
                var location = { lat: event.latLng.lat(), lng: event.latLng.lng() }
                gLat = location.lat;
                gLng = location.lng;
                var placeName = prompt('Enter place Name');
                if (!placeName) return;
                // addMarker(location, map);
                mapService.addPlace(location, placeName);
                renderLocations();
            });
        })
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCmhCBEHJkdIG3m11Ua7ZsKbz3u9nMJBuI'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function renderLocations() {
    var places = mapService.getLocations();
    var strHtml = places.map(place => `
        <li class="place flex space-between align-center">${place.name}
        <div class="btns-container">
        <button data-id="${place.id}" class="delete-btn">delete</button>
        <button data-id="${place.id}" class="go-btn">go</button>
        </div>
        </li>
    `).join('');

    document.querySelector('.locations-list').innerHTML = strHtml;

    document.querySelectorAll('.delete-btn').forEach(elBtn => {
        elBtn.addEventListener('click', () => {
            onDeletePlace(elBtn.dataset.id);
        })
    });

    document.querySelectorAll('.go-btn').forEach(elBtn => {
        elBtn.addEventListener('click', () => {
            var place = mapService.getPlaceById(elBtn.dataset.id);
            panTo(place.lat, place.lng);
        })
    });

}

function onDeletePlace(placeId) {
    mapService.deletePlace(placeId);
    renderLocations();
}

function createUrl() {
    return `https://yuvalbeiton.github.io/Travel-Tip/index.html?lat=${gLat}&lng=${gLng}`
}