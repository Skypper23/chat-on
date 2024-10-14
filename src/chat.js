const socket = io("https://skypper23.github.io/chat-on/src/index.html");

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("nome");

socket.emit("nome_user",{username});

function enviarmsg(){
    const message = document.getElementById("input-msg").value;
    const usuario = {user: username, msg: message};
    socket.emit("chat message", usuario);  // Certifique-se de que o servidor escuta este evento
        
    // Limpar o campo de entrada
    document.getElementById("input-msg").value = '';
}

document.getElementById("input-msg").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {  // Verifique se a tecla pressionada é "Enter"
        if(document.getElementById("input-msg").value == ""){
            console.log("Preenche o campo de texto");
        }else{
            const message = document.getElementById("input-msg").value;
            const usuario = {user: username, msg: message};
            socket.emit("chat message", usuario);  // Certifique-se de que o servidor escuta este evento
        
            // Limpar o campo de entrada
            document.getElementById("input-msg").value = '';
        }
    }
});

socket.on("mensagem", (dado)=>{
    const user = dado.username;
    const texto = dado.msg;
    const h3 = document.querySelector(".text-box");
    h3.innerHTML += `<div"><h3><strong class="other_user">${user}</strong>: ${texto}</h3></div>`;
})

socket.on("user_on", (dado) =>{
    const name = dado.username;
    const h3 = document.querySelector(".text-box");
    h3.innerHTML += `<div><h4>${name}: Entrou no chat!</h4></div>`;
})

socket.on("old_msgs", (dados) => {
    dados.forEach(mensagem => {  // Roda para cada msg no array de mensagens
        const user_name = mensagem.username;  // Acessa o username da mensagem
        const msg = mensagem.msg;  // Acessa a mensagem
        const h3 = document.querySelector(".text-box");
        h3.innerHTML += `<div><h5>${user_name}: ${msg}</h5></div>`;  // Adiciona cada mensagem à tela
    });
});