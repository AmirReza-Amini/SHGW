mongooseLoger = function (ex) {
    for (property in ex.errors)
        console.log(ex.errors[property].message);
}

module.exports = { Log: mongooseLoger };