// DashboardVisualization.gs

// Function to handle Dashboard & Visualization options
function handleVisualization(userName) {
  return {
    message: `Thanks for choosing Dashboard & Visualization, ${userName}! Please select a visualization type:`,
    buttons: [
      { label: "Chart", action: "visualChart" },
      { label: "Table", action: "visualTable" },
      { label: "Pivot Table", action: "visualPivot" },
      { label: "Pie Chart", action: "visualPieChart" },
      { label: "Line Graph", action: "visualLineGraph" },
      { label: "Bar Graph", action: "visualBarGraph" },
      { label: "Multiple Charts", action: "visualMultiple" },
      { label: "Return to Main Menu", action: "returnToMainMenu" }
    ]
  };
}
