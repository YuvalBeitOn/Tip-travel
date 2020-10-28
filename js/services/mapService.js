import { mapUtils } from './utils.js'

export const mapService = {
    getLocs,
    createPlaces,
    createPlace,
    addPlace
}

const STORAGE_KEY_PLACES = 'placesDB'
var locs = [{ lat: 11.22, lng: 22.11 }]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function createPlaces() {
    var places = loadFromStorage(STORAGE_KEY_PLACES);
    if (places) gPlaces = places;
    else gPlaces = [];
}

function createPlace(location, name) {
    return {
        id: mapUtils.makeId(),
        name,
        lat: location.lat,
        lng: location.lng,
        weather: '',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
}

function addPlace(location, placeName) {
    gPlaces.push(createPlace(location, placeName));
    saveToStorage(STORAGE_KEY_PLACES, gPlaces);

}