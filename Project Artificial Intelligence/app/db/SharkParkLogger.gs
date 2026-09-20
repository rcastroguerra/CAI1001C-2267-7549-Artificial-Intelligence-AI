const SHEET_NAME = 'Sheet1';
const IMAGE_FOLDER = 'SharkPark Images';
const HEADERS = ['Zone', 'Bay_Number', 'Status', 'Confidence_Score', 'Last_Updated', 'Image_Sample'];

function doPost(e) {
  const record = JSON.parse(e.postData.contents || '{}');
  const sheet = getSheet_();
  const imageUrl = saveImage_(record);
  sheet.appendRow([
    record.zone,
    record.bayNumber,
    record.status,
    record.confidenceScore,
    new Date(),
    imageUrl
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" was not found.`);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function saveImage_(record) {
  const folder = DriveApp.getFoldersByName(IMAGE_FOLDER).hasNext()
    ? DriveApp.getFoldersByName(IMAGE_FOLDER).next()
    : DriveApp.createFolder(IMAGE_FOLDER);
  const blob = Utilities.newBlob(
    Utilities.base64Decode(record.imageData),
    record.imageType || 'image/jpeg',
    `SharkPark_${record.bayNumber}_${Date.now()}.jpg`
  );
  return folder.createFile(blob).getUrl();
}
