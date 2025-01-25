document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-container');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('message');
    const sendButton = document.getElementById('send');

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            appendMessage(message, true);
            
            setTimeout(() => {
                appendMessage("Ceci est une réponse automatique", false);
            }, 1000);

            messageInput.value = '';
        }
    }

    function appendMessage(message, isUser) {
        const messageHTML = `
            <div class="${isUser ? 'ml-auto bg-indigo-50' : 'mr-auto bg-gray-50'} p-3 rounded-lg max-w-[80%] mb-4">
                <p class="text-gray-800">${escapeHtml(message)}</p>
                <p class="text-xs text-gray-500 mt-1">${new Date().toLocaleTimeString()}</p>
            </div>
        `;
        messages.insertAdjacentHTML('beforeend', messageHTML);
        messages.scrollTop = messages.scrollHeight;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});

