// Function to handle the Data Analysis button click
function handleDataAnalysis(userName) {
  PropertiesService.getUserProperties().setProperty("expecting", "analysisType");
  return {
    message: `Thanks for choosing Data Analysis, ${userName}! Please select an analysis type:`,
    buttons: [
      { label: "Ageing Bucket", action: "analysisAgeingBucket" },
      { label: "Top 5 High Dollar Value Customers", action: "analysisTopCustomers" },
      { label: "Top 5 Open Credits", action: "analysisTopCredits" },
      { label: "Year-Wise AR", action: "analysisYearWise" },
      { label: "Dispute Cases Value", action: "analysisDisputeCases" },
      { label: "Current to 30 and >120% AR Value", action: "analysisCurrentTo120" },
      { label: "Trend Analysis", action: "analysisTrend" },
      { label: "Return to Main Menu", action: "returnToMainMenu" }
    ]
  };
}

function analysisAgeingBucket(userName) {
  PropertiesService.getUserProperties().setProperty("expecting", "spreadsheetId");

  // Provide the image link for Spreadsheet ID guidance
  const imageLink = "https://community.androidbuilder.in/uploads/default/original/2X/3/3dfa5c182e69ec5da190bf5203e7c2e8a0e1f323.png"; // Replace this with your image link

  return {
    message: `Thank you, ${userName}. Please enter the Spreadsheet ID that contains your data. If you're unsure, see the sample image below to locate your Spreadsheet ID.`,
    image: imageLink
  };
}

function handleAgeingBucketInput(input) {
  const expecting = PropertiesService.getUserProperties().getProperty("expecting");
  console.log("Expected input type:", expecting, "Received input:", input);

  if (expecting === "spreadsheetId") {
    PropertiesService.getUserProperties().setProperty("spreadsheetId", input);
    PropertiesService.getUserProperties().setProperty("expecting", "sheetName");
    console.log("Spreadsheet ID recognized:", input);
    return {
      message: "Got it! Now, please provide the sheet name where your data is stored.",
      expecting: "sheetName"
    };
  }

  if (expecting === "sheetName") {
    PropertiesService.getUserProperties().setProperty("sheetName", input);
    PropertiesService.getUserProperties().setProperty("expecting", "ageingColumn");
    return { message: "Thank you! Now, please provide the column header name containing the ageing days or arrears days." };
  }

  if (expecting === "ageingColumn") {
    PropertiesService.getUserProperties().setProperty("ageingColumn", input);

    try {
      const spreadsheetId = PropertiesService.getUserProperties().getProperty("spreadsheetId");
      const sheetName = PropertiesService.getUserProperties().getProperty("sheetName");
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      const columnIndex = headers.indexOf(input) + 1;

      if (columnIndex > 0) {
        const ageingColumnRange = sheet.getRange(2, columnIndex, sheet.getLastRow() - 1).getValues().flat();

        if (ageingColumnRange.every(value => !isNaN(value) && value !== "")) {
          PropertiesService.getUserProperties().setProperty("expecting", "customerColumn");
          return { message: "Great! Now, please provide the column header name where customer names or SAP bill-to numbers are stored." };
        } else {
          return { message: "The values in the specified column are not all numbers. Please check and provide the correct column name." };
        }
      } else {
        return { message: "The column header name you provided was not found. Please check the header name and try again." };
      }
    } catch (error) {
      return { message: "An error occurred while accessing the specified column. Please ensure the sheet and column name are correct." };
    }
  }

  if (expecting === "customerColumn") {
    PropertiesService.getUserProperties().setProperty("customerColumn", input);
    PropertiesService.getUserProperties().setProperty("expecting", "amountColumn");
    return { message: "Thank you! Lastly, please provide the column header name where the receivable amounts are listed." };
  }

  if (expecting === "amountColumn") {
    PropertiesService.getUserProperties().setProperty("amountColumn", input);
    PropertiesService.getUserProperties().deleteProperty("expecting");
    return generateAgeingReport();
  }

  return { message: "I'm sorry, I didn’t quite understand that. Please try again or start over." };
}

