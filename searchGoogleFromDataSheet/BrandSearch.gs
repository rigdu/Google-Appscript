// Return licensor and row number for exact match or closest match
function searchLicensor(brandName) {
  if (!brandName) return 'Enter brand name';

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Brand');
  if (!sheet) return 'Brand sheet not found';

  const data = sheet.getDataRange().getValues();
  let foundRow = -1;
  let licensor = '';
  
  // Exact match check first
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().toLowerCase() === brandName.toLowerCase()) {
      foundRow = i + 1; // sheet rows are 1-indexed
      licensor = data[i][1] || 'Licensor not found';
      return `Row ${foundRow}: ${licensor}`;
    }
  }

  // If no exact match, try substring fuzzy search (case insensitive)
  const suggestions = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().toLowerCase().includes(brandName.toLowerCase())) {
      suggestions.push(data[i][0]);
      if (suggestions.length >= 5) break;  // Limit suggestions to 5
    }
  }

  if (suggestions.length > 0) {
    return `No exact match found. Suggestions: ${suggestions.join(', ')}`;
  }

  return 'Brand not found';
}

// Provide suggestions for autocomplete
function getBrandSuggestions(input) {
  if (!input) return [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Brand');
  if (!sheet) return [];

  const data = sheet.getDataRange().getValues();
  const matches = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][0].toString().toLowerCase().startsWith(input.toLowerCase())) {
      matches.push(data[i][0]);
      if (matches.length >= 10) break;
    }
  }
  return matches;
}

// Build Google web search URL with "brand eyewear manufacturer" suffix
function buildBrandWebSearchUrl(brandName) {
  if (!brandName) return '';
  const query = `${brandName} eyewear manufacturer`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
