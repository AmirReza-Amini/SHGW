const Events = require('../util/EventList')
module.exports = (io, socket) => {
   socket.on('initial_data', data => {
        //Do some work
        io.emit('get_data', 'Added');
    });
}