function generateAgeingReport() {
  const spreadsheetId = PropertiesService.getUserProperties().getProperty("spreadsheetId");
  const sheetName = PropertiesService.getUserProperties().getProperty("sheetName");
  const ageingColumnHeader = PropertiesService.getUserProperties().getProperty("ageingColumn");
  const customerColumnHeader = PropertiesService.getUserProperties().getProperty("customerColumn");
  const amountColumnHeader = PropertiesService.getUserProperties().getProperty("amountColumn");

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);

  // Retrieve column indices
  const sheetHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const ageingColumnIndex = sheetHeaders.indexOf(ageingColumnHeader) + 1;
  const customerColumnIndex = sheetHeaders.indexOf(customerColumnHeader) + 1;
  const amountColumnIndex = sheetHeaders.indexOf(amountColumnHeader) + 1;

  if (ageingColumnIndex === 0 || customerColumnIndex === 0 || amountColumnIndex === 0) {
    return { message: "One or more specified columns were not found. Please check the column header names and try again." };
  }

  // Retrieve data
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const reportData = {};
  const grandTotals = { "Current to 30": 0, "31 to 60": 0, "61 to 90": 0, "91 to 120": 0, "Over 120": 0 };

  // Process each row
  data.forEach(row => {
    const customer = row[customerColumnIndex - 1];
    const ageingDays = row[ageingColumnIndex - 1];
    const amount = row[amountColumnIndex - 1];

    if (!isNaN(ageingDays) && !isNaN(amount)) {
      // Determine the ageing bucket
      let bucket;
      if (ageingDays <= 30) {
        bucket = "Current to 30";
      } else if (ageingDays <= 60) {
        bucket = "31 to 60";
      } else if (ageingDays <= 90) {
        bucket = "61 to 90";
      } else if (ageingDays <= 120) {
        bucket = "91 to 120";
      } else {
        bucket = "Over 120";
      }

      // Initialize customer and bucket in reportData if not already present
      if (!reportData[customer]) reportData[customer] = { "Current to 30": 0, "31 to 60": 0, "61 to 90": 0, "91 to 120": 0, "Over 120": 0 };
      reportData[customer][bucket] += amount;
      grandTotals[bucket] += amount;
    }
  });

  // Create a new sheet for the report or clear existing one
  const reportSheetName = "Ageing Bucket Report";
  let reportSheet = spreadsheet.getSheetByName(reportSheetName);
  if (reportSheet) {
    reportSheet.clear(); // Clear existing data
  } else {
    reportSheet = spreadsheet.insertSheet(reportSheetName);
  }

  // Headers
  const reportHeaders = ["Customer Name", "Current to 30", "31 to 60", "61 to 90", "91 to 120", "Over 120", "Grand Total"];
  reportSheet.appendRow(reportHeaders);

  // Populate data
  for (const [customer, buckets] of Object.entries(reportData)) {
    const total = Object.values(buckets).reduce((sum, value) => sum + value, 0);
    if (total !== 0 || Object.values(buckets).some(value => value !== 0)) {  // Ensure row is non-empty
      reportSheet.appendRow([customer, buckets["Current to 30"], buckets["31 to 60"], buckets["61 to 90"], buckets["91 to 120"], buckets["Over 120"], total]);
    }
  }

  // Add Grand Total Row
  const customerGrandTotal = Object.values(grandTotals).reduce((sum, value) => sum + value, 0);
  reportSheet.appendRow(["Grand Total", grandTotals["Current to 30"], grandTotals["31 to 60"], grandTotals["61 to 90"], grandTotals["91 to 120"], grandTotals["Over 120"], customerGrandTotal]);

  // Apply currency format
  const lastRow = reportSheet.getLastRow();
  const currencyRange = reportSheet.getRange(2, 2, lastRow - 1, 6);
  currencyRange.setNumberFormat("$#,##0.00");

  // Apply bold formatting
  reportSheet.getRange(1, 1, 1, 7).setFontWeight("bold"); // Header row
  reportSheet.getRange(2, 1, lastRow - 1, 1).setFontWeight("bold"); // First column
  reportSheet.getRange(lastRow, 1, 1, 7).setFontWeight("bold"); // Last row

  // Apply color to header row
  reportSheet.getRange(1, 1, 1, 7).setBackground("#D9E1F2"); // Light blue background

  // Apply borders
  reportSheet.getRange(1, 1, lastRow, 7).setBorder(true, true, true, true, true, true);

  return { message: "The ageing bucket report has been generated and added to the 'Ageing Bucket Report' sheet in your spreadsheet." };
}



