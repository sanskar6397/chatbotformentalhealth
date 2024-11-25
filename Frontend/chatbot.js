// chatbot.js

// Initialize AOS (Animate On Scroll) if used
if (typeof AOS !== 'undefined') {
    AOS.init();
} else {
    console.warn("AOS library not found. Skipping initialization.");
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fa fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fa fa-moon"></i>';
        }
    });
}

// Chat Functionality
const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');

const botResponses = {
    "greeting": ["Hello! How can I assist you today?", "Hi there! What can I do for you?", "Hey, how are you?"],
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

const offensiveWords = ["chutiya", "bsdk", "lund"];

function containsOffensiveWords(input) {
    return offensiveWords.some(word => input.includes(word));
}

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
async function handleSend() {
    const input = userInput.value.trim().toLowerCase();
    if (input === '') return;

    appendMessage(input, 'user');
    userInput.value = '';

    // Check for offensive language
    if (containsOffensiveWords(input)) {
        appendMessage("Please refrain from using offensive language.", 'bot');
        return;
    }

    console.log("User Input:", input);

    // Simulate bot response after a short delay
    setTimeout(async () => {
        const response = await getPrediction(input);  // Call the function to get prediction from Flask
        console.log("Bot Response:", response);
        appendMessage(response, 'bot');
    }, 1000);
}

// Function to send input to Flask backend and get prediction
async function getPrediction(input) {
    try {
        // Send user input to Flask backend for prediction
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ features: [parseFloat(input)] }) // Adjust input format based on model
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Get prediction from Flask
        return data.prediction; // Return the prediction from Flask
    } catch (error) {
        console.error('Error:', error);
        return 'Oops! Something went wrong. Please try again later.';  // Error handling
    }
}

// Event Listeners
if (sendButton && userInput) {
    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
}
