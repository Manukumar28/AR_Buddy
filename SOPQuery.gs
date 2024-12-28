// SOPQuery.gs

// Function to handle SOP queries
function handleSOPQuery() {
  const userName = PropertiesService.getUserProperties().getProperty("userName");
  return {
    message: `Thanks for choosing SOP queries, ${userName}! Please ask your question, and I'll do my best to help.`,
    buttons: [{ label: "Return to Main Menu", action: "returnToMainMenu" }]
  };
}