// Function to handle "Top 5 High Dollar Value Customers"
function analysisTopCustomers(userName) {
  PropertiesService.getUserProperties().setProperty("expecting", "spreadsheetId");
  const imageLink = "https://community.androidbuilder.in/uploads/default/original/2X/3/3dfa5c182e69ec5da190bf5203e7c2e8a0e1f323.png";
  return {
    message: `Thank you, ${userName}. Please enter the Spreadsheet ID that contains your data. If you're unsure, see the sample image below to locate your Spreadsheet ID.`,
    image: imageLink
  };
}

// Handle inputs for Top Customers
function handleTopCustomersInput(input) {
  const expecting = PropertiesService.getUserProperties().getProperty("expecting");

  if (expecting === "spreadsheetId") {
    PropertiesService.getUserProperties().setProperty("spreadsheetId", input);
    PropertiesService.getUserProperties().setProperty("expecting", "sheetName");
    return { message: "Got it! Now, please provide the sheet name where your data is stored." };
  }

  if (expecting === "sheetName") {
    PropertiesService.getUserProperties().setProperty("sheetName", input);
    PropertiesService.getUserProperties().setProperty("expecting", "customerColumn");
    return { message: "Thank you! Now, please provide the column header name where customer names or SAP bill-to numbers are stored." };
  }

  if (expecting === "customerColumn") {
    PropertiesService.getUserProperties().setProperty("customerColumn", input);
    PropertiesService.getUserProperties().setProperty("expecting", "amountColumn");
    return { message: "Got it! Lastly, please provide the column header name where the receivable amounts are listed." };
  }

  if (expecting === "amountColumn") {
    PropertiesService.getUserProperties().setProperty("amountColumn", input);
    PropertiesService.getUserProperties().deleteProperty("expecting");
    return generateTopCustomersReport();
  }
}

// Generate Top 5 High Dollar Value Customers report
function generateTopCustomersReport() {
  const spreadsheetId = PropertiesService.getUserProperties().getProperty("spreadsheetId");
  const sheetName = PropertiesService.getUserProperties().getProperty("sheetName");
  const customerColumnHeader = PropertiesService.getUserProperties().getProperty("customerColumn");
  const amountColumnHeader = PropertiesService.getUserProperties().getProperty("amountColumn");

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName);

  // Get column indices
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const customerColumnIndex = headers.indexOf(customerColumnHeader) + 1;
  const amountColumnIndex = headers.indexOf(amountColumnHeader) + 1;

  if (customerColumnIndex === 0 || amountColumnIndex === 0) {
    return { message: "One or more specified columns were not found. Please check the column header names and try again." };
  }

  // Fetch data and calculate sums
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  const customerTotals = {};

  data.forEach(row => {
    const customer = row[customerColumnIndex - 1];
    const amount = row[amountColumnIndex - 1];
    if (customer && !isNaN(amount)) {
      customerTotals[customer] = (customerTotals[customer] || 0) + amount;
    }
  });

  // Sort and get top 5 customers
  const sortedCustomers = Object.entries(customerTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Create a new sheet for the report
  const reportSheetName = "Top 5 High Dollar Value Customers";
  let reportSheet = spreadsheet.getSheetByName(reportSheetName);
  if (reportSheet) {
    reportSheet.clear(); // Clear existing data
  } else {
    reportSheet = spreadsheet.insertSheet(reportSheetName);
  }

  // Append headers and data
  reportSheet.appendRow(["Customer Name", "Total Receivable Amount"]);
  sortedCustomers.forEach(([customer, total]) => {
    reportSheet.appendRow([customer, total]);
  });

  // Apply formatting
  reportSheet.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#D9E1F2");
  reportSheet.getRange(2, 2, sortedCustomers.length, 1).setNumberFormat("$#,##0.00");
  reportSheet.getRange(1, 1, sortedCustomers.length + 1, 2).setBorder(true, true, true, true, true, true);

  return { message: "The 'Top 5 High Dollar Value Customers' report has been generated and added to your spreadsheet." };
}



