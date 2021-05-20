const path = require('path');
const express = require('express');
const app = express();
const SocketIO = require('socket.io');




/*Inicialización del servidor que daremos a socketio*/
//settings
//Añadimos el puerto
app.set('port', process.env.PORT || 3000);

//static file
//aquí estamos metiendo la carpeta public para que se muestre en el servidor, siempre busca un archivo index, utilizamos el path.join
//para que no haya conflicto a la hora de representar /public o \public, con join pondrá el slash correcto
app.use(express.static(path.join(__dirname , 'public')));

//start the server
//Levantamos el servidor en el puerto especificado
const server = app.listen(app.get('port'),()=>{
    console.log("server on port ", app.get('port'))
});

//necesitamos darle a socketio el servidor para poder crear la conexión bidireccional
//para ello utilizamos listen de socket y recibe la configuración del chat diciendole
//que metemos el módulo app, debemos meterle el servidor inicializado por ello
//guardamos el servidor en una constante llamada server y la pasamos.
//SocketIO.listen(server);
//En este caso guardamos la conexión en una variable sin utilizar listen
const io = SocketIO(server);

/*Utilizar socket.io*/
//El primer evento que escuchamos es cuando se conecta un cliente, para ello utilizamos 
//on y el nombre del evente que será connection, seguidamente se ejecutará la función
io.on('connection', (socket)=>{
    console.log('new connection');

    //en el cliente hago un socket.emmit('chat:message'), es decir creo un evento
    //que recojo con on en elservidor y los datos que manda, la función on se debe
    //utilizar desde socket que viene como argumento en la funcion anónima del io.on
    socket.on('chat:message', (data)=>{
        //con los datos podemos reenviar los datos a todos los usuarios incluyendome
        //a mi o a todos menos a mi
        //io que sería la conexión completa, a todos los sockets que están conectados
        // les emitimos un evento, esto es lo que significa la siguiente sentencia
        //en este caso ponemos el mismo nombre pero se puede poner cualquiera
        //hacemos aquí el caso en el que lo mando a todos
        io.sockets.emit('chat:message',data);
    });

    socket.on('chat:typing', (data)=>{
        // en este caso mando a todos menos a mi
      socket.broadcast.emit('chat:typing',data);
    })
})






