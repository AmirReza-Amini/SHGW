exports.Log = function (ex) {
    for (property in ex.errors)
        console.log(ex.errors[property].message);
}
