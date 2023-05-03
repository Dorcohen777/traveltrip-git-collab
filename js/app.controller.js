import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'


window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onMapClick = onMapClick
window.onGoClick = onGoClick
window.onDeleteClick = onDeleteClick
window.onSearch = onSearch
window.renderWeather = renderWeather

function onInit() {
    onInitMap()
    renderLocations()
}

function onInitMap(lat = 32.0749831, lng = 34.9120554) {
    mapService.initMap(lat, lng)
        .then(map => {
            console.log('Map is ready')
            addEventListener(map)

        })
        .catch(() => console.log('Error: cannot init map'))
    // .then(render)
}

function renderWeather(lat, lng) {
    var weatherStr = ''
    
    mapService.getWeather(lat, lng)
        .then((data) => {
            console.log('data', data)
            weatherStr += `
            <div>
                <h2> ${data.temp} °C</h2>
            </div>
            `
        const elDivTemp = document.querySelector('.div-temp')
        elDivTemp.innerHTML = weatherStr
        })
        .catch((err) => {
            console.log('err', err)
        })
}

function addEventListener(map) {
    map.addListener("click", (mapsMouseEvent) => {
        const placeName = prompt('Enter Place Name')
        const lat = mapsMouseEvent.latLng.lat()
        const lng = mapsMouseEvent.latLng.lng()
        console.log('lat', lat)
        console.log('lng', lng)
        console.log('placeName', placeName)
        locService.saveLoc({ placeName, lat, lng })
        renderWeather(lat, lng)
        renderLocations()
    })
}

function onSearch() {
    const value = document.querySelector('.input-search').value
    console.log('value', value)
    if (!value) return

    mapService.getInputPos(value)
        .then((pos) => onInitMap(pos.lat, pos.lng))
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            onInitMap(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}

function onMapClick() {
    const map = document.getElementById('map')
    console.log('map', map)
}




function renderLocations() {
    var strLocation = ''

    const locs = locService.getLocs()
        .then((locations) => {
            const elLocs = document.querySelector('.locs')

            if (locations.length < 1) elLocs.innerHTML = ''

            return locations.map((location) => {
                console.log('location from MAP', location)
                strLocation += `
                    <div class="location">
                        <h3> ${location.placeName}</h3>
                        <button onclick="onGoClick(${location.lat}, ${location.lng})"> Go </button>
                        <button onclick="onDeleteClick('${location.id}')"> Delete </button>
                    </div>
                `
                elLocs.innerHTML = strLocation
            })
            // console.log('locations form control', location)
        })
}

function onGoClick(lat, lng) {
    onInitMap(lat, lng)
}

function onDeleteClick(locationId) {
    locService.removeLoc(locationId)
        .then(() => renderLocations())

}