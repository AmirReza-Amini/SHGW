const pCal = require('ara-persian-cal');

toPersian = (date, format = 'YYYY/MM/DD') => {
    return pCal.ToPersian(date, format);
};

toGregorian = (year, month, day, format = 'YYYY/MM/DD') => {
    return pCal.ToGregorian(year, month, day, format);
};

String.prototype.toPersian = toPersian;

Number.prototype.toPersian = toPersian;


module.exports = {
    ToPersian: toPersian,
    ToGregorian: toGregorian,
}