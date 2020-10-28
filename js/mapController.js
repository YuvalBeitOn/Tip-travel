import { mapService } from './services/mapService.js'

var gMap;
console.log('Main!');


// document.querySelector('.search-form').addEventListener('submit', onSearchLoc)

// function onSearchLoc() {

// }


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

document.querySelector('.curr-location-btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    getPosition()
        .then(pos => {
            panTo(pos.coords.latitude, pos.coords.longitude);
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
})


export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            google.maps.event.addListener(gMap, "click", (event) => {
                console.log('map clicked')
                var location = { lat: event.latLng.lat(), lng: event.latLng.lng() }
                var placeName = prompt('Enter place Name');
                if (!placeName) return;
                // addMarker(location, map);
                mapService.addPlace(location, placeName);
                renderLocations();
            });
        })
}

function getPosition() {
    console.log('Getting Pos');

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
        <li>${place.name}
        <div class="btns-container">
        <button data-id="${place.id}" class="delete-btn">delete</button>
        <button data-id="${place.id}" class="go-btn">go</button>
        </div>
        </li>
    `).join('');

    document.querySelector('.locations-list').innerHTML = strHtml;

    document.querySelectorAll('.delete-btn').forEach(elBtn => {
        console.log(elBtn)
        elBtn.addEventListener('click', () => {
            onDeletePlace(elBtn.dataset.id);
        })
    });

    document.querySelectorAll('.go-btn').forEach(elBtn => {
        console.log(elBtn)
        elBtn.addEventListener('click', () => {
            var place = mapService.getPlaceById(elBtn.dataset.id);
            panTo(place.lat, place.lng);
        })
    });

}

function onDeletePlace(placeId) {
    console.log('deleting');
    mapService.deletePlace(placeId);
    renderLocations();
}