import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "db";
await fs.mkdir(outputDir, { recursive: true });

const workbook = Workbook.create();
const dashboard = workbook.worksheets.add("Dashboard");
const db = workbook.worksheets.add("db");

dashboard.showGridLines = false;
db.showGridLines = false;
dashboard.tabColor = "#003E70";
db.tabColor = "#55A9D6";

dashboard.getRange("A2:F2").merge();
dashboard.getRange("A2").values = [["SharkPark Parking Monitor"]];
dashboard.getRange("A3:F3").merge();
dashboard.getRange("A3").values = [["Live summary based on the parking observations in the db sheet"]];
dashboard.getRange("A5:B5").values = [["Metric", "Value"]];
dashboard.getRange("A6:A10").values = [
  ["Total observations"],
  ["Available spaces"],
  ["Occupied spaces"],
  ["Availability rate"],
  ["Last update"]
];
dashboard.getRange("B6:B10").formulas = [
  ["=COUNTA(db!A2:A501)"],
  ["=COUNTIF(db!C2:C501,\"Spot_Available\")"],
  ["=COUNTIF(db!C2:C501,\"Spot_Occupied\")"],
  ["=IFERROR(B7/B6,0)"],
  ["=MAX(db!B2:B501)"]
];
dashboard.getRange("D5:F5").values = [["Parking zone", "Available", "Occupied"]];
const zones = ["Lot 1 - North", "Lot 2 - South", "Lot 3 - East"];
dashboard.getRange("D6:D8").values = zones.map(zone => [zone]);
dashboard.getRange("E6:E8").formulas = zones.map((_, i) => [`=COUNTIFS(db!$A$2:$A$501,D${i + 6},db!$C$2:$C$501,\"Spot_Available\")`]);
dashboard.getRange("F6:F8").formulas = zones.map((_, i) => [`=COUNTIFS(db!$A$2:$A$501,D${i + 6},db!$C$2:$C$501,\"Spot_Occupied\")`]);
dashboard.getRange("A13:F13").merge();
dashboard.getRange("A13").values = [["How to use this file"]];
dashboard.getRange("A14:F16").merge();
dashboard.getRange("A14").values = [["Add a new row in the db sheet for every parking-space scan. Use one of the listed parking zones and one of the two prediction labels. Upload this .xlsx file to Google Drive and open it with Google Sheets. Publish the db sheet as CSV when you are ready to connect the web app."]];

db.getRange("A1:E1").values = [["Parking_Zone", "Date_Time", "Predicted_Class", "Confidence_Score", "Record_ID"]];
db.getRange("A2:E7").values = [
  ["Lot 1 - North", new Date("2026-09-19T08:21:00"), "Spot_Occupied", 0.98, "SP-001"],
  ["Lot 3 - East", new Date("2026-09-19T08:25:00"), "Spot_Available", 0.95, "SP-002"],
  ["Lot 2 - South", new Date("2026-09-19T08:27:00"), "Spot_Occupied", 0.92, "SP-003"],
  ["Lot 1 - North", new Date("2026-09-19T08:29:00"), "Spot_Available", 0.91, "SP-004"],
  ["Lot 3 - East", new Date("2026-09-19T08:31:00"), "Spot_Available", 0.96, "SP-005"],
  ["Lot 2 - South", new Date("2026-09-19T08:34:00"), "Spot_Occupied", 0.94, "SP-006"]
];
db.getRange("A2:A501").dataValidation = { rule: { type: "list", values: zones } };
db.getRange("C2:C501").dataValidation = { rule: { type: "list", values: ["Spot_Available", "Spot_Occupied"] } };
db.getRange("B2:B501").format.numberFormat = "mm/dd/yy h:mm AM/PM";
db.getRange("D2:D501").format.numberFormat = "0%";
db.getRange("A1:E7").format.borders = { preset: "outside", style: "thin", color: "#C7D7E2" };
db.getRange("A1:E1").format = { fill: "#003E70", font: { name: "Arial", bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center" };
db.getRange("A2:E501").format = { font: { name: "Arial", size: 10 }, verticalAlignment: "center" };
db.freezePanes.freezeRows(1);

dashboard.getRange("A2:F2").format = { font: { name: "Arial", size: 16, bold: true, color: "#003E70" }, verticalAlignment: "center" };
dashboard.getRange("A3:F3").format = { font: { name: "Arial", size: 10, italic: true, color: "#62788B" } };
dashboard.getRange("A5:B5").format = { fill: "#003E70", font: { name: "Arial", bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
dashboard.getRange("D5:F5").format = { fill: "#138A61", font: { name: "Arial", bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
dashboard.getRange("A6:B10").format.borders = { preset: "outside", style: "thin", color: "#C7D7E2" };
dashboard.getRange("D6:F8").format.borders = { preset: "outside", style: "thin", color: "#C7D7E2" };
dashboard.getRange("B9").format.numberFormat = "0%";
dashboard.getRange("B10").format.numberFormat = "mm/dd/yy h:mm AM/PM";
dashboard.getRange("A13:F13").format = { fill: "#E2F3FC", font: { name: "Arial", bold: true, color: "#003E70" } };
dashboard.getRange("A14:F16").format = { font: { name: "Arial", size: 10, color: "#354D62" }, wrapText: true, verticalAlignment: "top" };
dashboard.getRange("A1:F16").format.font = { name: "Arial", size: 10 };
dashboard.getRange("A:A").format.columnWidth = 24;
dashboard.getRange("B:B").format.columnWidth = 18;
dashboard.getRange("C:C").format.columnWidth = 4;
dashboard.getRange("D:D").format.columnWidth = 22;
dashboard.getRange("E:F").format.columnWidth = 14;
dashboard.getRange("A2").format.rowHeight = 28;
dashboard.getRange("A14").format.rowHeight = 60;
db.getRange("A:A").format.columnWidth = 22;
db.getRange("B:B").format.columnWidth = 21;
db.getRange("C:C").format.columnWidth = 20;
db.getRange("D:D").format.columnWidth = 18;
db.getRange("E:E").format.columnWidth = 14;

workbook.recalculate();
const check = await workbook.inspect({ kind: "table", range: "Dashboard!A5:F16", include: "values,formulas", tableMaxRows: 20, tableMaxCols: 8 });
console.log(check.ndjson);
const errors = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!", options: { useRegex: true, maxResults: 50 }, summary: "formula error scan" });
console.log(errors.ndjson);
const preview = await workbook.render({ sheetName: "Dashboard", range: "A1:F16", scale: 1.5, format: "png" });
await fs.writeFile(`${outputDir}/db-preview.png`, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(`${outputDir}/db.xlsx`);
