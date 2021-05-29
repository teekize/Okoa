const moment = require("moment");

const countries = {
    KENYA: "🇰🇪",
    UGANDA: "🇺🇬",
    TANZANIA: "🇹🇿",
    SOUTHSUDAN: "🇸🇸",
    SOMALIA: "🇸🇴"
}


function reportedOn(createdAt) {
    const date = moment(createdAt).format("MMMM D, Y, h:mma");
    return date
}

const util = {
    countries,
    // reportedOn: reportedOn(createdAt)
}

module.exports = util;

