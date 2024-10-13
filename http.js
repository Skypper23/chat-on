import { Server } from "socket.io";
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";  // Necessário para criar o __dirname

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Corrigido para usar __dirname e apontar o caminho absoluto
app.use(express.static(path.join(__dirname, "src")));

const serverHttp = http.createServer(app);
const io = new Server(serverHttp);

serverHttp.listen(3030, () => {
    console.log('Server On!');
});

let users = [];
let msgs = [];

io.on("connection", (socket) => {

    socket.on("nome_user", (nome)=>{
        const new_user = { username: nome.username, id: socket.id };
        users.push(new_user);
        io.emit("user_on", new_user);
        socket.emit("old_msgs", msgs);
    })

    socket.on("chat message", (msg)=>{
        const mensa = {username: msg.user, msg: msg.msg};
        msgs.push(mensa);
        io.emit("mensagem", mensa);
    })

    socket.on("disconnect", () => {
        const index = users.findIndex(user => user.id === socket.id); // Encontrar o índice do usuário pelo ID
        if (index !== -1) {
            users.splice(index, 1); // Remover o usuário da array
        }
        console.log(users);
    })
});