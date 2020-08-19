module.exports = app => {
    app.use('/api/vessel/berth', require('./berth'));
    app.use('/api/vessel/deck', require('./deck'));
}; 
