const pCal = require('ara-persian-cal');

exports.ToPersian = (date, format = 'YYYY/MM/DD') => {
    return pCal.ToPersian(date, format);
};

exports.ToGregorian = (year, month, day, format = 'YYYY/MM/DD') => {
    return pCal.ToGregorian(year, month, day, format);
};

String.prototype.toPersian = toPersian;

Number.prototype.toPersian = toPersian;
