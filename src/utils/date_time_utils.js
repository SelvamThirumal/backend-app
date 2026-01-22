import moment from "moment";


function calculateAge_YYYY_MM_DD(dob) {
    return moment().diff(dob, 'years')
}

function getDate_YYYY_MM_DD(date) {
    return new Date(date)
}

function getTodayDate(){
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    return today
}

function  getTodayByDate(date) {
    const today = new Date(date);
    today.setUTCHours(0,0,0,0);
    return today

}

function getDate_24_HH_MM(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setUTCHours(hours, minutes, 0, 0);
    return date;
}




function getDateFromMongo(date) {
    return new Date(date);


}

export {getTodayDate,getTodayByDate,calculateAge_YYYY_MM_DD, getDate_YYYY_MM_DD, getDate_24_HH_MM, getDateFromMongo}