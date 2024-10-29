let url = "https://indic-pfc-2b3294c20d4c.herokuapp.com";

const chatBox = document.getElementById('chats');

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

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');
    const successMsg = document.getElementById('login-success');
    
    loginAuthenticated = await authenticateLogin(username, password);

    if (loginAuthenticated) {
        document.getElementById('login-page').style.display = 'none';
        init()
    } else {
        errorMsg.style.display = 'block'; 
    }
}

function registerPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'block';
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
            <p style="text-indent: 7%">The IndicVision PFC Chatbot is an AI-powered assistant designed to answer questions about data and insights from Power Finance Corporation (PFC) reports spanning 2020-2023. Leveraging retrieval augmented large language models, it provides users with accurate, quick responses on financial, operational, and sectoral metrics within the power sector, including insights into generation, transmission, and trading companies as well as power company performance metrics from Annexures 1 and 2.</p>
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

async function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirm_password = document.getElementById('confirm-password').value;
    const errorMsg = document.getElementById('register-error');
    const successMsg = document.getElementById('register-success');

    if (password === confirm_password) {
        errorMsg.style.display = 'none';
        await fetch(url+"/register", {
            method:"POST",
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                errorMsg.style.display = 'none';
                successMsg.style.display = 'block';
                successMsg.textContent = "User successfully registered";
                setTimeout(function() {
                    successMsg.style.display = 'none';
                    document.getElementById('register-page').style.display = 'none';
                    showLoginPage();
                }, 1000);
            } else {
                errorMsg.style.display = 'block';
                errorMsg.textContent = data.error;
            }
        })

    } else {
        errorMsg.style.display = 'block';
        errorMsg.textContent = "Passwords do not match";
    }
}

async function authenticateLogin(username, password) {
    let authenicated = null;
    await fetch(url+"/login", {
        method:"POST",
        headers: {
            'Content-Type':'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            authenicated = true;
        } else {
            authenicated = false;
        }
    })
    return authenicated;
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
