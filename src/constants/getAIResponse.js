 export const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      return {
        text: "Hey there! 👋 It's great to connect with you. What's on your mind today?",
        memory: null
      };
    } else if (lowerMessage.includes('startup') || lowerMessage.includes('company') || lowerMessage.includes('aira') || lowerMessage.includes('business')) {
      return {
        text: "I remember you're building AiRA! 🚀 That's really exciting. How's the startup journey progressing? Facing any interesting challenges?",
        memory: "Building AiRA startup"
      };
    } else if (lowerMessage.includes('help') || lowerMessage.includes('advice') || lowerMessage.includes('support')) {
      return {
        text: "I'm here to support you! 💪 What specific area would you like help with? Feel free to share your thoughts - I'm all ears.",
        memory: "Seeking advice/help"
      };
    } else if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
      return {
        text: "I'm functioning at peak performance! ⚡ Ready to have a meaningful conversation with you. How are you feeling today?",
        memory: null
      };
    } else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return {
        text: "You're most welcome! 😊 I'm always happy to help. Is there anything else you'd like to discuss or explore together?",
        memory: null
      };
    } else if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
      return {
        text: "I don't have real-time weather data, but I can help you think through outdoor plans! What were you thinking of doing?",
        memory: "Interested in weather/outdoor activities"
      };
    } else {
      return {
        text: "That's really fascinating! 🤔 I'd love to dive deeper into this with you. Could you tell me more about what you're thinking?",
        memory: null
      };
    }
  };