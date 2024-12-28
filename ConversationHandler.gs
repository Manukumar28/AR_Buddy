// ConversationHandler.gs

// Function to handle various conversational inputs based on keywords
function handleConversation(input) {
  const expecting = PropertiesService.getUserProperties().getProperty("expecting");

  // Route to handleAgeingBucketInput if AR-Buddy is expecting Ageing Bucket inputs
  if (expecting) {
    return handleAgeingBucketInput(input);
  }

  const lowerInput = input.toLowerCase();
  const userName = PropertiesService.getUserProperties().getProperty("userName");
  console.log("Received user input:", input);  // Debugging output

  // Greetings
  if (["hi", "hello", "hey"].some(greet => lowerInput.includes(greet))) {
    console.log("Greeting detected.");
    return { message: `Hey ${userName}, nice to see you! How can I assist you today?`, buttons: getMainMenuButtons() };
  }

  // Capabilities / Features Query
  if (["capabilities", "what can you do", "features", "help"].some(keyword => lowerInput.includes(keyword))) {
    console.log("Capabilities query detected.");
    return { 
      message: `Hey ${userName}, here’s what I can do for you:\n\n1. Resolve your SOP queries.\n2. Provide data analysis and insights.\n3. Create dashboards and visualizations.\nPlease ask me about any of these topics!`, 
      buttons: getMainMenuButtons() 
    };
  }

  // Name-related queries
  if (["what is your name", "who are you", "introduce yourself"].some(keyword => lowerInput.includes(keyword))) {
    console.log("Name query detected.");
    return { 
      message: `I'm AR-Buddy, your friendly assistant! Here to support you with process-related questions, data analysis, and more.`, 
      buttons: getMainMenuButtons() 
    };
  }

  // Wishes
  if (["good morning", "good afternoon", "good evening", "good night"].some(wish => lowerInput.includes(wish))) {
    console.log("Wish detected.");
    return { message: `Good day to you too, ${userName}! Let me know if there's anything I can help you with!`, buttons: getMainMenuButtons() };
  }

  // Options request
  if (lowerInput.includes("options")) {
    console.log("Options request detected.");
    return { message: `Here are some options, ${userName}!`, buttons: getMainMenuButtons() };
  }

  // Fallback response if no keywords match
  console.log("No matching keywords detected, showing fallback response.");
  return { 
    message: `I'm sorry, ${userName}, I didn’t quite understand that. Here are some options for what I can help you with:`, 
    buttons: getMainMenuButtons() 
  };

  if (expecting === "spreadsheetId" || expecting === "sheetName" || expecting === "customerColumn" || expecting === "amountColumn") {
  return handleTopCustomersInput(input);
}
}
