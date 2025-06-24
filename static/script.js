document.addEventListener('DOMContentLoaded', () => {
    const personaCreator = document.getElementById('persona-creator');
    const chatContainer = document.getElementById('chat-container');
    const startChatBtn = document.getElementById('start-chat-btn');
    const editPersonaBtn = document.getElementById('edit-persona-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const chatPersonaName = document.getElementById('chat-persona-name');

    let currentPersona = {};
    let conversationHistory = [];

    // --- Event Listeners ---
    startChatBtn.addEventListener('click', startChat);
    editPersonaBtn.addEventListener('click', returnToCreator);
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- Core Functions ---
    function startChat() {
        currentPersona = {
            name: document.getElementById('name').value,
            identity: document.getElementById('identity').value,
            knowledge: document.getElementById('knowledge').value,
            humor: document.getElementById('humor').value,
            formality: document.getElementById('formality').value,
            verbosity: document.getElementById('verbosity').value,
        };

        if (!currentPersona.name || !currentPersona.identity) {
            alert('Please provide at least a Name and Core Identity for your persona.');
            return;
        }

        chatPersonaName.textContent = `Chatting with ${currentPersona.name}`;
        personaCreator.classList.add('hidden');
        chatContainer.classList.remove('hidden');
        userInput.focus();
    }

    function returnToCreator() {
        chatContainer.classList.add('hidden');
        personaCreator.classList.remove('hidden');
        // Clear chat for a fresh start
        chatBox.innerHTML = '';
        conversationHistory = [];
    }
    
    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText) return;

        addMessageToChatbox('user', messageText);
        conversationHistory.push({ role: 'user', content: messageText });
        userInput.value = '';
        const loadingMessage = addMessageToChatbox('assistant', '', true); // Loading indicator

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    persona: currentPersona,
                    message: messageText,
                    history: conversationHistory.slice(0, -1) // Send history *before* new message
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Something went wrong on the server.');
            }

            const data = await response.json();
            const assistantMessage = data.response;
            
            loadingMessage.textContent = assistantMessage;
            loadingMessage.classList.remove('loading');

            conversationHistory.push({ role: 'assistant', content: assistantMessage });

        } catch (error) {
            loadingMessage.textContent = `Error: ${error.message}`;
            loadingMessage.style.backgroundColor = '#8B0000';
        }
    }

    function addMessageToChatbox(sender, text, isLoading = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.textContent = text;
        if (isLoading) {
            messageElement.classList.add('loading');
        }
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
        return messageElement;
    }
});