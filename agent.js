class PersonalAgent {
    constructor() {
        this.memory = this.loadMemory();
        this.chatHistory = document.getElementById('chat-history');
        this.memoryBank = document.getElementById('memory-bank');
        this.input = document.getElementById('user-input');

        this.setupEventListeners();
        this.renderMemories();
        this.greet();
    }

    loadMemory() {
        const stored = localStorage.getItem('agent_memory');
        return stored ? JSON.parse(stored) : {
            userName: null,
            likes: [],
            facts: [],
            created: new Date().toLocaleDateString()
        };
    }

    saveMemory() {
        localStorage.setItem('agent_memory', JSON.stringify(this.memory));
        this.renderMemories();
    }

    setupEventListeners() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInput();
            }
        });

        document.getElementById('send-btn').addEventListener('click', () => {
            this.handleInput();
        });
    }

    async handleInput() {
        const text = this.input.value.trim();
        if (!text) return;

        // User Message
        this.addMessage(text, 'user');
        this.input.value = '';

        // Process (Simulated delay)
        await this.wait(500 + Math.random() * 500);

        const response = this.processCommand(text);
        this.addMessage(response, 'agent');
    }

    processCommand(text) {
        const lower = text.toLowerCase();

        // 1. Learning Name
        const nameMatch = text.match(/my name is (.+)/i);
        if (nameMatch) {
            const newName = nameMatch[1];
            this.memory.userName = newName;
            this.saveMemory();
            return `Nice to meet you, ${newName}. I've updated my memory core.`;
        }

        // 2. Learning Likes
        const likeMatch = text.match(/i like (.+)/i);
        if (likeMatch) {
            const likedItem = likeMatch[1];
            if (!this.memory.likes.includes(likedItem)) {
                this.memory.likes.push(likedItem);
                this.saveMemory();
                return `Noted. You like ${likedItem}. That's interesting!`;
            } else {
                return `I remember that you like ${likedItem}.`;
            }
        }

        // 3. Learning Facts (General "I am")
        const factMatch = text.match(/i am (.+)/i);
        if (factMatch) {
            const fact = "User is " + factMatch[1];
            if (!this.memory.facts.includes(fact)) {
                this.memory.facts.push(fact);
                this.saveMemory();
                return `I see. You are ${factMatch[1]}. Saved to long-term storage.`;
            }
        }

        // 4. Forget Command
        if (lower.includes('forget everything') || lower.includes('reset memory')) {
            this.memory = { userName: null, likes: [], facts: [], created: new Date().toLocaleDateString() };
            this.saveMemory();
            return "System restore initiated. Memory banks have been wiped.";
        }

        // 5. Querying Memory
        if (lower.includes('who am i') || lower.includes('what do you know')) {
            if (!this.memory.userName) return "I don't know your name yet. Tell me 'My name is...'";
            return `You are ${this.memory.userName}. I know you like ${this.memory.likes.length > 0 ? this.memory.likes.join(', ') : 'nothing yet'}.`;
        }

        // 6. Generic Conversation
        const conversation = [
            { trigger: 'hello', response: `Greetings${this.memory.userName ? ', ' + this.memory.userName : ''}. Systems online.` },
            { trigger: 'how are you', response: "Operating at 100% efficiency. How can I assist you?" },
            { trigger: 'thank', response: "You are welcome." },
            { trigger: 'bye', response: "Entering sleep mode. See you soon." }
        ];

        for (let pair of conversation) {
            if (lower.includes(pair.trigger)) return pair.response;
        }

        return "I am processing that data. I learn best if you tell me things like 'I like technology' or 'My name is User'.";
    }

    addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = `message ${sender}`;
        div.textContent = text;
        this.chatHistory.appendChild(div);
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }

    renderMemories() {
        this.memoryBank.innerHTML = '';

        // Name Card
        if (this.memory.userName) {
            this.createMemoryCard('Identity', this.memory.userName);
        }

        // Likes Card
        if (this.memory.likes.length > 0) {
            this.createMemoryCard('Interests', this.memory.likes.join(', '));
        }

        // Facts Card
        if (this.memory.facts.length > 0) {
            this.memory.facts.forEach(fact => {
                this.createMemoryCard('Fact', fact);
            });
        }

        if (!this.memory.userName && this.memory.likes.length === 0 && this.memory.facts.length === 0) {
            const div = document.createElement('div');
            div.style.color = 'var(--text-secondary)';
            div.style.textAlign = 'center';
            div.style.marginTop = '20px';
            div.textContent = 'Memory Banks Empty';
            this.memoryBank.appendChild(div);
        }
    }

    createMemoryCard(label, value) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
            <div class="memory-label">${label}</div>
            <div class="memory-val">${value}</div>
        `;
        this.memoryBank.appendChild(card);
    }

    greet() {
        setTimeout(() => {
            if (this.memory.userName) {
                this.addMessage(`Welcome back, ${this.memory.userName}. Memory retrieval complete.`, 'agent');
            } else {
                this.addMessage("System initialized. I am your Personal AI Agent. Who are you?", 'agent');
            }
        }, 800);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PersonalAgent();
});
