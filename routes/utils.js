const moment = require("moment");

const countries = {
    KENYA: "π°πͺ",
    UGANDA: "πΊπ¬",
    TANZANIA: "πΉπΏ",
    SOUTHSUDAN: "πΈπΈ",
    SOMALIA: "πΈπ΄"
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

