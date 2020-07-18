module.exports = (app, server) => {
    const io = require('socket.io')(server);

    app.use((req, res, next) => {
        res.socket = io;
        next();
    });

    clientsCount = 0;
    io.on('connection', socket => {
        io.of('/').adapter.clients((err, clients) => {
            clientsCount = clients.length;
        });
        console.log(`BASE IS CONNECTED --- Online client(s): ${clientsCount}`);
        global.id = socket.id;
        require('./log.socket')(io, socket)
        socket.on('disconnect', () => { console.log('DISCONNECTED', socket.id); });
    });
}