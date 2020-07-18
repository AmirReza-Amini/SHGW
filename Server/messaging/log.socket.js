const Events = require('../util/EventList')
module.exports = (io, socket) => {
    socket.on(Events.DATA_ADDED, data => {
        //Do some work
        io.emit(Events.DATA_ADDED, 'Added');
    });
}

