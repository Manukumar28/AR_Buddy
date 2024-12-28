// SuggestionForm.gs

// Function to show the Suggestion Form
function showSuggestionForm(userName) {
  return {
    message: `Hey ${userName}, please fill in the suggestion form with your feature request.`,
    buttons: [{ label: "Return to Main Menu", action: "returnToMainMenu" }]
  };
}

// Function to handle suggestion form data submission
function submitSuggestionForm(data) {
  const userName = PropertiesService.getUserProperties().getProperty("userName");
  const sheet = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID").getSheetByName("Suggestions");
  sheet.appendRow([new Date(), data.name, data.suggestion]);
  return { message: `Thanks for your suggestion, ${userName}! We’ll notify you once it’s ready.` };
}
