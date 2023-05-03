export const locService = {
    getLocs,
    saveLoc,
    removeLoc,
}
import { storageService } from './async-storage.service.js'

const LOCS_DATA_KEY = 'locsDB'

const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(storageService.query(LOCS_DATA_KEY))
        }, 2000)
    })
}

// handle remove location button
function removeLoc(locId){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(storageService.remove(LOCS_DATA_KEY, locId))
        }, 2000);
    })
}


function saveLoc(loc) {
    console.log('loc', loc)

    // locs.push(loc)

    storageService.post(LOCS_DATA_KEY, loc)

}

