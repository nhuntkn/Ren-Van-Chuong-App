export const CATEGORIES = [
    "Ren cotton",
    "Ren kate",
    "Ren chỉ bóng",
    "Ren chỉ xốp",
    "Ren không giãn",
    "Ren thun khổ lớn",
    "Ren thun khổ nhỏ",
    "Ren mi tấm",
    "Ren mi nhỏ",
    "Ren lưới",
    "Ren thêu",
    "Thun pháp",
    "Khác"
];

export const UNITS = ["kg", "mét", "cuộn", "bành", "dây", "tép"];

export const CATEGORY_CODE_PREFIXES = {
    "Ren cotton": "COT",
    "Ren lưới": "LUOI",
    "Ren kate": "KT",
    "Ren chỉ bóng ": "CHB",
    "Ren chỉ xốp": "CHX",
    "Ren không giãn": "CU",
    "Ren thun khổ lớn": "THUL",
    "Ren thun khổ nhỏ": "THUN",
    "Ren mi tấm": "MIT",
    "Ren mi nhỏ": "MIN",
    "Ren thêu": "THEU",
    "Thun pháp": "PHAP",
    "Khác": "KH",
};

export const CONTAINER_TYPES = [
    { value: "single", label: "1 mẫu" },
    { value: "mixed", label: "Hàng lẻ (nhiều mẫu)" },
];

export function getDisplayName(item) {
    return item.name?.trim() || item.itemCode;
}

export const STOCK_STATUS_THRESHOLD = {
    low: 2, //dưới ngưỡng này (theo đơn vị của mẫu) coi là "sắp hết"
};

export function getStockStatus(totalStock) {
    if (totalStock === 0) return "out";
    if (totalStock <= STOCK_STATUS_THRESHOLD.low) return "low";
    return "ok";
}