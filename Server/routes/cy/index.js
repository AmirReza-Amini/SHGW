

module.exports = app => {
    app.use('/api/cy/yardOperation',require('./yardOperation'));
    app.use('/api/cy/movement',require('./movement'));
}; 
