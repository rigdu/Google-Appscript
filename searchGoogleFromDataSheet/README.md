# Google Apps Script: Search/Highlight Sidebar

A Google Apps Script solution for searching Google (or images) by row data, with a sidebar HTML UI for your Google Sheet.

## Features

- Enter a row number and instantly search Google using Brand, Model, and Color from that row.
- Quick navigation: Next/Previous row with a click.
- Highlight the current row in your spreadsheet.
- User-friendly sidebar interface.

## How to Use

1. **Copy Code**:  
   Place `searchGoogleFromDataSheet.js` and `sidebar.html` in your repo’s `google-appscript/` folder for version control and sharing.

2. **Add to Google Apps Script**:
   - In your Google Sheet, go to `Extensions > Apps Script`.
   - Copy the code from `searchGoogleFromDataSheet.js` into the Script Editor.
   - Create a new HTML file in Apps Script, name it `sidebar.html`, and paste in the sidebar HTML.

3. **Deploy**:
   - In Apps Script, use `SpreadsheetApp.getUi().showSidebar(HtmlService.createHtmlOutputFromFile('sidebar'))` to launch the sidebar.

4. **Customize**:
   - Adjust columns, search logic, or UI as needed for your sheet.

---

**This repo folder keeps your backend logic and UI versioned and easy to share or update!**
