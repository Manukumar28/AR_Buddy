// Main.gs

// Global variable to store the user's name
var userName = "";

// Main function to start conversation and prompt for user name
function startConversation() {
  const userName = PropertiesService.getUserProperties().getProperty("userName");
  
  if (!userName) {
    console.log("No userName set. Prompting for name.");
    return { message: "Welcome! Please enter your name to get started:", requestName: true };
  } else {
    console.log("User already registered with name:", userName);
    return handleGreeting(userName);
  }
}

// Function to handle initial greeting and main menu display
function handleGreeting(name) {
  PropertiesService.getUserProperties().setProperty("userName", name); // Save the user's name persistently
  console.log("Setting userName to:", name); // Debugging output
  return {
    message: `Hey ${name}, thanks for registering! I'm AR-Buddy, your personal assistant. Here are some ways I can assist you:`,
    buttons: getMainMenuButtons()
  };
}

// Function to get main menu buttons
function getMainMenuButtons() {
  return [
    { label: "SOP Query", action: "handleSOPQuery" },
    { label: "Data Analysis", action: "handleDataAnalysis" },
    { label: "Dashboard & Visualization", action: "handleVisualization" },
    { label: "Suggestion Form", action: "showSuggestionForm" }
  ];
}

// Handle button actions based on user choice
function handleButtonClick(action) {
  const userName = PropertiesService.getUserProperties().getProperty("userName");
  console.log("Handling button click for action:", action, "with userName:", userName);

  if (action === "handleSOPQuery") {
    return handleSOPQuery();
  } else if (action === "handleDataAnalysis") {
    return handleDataAnalysis(userName);
  } else if (action === "handleVisualization") {
    return handleVisualization(userName);
  } else if (action === "showSuggestionForm") {
    return showSuggestionForm(userName);
  } else if (action === "returnToMainMenu") {
    return returnToMainMenu();
  } else if (action=== "analysisAgeingBucket"){
    return analysisAgeingBucket(userName);
  }else if (action === "analysisTopCustomers") {
  return analysisTopCustomers(userName);
}

}

// Function to return to the main menu
function returnToMainMenu() {
  const userName = PropertiesService.getUserProperties().getProperty("userName");
  console.log("Returning to main menu with userName:", userName);
  return {
    message: `Hey ${userName}, you're back at the main menu. Here are some ways I can assist you:`,
    buttons: getMainMenuButtons()
  };
}

// Entry point to serve the HTML page in the web app
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}
