import { mapUtils } from './utils.js'
import { mapStorage } from './localStorage.js'

export const mapService = {
    getLocs,
    addPlace,
    createPlaces,
    createPlace,
    getLocations,
    deletePlace,
    getPlaceIdxById,
    getPlaceById
}

const STORAGE_KEY_PLACES = 'placesDB'
var locs = [{ lat: 11.22, lng: 22.11 }]
var gPlaces = [];

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function createPlaces() {
    var places = mapStorage.loadFromStorage(STORAGE_KEY_PLACES);
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
    mapStorage.saveToStorage(STORAGE_KEY_PLACES, gPlaces);

}

function deletePlace(placeId) {
    var placeIdx = getPlaceIdxById(placeId);
    gPlaces.splice(placeIdx, 1)
    mapStorage.saveToStorage(STORAGE_KEY_PLACES, gPlaces)
}

function getPlaceById(placeId) {
    const place = gPlaces.find(place => {
        return placeId === place.id;
    });
    return place;
}

function getPlaceIdxById(placeId) {
    const placeIdx = gPlaces.findIndex(place => {
        return placeId === place.id;
    });
    return placeIdx;
}

function getLocations() {
    var places = mapStorage.loadFromStorage(STORAGE_KEY_PLACES)
    return places;
}