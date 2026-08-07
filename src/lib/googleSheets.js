import { google } from "googleapis";

function getSheetsClient() {
    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
}

const ITEM_HEADER = [
    "Mã", "Tên", "Loại", "Màu", "Khổ",
    "Giá nhập", "Giá sỉ", "Giá lẻ", "Nhà cung cấp",
    "Vị trí kho", "Trạng thái",
];

const CUSTOMER_HEADER = [
    "Tên", "SĐT", "Địa chỉ", "Loại khách", "Nghề nghiệp", "Ghi chú", "Mua lần cuối",
];

const MOVEMENT_HEADER = ["Ngày", "Mã", "Loại", "Số lượng", "Ghi chú"];

async function overwriteSheet(spreadsheetId, sheetName, header, rows) {
    if (!spreadsheetId) return;
    try {
        const sheets = getSheetsClient();
        const values = [header, ...rows];

        await sheets.spreadsheets.values.clear({ spreadsheetId, range: sheetName });
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
        });
    } catch (err) {
        console.error(`Lỗi đồng bộ sheet "${sheetName}":`, err.message);
    }
}

export async function syncItemsToSheet(rows) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID_ITEMS;
    await overwriteSheet(spreadsheetId, "Sheet1", ITEM_HEADER, rows.map((r) => [
        r.code, r.name, r.category, r.color, r.width,
        r.costPrice, r.wholesalePrice, r.price, r.supplier,
        r.location, r.status,
    ]));
}

export async function syncCustomersToSheet(rows) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID_CUSTOMERS;
    await overwriteSheet(spreadsheetId, "Sheet1", CUSTOMER_HEADER, rows.map((r) => [
        r.name, r.phone, r.address, r.customerType, r.occupation, r.note,
        r.lastPurchaseAt ? new Date(r.lastPurchaseAt).toLocaleDateString("vi-VN") : "",
    ]));
}

export async function appendMovementToSheet(row) {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID_MOVEMENTS;
    if (!spreadsheetId) return;
    try {
        const sheets = getSheetsClient();

        const existing = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: "Sheet1!A1:A1",
        });
        if (!existing.data.values || existing.data.values.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: "Sheet1!A1",
                valueInputOption: "USER_ENTERED",
                requestBody: { values: [MOVEMENT_HEADER] },
            });
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1!A1",
            valueInputOption: "USER_ENTERED",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values: [row] },
        });
    } catch (err) {
        console.error("Lỗi ghi log Nhập/Xuất lên Google Sheets:", err.message);
    }
}