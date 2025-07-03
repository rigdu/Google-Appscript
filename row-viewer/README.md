# Row Viewer Google Apps Script

A Google Apps Script project for Google Sheets that provides a sidebar to view and highlight any row, selecting columns by range or list.

## Features

- **Custom Sidebar UI:** Quickly view and highlight any row in your sheet.
- **Flexible Columns:** Choose columns by range (`A:O`) or list (`A,B,C`).
- **Remembers Last Row:** Remembers your last selected row for convenience.
- **Highlighting:** Highlights the selected row in yellow; clears highlight on reset.
- **Modern UI:** User-friendly and styled with a clean look.

## How to Use

1. **Copy Files:**  
   Place `Code.gs` and `Sidebar.html` in your repo under `google-appscript-row-viewer/` for version control and sharing.

2. **Add to Google Apps Script:**
   - Open your Google Sheet.
   - Go to `Extensions > Apps Script`.
   - Copy the code from `Code.gs` into the Script Editor.
   - Create a new HTML file named `Sidebar` and paste in `Sidebar.html`.

3. **Try It:**
   - Reload your Google Sheet.
   - Use the custom **Row Viewer** menu to open the sidebar.

4. **Usage:**
   - Enter a row number (e.g., 15) and columns (e.g., `A:O` or `A,C,E`) to view data.
   - Click **Go** to view and highlight; **Reset** to clear.

---

**Keep this folder in your repo for backup, sharing, and collaboration!**
