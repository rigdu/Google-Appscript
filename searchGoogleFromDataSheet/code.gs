function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Custom Tools')
    .addItem('Brand Licensor Search', 'showBrandSearchSidebar')
    .addItem('Image Search', 'showImageSearchSidebar')
    .addToUi();
}

function showBrandSearchSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('BrandSidebar')
    .setTitle('Brand Licensor Search');
  SpreadsheetApp.getUi().showSidebar(html);
}

function showImageSearchSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('ImageSidebar')
    .setTitle('Image Search');
  SpreadsheetApp.getUi().showSidebar(html);
}
