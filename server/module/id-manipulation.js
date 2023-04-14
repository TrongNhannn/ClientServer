const { mongo, asyncMongo } = require('../Connect/conect');
const tables  = require('../mongo/tables');

const getAndUpdateCurrentID = async ( field_alias ) => {
    let current = 0;
    const dbo = await asyncMongo();

    const id = await new Promise((resolve, reject) => {
        dbo.collection(`auto_increment`).findOne({ field_alias }, (err, result) => {
            if( result ){
                current = result.current;
                dbo.collection(`auto_increment`).updateOne({ field_alias }, { $set: { current: current + 1 } }, (err, result) => {
                    resolve(current)
                })
            }
            else{
                dbo.collection(`auto_increment`).insertOne({ field_alias, current: 1 }, (err, result) => {
                    resolve(current)
                })
            }
        })
    })
    return id;
}

const getCurrentID = async ( field_alias ) => {
    const dbo = await asyncMongo();

    const id = await new Promise((resolve, reject) => {
        dbo.collection(`auto_increment`).findOne({ field_alias }, (err, result) => {
            resolve( result ? result.current : 0 )
        })
    })
    return id;
}

const makePattern = ( number, pattern ) => {
    let result = pattern;
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    result = result.replaceAll("[DD]", date);
    result = result.replaceAll("[MM]", month);
    result = result.replaceAll("[YYYY]", year);
    const numberPlaces = [];
    for (let i = 0; i < result.length; i++) {
        if (result[i] === '[') {
            var temp = ""
            for (let j = i + 1; j < result.length; j++) {
                if (result[j] === 'N' && result[j] !== ']') {
                    temp += result[j];
                } else {
                    if (result[j] === ']') {
                        numberPlaces.push(temp);
                        i = j;
                        temp = ""
                    }
                }
            }
        }
    }
    const places = numberPlaces.map(place => {
        const placeLength = place.length;
        numberLength = number.toString().length;
        let header = "";
        for (let i = 0; i < placeLength; i++) {
            header += "0";
        }
        const result = header.slice(0, placeLength - numberLength) + number.toString();
        return { place, value: result };
    })
    for (let i = 0; i < places.length; i++) {
        const { place, value } = places[i];
        result = result.replace(`[${place}]`, value)
    }
    return result;
}

module.exports = {
    getAndUpdateCurrentID,
    getCurrentID,
    makePattern
}