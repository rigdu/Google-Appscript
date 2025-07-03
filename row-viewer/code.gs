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
 * @param {boolean} showHeaders Whether to show headers in the output.
 * @param {number} headerRowNum The row number where headers are located.
 * @return {string} Formatted data from the selected cells.
 */
function processSelectedData(rowNum, columnsString, showHeaders, headerRowNum) {
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

  // Validate header row number if headers are to be shown
  if (showHeaders && (headerRowNum < 1 || headerRowNum > sheet.getLastRow())) {
    throw new Error("Header row number " + headerRowNum + " is out of valid range (1 to " + sheet.getLastRow() + ").");
  }

  // Highlight the selected row
  sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).setBackground("#FFFF00"); // Yellow highlight

  // Store the current row number
  userProperties.setProperty('lastSelectedRow', rowNum.toString());

  var formattedOutput = [];
  var orderedColumnIndices = []; // This will store column indices in the desired order
  var seenColumnIndices = new Set(); // To track unique columns and prevent duplicates

  // Parse columnsString
  columnsString = columnsString.toUpperCase().replace(/\s/g, ''); // Clean up input

  var parts = columnsString.split(',');
  parts.forEach(function(part) {
    if (part.includes(':')) {
      // Handle range like "G:K"
      var rangeParts = part.split(':');
      if (rangeParts.length === 2) {
        var startColLetter = rangeParts[0];
        var endColLetter = rangeParts[1];
        var startColIndex = sheet.getRange(startColLetter + "1").getColumn();
        var endColIndex = sheet.getRange(endColLetter + "1").getColumn();

        if (startColIndex && endColIndex && startColIndex <= endColIndex) {
          for (var i = startColIndex; i <= endColIndex; i++) {
            if (!seenColumnIndices.has(i)) { // Add only if not already seen
              orderedColumnIndices.push(i);
              seenColumnIndices.add(i);
            }
          }
        } else {
          throw new Error("Invalid column range: " + part);
        }
      } else {
        throw new Error("Invalid column range format: " + part);
      }
    } else {
      // Handle single column letter like "A"
      var colIndex = sheet.getRange(part + "1").getColumn();
      if (colIndex) {
        if (!seenColumnIndices.has(colIndex)) { // Add only if not already seen
          orderedColumnIndices.push(colIndex);
          seenColumnIndices.add(colIndex);
        }
      } else {
        throw new Error("Invalid column letter: " + part);
      }
    }
  });

  // Fetch and format values based on the orderedColumnIndices
  orderedColumnIndices.forEach(function(colIndex) {
    var cellValue = sheet.getRange(rowNum, colIndex).getDisplayValue(); // Get formatted value from the selected row
    var outputLine = "";

    if (showHeaders) {
      var headerValue = sheet.getRange(headerRowNum, colIndex).getDisplayValue(); // Get header from the specified header row
      // Format as "HeaderValue" - CellValue
      outputLine = `"${headerValue}" - ${cellValue}`;
    } else {
      outputLine = cellValue; // Just the value if headers are not shown
    }
    formattedOutput.push(outputLine);
  });

  return formattedOutput.join('\n'); // Join with newlines for streamed view
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
