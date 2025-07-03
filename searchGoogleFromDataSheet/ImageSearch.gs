const PROPERTIES_KEY = 'lastUsedRow';

function getImageSearchUrl(rowIndex) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  const data = sheet.getRange(rowIndex, 2, 1, 3).getValues()[0]; // Columns B, C, D
  const [brand, model, color] = data;

  if (!brand || !model) {
    return { url: "", brand: brand || "", model: model || "", color: color || "" };
  }

  const query = `${brand} ${model} frame Color ${color}`;
  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`;

  // Save last row
  PropertiesService.getUserProperties().setProperty(PROPERTIES_KEY, rowIndex.toString());

  return { url, brand, model, color: color || "NA" };
}

function getLastUsedRow() {
  const row = PropertiesService.getUserProperties().getProperty(PROPERTIES_KEY);
  return row ? Number(row) : 2; // Default to 2
}

function highlightRow(rowIndex) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ERP Exactlly");
  if (!sheet) return;

  const range = sheet.getRange(rowIndex, 1, 1, sheet.getLastColumn());
  const originalColors = range.getBackgrounds();
  range.setBackground("#ffff00");
  SpreadsheetApp.flush();

  Utilities.sleep(3000);
  range.setBackgrounds(originalColors);

  // Also select column O
  const cell = sheet.getRange(rowIndex, 15); // Column O
  sheet.setActiveRange(cell);
}
