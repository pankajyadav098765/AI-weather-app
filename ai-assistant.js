class WeatherAI {
    constructor() {
        this.weatherData = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('ai-send-btn').addEventListener('click', () => this.handleUserMessage());
        
        document.getElementById('ai-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserMessage();
        });

        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                document.getElementById('ai-input').value = question;
                this.handleUserMessage();
            });
        });
    }

    updateWeatherData(weatherData) {
        this.weatherData = weatherData;
    }

    handleUserMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addMessage(response, 'ai');
        }, 500);
    }

    generateAIResponse(userMessage) {
        if (!this.weatherData) {
            return "Search for a city first!";
        }

        const message = userMessage.toLowerCase();
        const weather = this.weatherData.weather[0].main.toLowerCase();
        const temp = this.weatherData.main.temp;
        const city = this.weatherData.name;

        if (message.includes('umbrella')) {
            return weather.includes('rain') ? 
                `Yes! Carry umbrella in ${city} ☔` : 
                `No umbrella needed in ${city} ☀️`;
        }
        else if (message.includes('cloth') || message.includes('wear')) {
            if (temp < 10) return `🧥 Warm layers in ${city}`;
            else if (temp < 20) return `👕 Light jacket in ${city}`;
            else return `😎 Light clothes in ${city}`;
        }
        else if (message.includes('outdoor') || message.includes('activity')) {
            return (temp > 15 && !weather.includes('rain')) ?
                `Great for outdoors! 🚶` : `Better indoors today 🏛️`;
        }
        else if (message.includes('summary')) {
            return `${city}: ${temp}°C, ${weather}. ${this.getTip()}`;
        }
        else {
            return `In ${city}: ${temp}°C, ${weather}. Ask about umbrella, clothing, or activities!`;
        }
    }

    getTip() {
        const tips = ["Perfect day! ☀️", "Stay hydrated! 💧", "Great for photos! 📸"];
        return tips[Math.floor(Math.random() * tips.length)];
    }

    addMessage(text, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'AI'}:</strong> ${text}`;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Initialize AI
document.addEventListener('DOMContentLoaded', function() {
    window.weatherAI = new WeatherAI();
});