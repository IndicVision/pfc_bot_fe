let url = "https://indic-pfc-2b3294c20d4c.herokuapp.com";

const chatBox = document.getElementById('chats');

const validUsername = "indicvision";
const validPassword = "password123";
const testing = false;
const api = true;

window.onload = function() {
    if (!testing) {
        showLoginPage();
    } else {
        init();
    }
};

// Helper Functions

function showLoginPage() {
    document.getElementById('login-page').style.display = 'block';
    const inputField = document.getElementById('password');
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            login();
        }
    })
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    
    if (username === validUsername && password === validPassword) {
        document.getElementById('login-page').style.display = 'none';
        init()
    } else {
        errorMsg.style.display = 'block'; 
    }
}

function init() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('chats').style.display = 'block';
    document.getElementById('input').style.display = 'block';
    checkAPIStatus();
    const inputField = document.getElementById('user-input');
    inputField.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
    showInstructions();
}

function showInstructions() {
    if (chatBox.childNodes.length === 1) {
        instructionMsgDiv = document.createElement('div');
        instructionMsgDiv.classList.add('instruct_msg');
        instructionMsgDiv.innerHTML = `
            <h2 style="text-align: center;">Instructions</h2>
            <p style="text-indent: 7%">Lorem ipsum odor amet, consectetuer adipiscing elit. Dolor fusce porttitor in arcu turpis, tincidunt nec. Ante per nullam senectus; curabitur blandit aenean. Tempor morbi varius quisque quam; interdum maximus scelerisque? Facilisis facilisi taciti; bibendum dictumst litora maximus auctor. Donec tempus sed tempor, bibendum curabitur euismod congue magna. Ligula rutrum proin convallis nam a pharetra habitant hac. Pulvinar magna ad erat mus mollis dignissim risus leo.</p>
        `;
        // instructionMsgDiv.innerHTML = `Sorry for the inconvenience but the chatbot is under repair, it will be up and running very soon : )`
        chatBox.appendChild(instructionMsgDiv);
    }
}

function addUserMessage() {
    const userInput = document.getElementById('user-input').value;
    const newMessageDiv = document.createElement('div');
    newMessageDiv.classList.add('msg','message');
    newMessageDiv.textContent = userInput;
    chatBox.appendChild(newMessageDiv);
    document.getElementById('user-input').value = '';
}

// API Calls
async function checkAPIStatus(){
    if (api){
        const statusMessageDiv = document.createElement('div')
        statusMessageDiv.classList.add('status-message')
        statusMessageDiv.textContent = "Connecting to API..."
        chatBox.appendChild(statusMessageDiv)
        try {
            const response = await fetch(url+"/init");
            if (response.ok) {
                statusMessageDiv.textContent = "Connected to API"
                setTimeout(() => {
                    statusMessageDiv.remove();
                }, 2000);
            }
        } catch (error) {
            setTimeout(() => {
                console.log("Trying again")
                // statusMessageDiv.remove();
                // init()
            }, 15000);
        }
    } else {
        const statusMessageDiv = document.createElement('div')
        statusMessageDiv.classList.add('status-message')
        statusMessageDiv.textContent = "Testing mode on"
        chatBox.appendChild(statusMessageDiv)
        setTimeout(() => {
            statusMessageDiv.remove();
        }, 2000)
    }
}

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== ''){
        if (instructionMsgDiv) {
            chatBox.removeChild(instructionMsgDiv);
            instructionMsgDiv = null;
        }
        if (api) {
            addUserMessage();
            await fetch(url+"/chat", {
                method:"POST",
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    query: userInput,
                })
            })
            .then(response => response.json())
            .then(data => {
                const botMessageDiv = document.createElement('div');
                botMessageDiv.classList.add('response');
                botMessageDiv.innerHTML = `<img src="images/logo.png" class="chat-icon">${marked.parse(data.response)}`;
                chatBox.appendChild(botMessageDiv)
                chatBox.scrollTop = chatBox.scrollHeight;            
            })
            .catch(error => {
                console.error("Error: ", error);
                const errorMessageDiv = document.createElement('div');
                errorMessageDiv.classList.add('msg', 'error_message');
                errorMessageDiv.textContent = "Error: please refresh and try again";
                chatBox.appendChild(errorMessageDiv);
            })
        }
        else {
            addUserMessage();
            setTimeout(function() {
                const botResponseDiv = document.createElement('div');
                botResponseDiv.classList.add('response');
                botResponseDiv.innerHTML = `<img src="images/logo.png" class="chat-icon">${marked.parse("Lorem ipsum odor amet, consectetuer adipiscing elit. Dolor fusce porttitor in arcu turpis, tincidunt nec. Ante per nullam senectus; curabitur blandit aenean. Tempor morbi varius quisque quam; interdum maximus scelerisque? Facilisis facilisi taciti; bibendum dictumst litora maximus auctor. Donec tempus sed tempor, bibendum curabitur euismod congue magna. Ligula rutrum proin convallis nam a pharetra habitant hac. Pulvinar magna ad erat mus mollis dignissim risus leo.")}`;
                chatBox.appendChild(botResponseDiv);
            }, 1000);
        }
    }
}