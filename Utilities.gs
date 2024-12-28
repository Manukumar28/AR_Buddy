// Utilities.gs

// Function to log messages for debugging purposes
function logMessage(message) {
  console.log(`[DEBUG] ${new Date().toLocaleString()}: ${message}`);
}

// Utility function to retrieve the user's name from properties
function getUserName() {
  return PropertiesService.getUserProperties().getProperty("userName");
}

// Utility function to set the user's name in properties
function setUserName(name) {
  PropertiesService.getUserProperties().setProperty("userName", name);
  logMessage(`User name set to: ${name}`);
}

// Utility function to format responses
function formatResponse(message, buttons = []) {
  return { message, buttons };
}

// Utility function to return the main menu
function getMainMenu() {
  const userName = getUserName();
  logMessage(`Returning main menu for user: ${userName}`);
  return {
    message: `Hey ${userName}, you're back at the main menu. Here are some ways I can assist you:`,
    buttons: [
      { label: "SOP Query", action: "handleSOPQuery" },
      { label: "Data Analysis", action: "handleDataAnalysis" },
      { label: "Dashboard & Visualization", action: "handleVisualization" },
      { label: "Suggestion Form", action: "showSuggestionForm" }
    ]
  };
}

// Utility function to check if a string contains any keywords from a list
function containsKeywords(input, keywords) {
  const lowerInput = input.toLowerCase();
  return keywords.some(keyword => lowerInput.includes(keyword));
}

