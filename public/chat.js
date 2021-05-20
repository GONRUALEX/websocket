//Al definir el script en el html de socketiio antes que el de chat 
//tenemos a nuestra disposición la función io(), dentro de io
// puede ir una url pero si no ponemos nada reconoce el dominio propio y se conecta
//El proceso es:
// 1 - iniciamos el servidor 
// 2 - El servidor envía el frontend al cliente
// 3 - Cuando el navegador inicia se carga el javascript  conectandose
// automáticamente al servidor, una vez se conecta se dispara el envento
// declarado con on('connection', (socket)=>{}) recibiendo en socket la información
const socket = io();   


//cogemos los elementos del dom
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

btn.addEventListener('click', function(){
    socket.emit('chat:message',{
     username:username.value,
     message:message.value
});
});

message.addEventListener('keypress', function(){
    socket.emit('chat:typing', username.value);
})

//escuchamos los eventos enviados por el servidor
socket.on('chat:message', (data)=>{
    actions.innerHTML = '';
    message.value='';
    output.innerHTML = output.innerHTML+`<p>
    <strong> ${data.username}</strong>: ${data.message}
    </p>`
});

//ecuchamos chat.typing
socket.on('chat:typing',(data)=>{
actions.innerHTML = `<p><em>${data} is typing a message</em></p>`;
});