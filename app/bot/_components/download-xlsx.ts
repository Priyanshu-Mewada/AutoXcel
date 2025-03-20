 import * as XLSX from 'xlsx'
 import { saveAs } from "file-saver";
 import { v4 as uuidv4 } from "uuid";
export const downloadExcel = (excelData : Record<string , any>[]) => {
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate and save the file
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${uuidv4()}.xlsx`);
  };