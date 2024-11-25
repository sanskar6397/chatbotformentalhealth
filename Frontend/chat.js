// chatbot.js

// Initialize AOS (Animate On Scroll) if used
if (typeof AOS !== 'undefined') {
    AOS.init();
} else {
    console.warn("AOS library not found. Skipping initialization.");
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) { // Added null check
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Change icon based on theme
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fa fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fa fa-moon"></i>';
        }
    });
} else {
    console.error("Theme toggle element with ID 'themeToggle' not found.");
}

// Chat Functionality
const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

if (!sendButton || !userInput || !chatBox) {
    console.error("One or more chat elements ('sendButton', 'userInput', 'chatBox') not found.");
}

// Revised botResponses with respectful language
const botResponses = {
    "greeting": [
        "Hello! How can I assist you today?",
        "Hi there! What can I do for you?",
        "Hey, how are you?"
    ],
    "how are you": "I'm here to help you! How are you feeling today?",
    "not feeling good": "I'm sorry to hear that. Would you like to talk about it?",
    "yes": "I'm here to listen. Please tell me more.",
    "no": "That's okay. If you change your mind, I'm here to help.",
    "i am okay": "Great! Tell me about your day.",
    "i dont know": "It sounds like you're going through a tough time. Would you like to discuss it?",
    "unmotivated": "It can be challenging to stay motivated. I'm here to support you.",
    "i will try": "That's a positive step. Remember, you're not alone.",
    "hopeless": "I'm really sorry you're feeling this way. Please reach out to a professional or someone you trust.",
    "thank you": "You're welcome! I'm glad I could help.",
    "bye": "Goodbye! Take care.",
    "default": "I'm sorry, I didn't understand that. Could you please rephrase?"
};

// Offensive words list for filtering
const offensiveWords = ["chutiya", "bsdk", "lund"];

// Function to check for offensive words
function containsOffensiveWords(input) {
    return offensiveWords.some(word => input.includes(word));
}

// Function to append message to chat
function appendMessage(content, sender = 'bot') {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');

    const msgContent = document.createElement('div');
    msgContent.classList.add('msg-content');
    msgContent.innerHTML = `<p>${content}</p>`;

    messageDiv.appendChild(msgContent);
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to handle user input
function handleSend() {
    const input = userInput.value.trim().toLowerCase();
    if (input === '') return;

    appendMessage(input, 'user');
    userInput.value = '';

    // Check for offensive language
    if (containsOffensiveWords(input)) {
        appendMessage("Please refrain from using offensive language.", 'bot');
        return;
    }

    console.log("User Input:", input); // Debugging

    // Simulate bot response after a short delay
    setTimeout(() => {
        const response = getBotResponse(input);
        console.log("Bot Response:", response); // Debugging
        appendMessage(response, 'bot');
    }, 1000);
}

// Function to get bot response using Regular Expressions for flexible matching
function getBotResponse(input) {
    const mappings = [
        {
            regex: /^(hi|hello|hey|hi there|hello there|hey there|hii)$/i,
            response: () => getRandomResponse(botResponses["greeting"])
        },
        {
            regex: /how are you( doing)?/i,
            response: () => botResponses["how are you"]
        },
        {
            regex: /(not feeling good|not great|not good|not okay)/i,
            response: () => botResponses["not feeling good"]
        },
        {
            regex: /^yes$/i,
            response: () => botResponses["yes"]
        },
        {
            regex: /^no$/i,
            response: () => botResponses["no"]
        },
        {
            regex: /^i am okay$/i,
            response: () => botResponses["i am okay"]
        },
        {
            regex: /(i dont know|unmotivated)/i,
            response: () => botResponses["i dont know"]
        },
        {
            regex: /(i will try|hopeless)/i,
            response: () => botResponses["i will try"]
        },
        {
            regex: /thank you/i,
            response: () => botResponses["thank you"]
        },
        {
            regex: /^bye$/i,
            response: () => botResponses["bye"]
        }
    ];

    for (let mapping of mappings) {
        if (mapping.regex.test(input)) {
            return mapping.response();
        }
    }

    return botResponses['default'];
}

// Helper function to get a random response from an array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Event Listeners
if (sendButton && userInput) { // Added null check
    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
} else {
    console.error("Send button or user input element not found.");
}
