export const mapService = {
    initMap,
    addMarker,
    panTo,
    getInputPos,
    getWeather,
}

const API_KEY = 'AIzaSyDTBlLlarVlkY3cj0CzbExexK_8GLZvoFc'
const API_KEY_WEATHER = 'f594a60010cb732310a540b945bb6852'

// Var that is used throughout this Module (not global)
let gMap
// let gInfoWindow

function initMap(lat, lng) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            return gMap

        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getWeather(lat, lng){
    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY_WEATHER}`)
        .then((res) => res.data.main)
}


function getInputPos(searchVal) {
    return axios.get(_getUrl(searchVal))
        .then((res) =>res.data.results[0].geometry.location)
}

function _getUrl(searchVal) {
    return `https://maps.googleapis.com/maps/api/geocode/json?address=${searchVal}&key=${API_KEY}`
    // return `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${API_KEY}`
}