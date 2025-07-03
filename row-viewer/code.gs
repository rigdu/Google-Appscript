// Code.gs

// Function to run automatically when the spreadsheet is opened.
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Row Viewer')
      .addItem('Open Sidebar', 'showSidebar')
      .addToUi();
}

// Function to display the sidebar.
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Row Data Viewer')
      .setWidth(300); // Adjust width as needed
  SpreadsheetApp.getUi().showSidebar(html);
}

// Properties service to remember the last row.
var userProperties = PropertiesService.getUserProperties();

/**
 * Retrieves initial data for the sidebar, including the last saved row.
 * @return {Object} An object containing initial data.
 */
function getInitialData() {
  var lastRow = userProperties.getProperty('lastSelectedRow');
  return {
    lastRow: lastRow ? parseInt(lastRow) : '',
    activeSheetName: SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName()
  };
}

/**
 * Processes the selected row and columns, highlights the row, and returns formatted data.
 * @param {number} rowNum The row number to process.
 * @param {string} columnsString A string representing columns (e.g., "A:O" or "A,B,C,D").
 * @return {string} Formatted data from the selected cells.
 */
function processSelectedData(rowNum, columnsString) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRowProperty = userProperties.getProperty('lastSelectedRow');

  // Clear previous highlight if a row was previously highlighted
  if (lastRowProperty) {
    try {
      sheet.getRange(parseInt(lastRowProperty), 1, 1, sheet.getLastColumn()).setBackground(null);
    } catch (e) {
      // Handle cases where the sheet might have changed or row no longer exists
      console.error("Error clearing previous highlight: " + e.message);
    }
  }

  // Validate row number
  if (rowNum < 1 || rowNum > sheet.getLastRow()) {
    throw new Error("Row number " + rowNum + " is out of valid range (1 to " + sheet.getLastRow() + ").");
  }

  // Highlight the selected row
  sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).setBackground("#FFFF00"); // Yellow highlight

  // Store the current row number
  userProperties.setProperty('lastSelectedRow', rowNum.toString());

  var values = [];
  var columnRanges = [];

  // Parse columnsString
  columnsString = columnsString.toUpperCase().replace(/\s/g, ''); // Clean up input

  if (columnsString.includes(':')) {
    // Handle range like "A:O"
    var parts = columnsString.split(':');
    if (parts.length === 2) {
      var startCol = sheet.getRange(parts[0] + "1").getColumn();
      var endCol = sheet.getRange(parts[1] + "1").getColumn();
      if (startCol && endCol && startCol <= endCol) {
        columnRanges.push({ start: startCol, end: endCol });
      } else {
        throw new Error("Invalid column range: " + columnsString);
      }
    } else {
      throw new Error("Invalid column range format: " + columnsString);
    }
  } else {
    // Handle comma-separated list like "A,B,C"
    var cols = columnsString.split(',');
    cols.forEach(function(colLetter) {
      var colIndex = sheet.getRange(colLetter + "1").getColumn();
      if (colIndex) {
        columnRanges.push({ start: colIndex, end: colIndex });
      } else {
        throw new Error("Invalid column letter: " + colLetter);
      }
    });
  }

  // Fetch and format values
  columnRanges.forEach(function(range) {
    for (var i = range.start; i <= range.end; i++) {
      var cellValue = sheet.getRange(rowNum, i).getDisplayValue(); // Get formatted value
      var headerValue = sheet.getRange(1, i).getDisplayValue(); // Get header from row 1
      if (headerValue) {
        values.push(headerValue + ": " + cellValue); // Header: Value
      } else {
        values.push(cellValue); // Just Value if no header
      }
    }
  });

  return values.join('\n'); // Join with newlines for streamed view
}

/**
 * Clears the highlight from the last selected row.
 */
function clearHighlight() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRowProperty = userProperties.getProperty('lastSelectedRow');
  if (lastRowProperty) {
    try {
      sheet.getRange(parseInt(lastRowProperty), 1, 1, sheet.getLastColumn()).setBackground(null);
      userProperties.deleteProperty('lastSelectedRow'); // Clear the stored property
    } catch (e) {
      console.error("Error clearing highlight: " + e.message);
    }
  }
}
