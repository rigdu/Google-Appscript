/**
 * App Script: searchGoogleFromDataSheet
 * 
 * This script iterates through each row in the "Data" sheet and presents a dialog to search Google
 * using the Brand and Model columns for each row.
 */

function searchGoogleFromDataSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  const data = sheet.getDataRange().getValues();
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty("currentRow", 1); // Reset on fresh run

  processNextItem();
}

function processNextItem() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data");
  const data = sheet.getDataRange().getValues();
  const scriptProperties = PropertiesService.getScriptProperties();
  let i = parseInt(scriptProperties.getProperty("currentRow"));

  if (i >= data.length) {
    SpreadsheetApp.getUi().alert("✅ All rows processed.");
    return;
  }

  const brand = data[i][1]; // Column B
  const model = data[i][2]; // Column C

  if (brand && model) {
    const query = `${brand} ${model} frame`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    const htmlContent = `
      <html>
        <body>
          <p><strong>Brand:</strong> ${brand}<br>
             <strong>Model:</strong> ${model}</p>
          <p><a href="${url}" target="_blank">🔍 Click here to search on Google</a></p>
          <button onclick="nextItem()">Next</button>
          <button onclick="google.script.host.close()">Stop</button>
         
          <script>
            function nextItem() {
              google.script.run.withSuccessHandler(() => {
                google.script.host.close();
              }).processNextItem();
            }
          </script>
        </body>
      </html>
    `;

    const ui = HtmlService.createHtmlOutput(htmlContent)
      .setWidth(300)
      .setHeight(200);
    SpreadsheetApp.getUi().showModalDialog(ui, 'Search & Proceed');
  } else {
    scriptProperties.setProperty("currentRow", (i + 1).toString());
    processNextItem(); // Skip blank row
  }

  scriptProperties.setProperty("currentRow", (i + 1).toString());
}
