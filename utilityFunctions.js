const getTimeFromDateTime = function(datetime){
    return datetime.toISOString().split('T')[1];
}

const getDateFromDateTime = function(datetime){
    return datetime.toISOString().split('T')[0];
}

module.exports = {
    getDateFromDateTime,
    getTimeFromDateTime
}