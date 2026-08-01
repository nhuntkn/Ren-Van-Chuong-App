export const CATEGORIES = [
    "Tất cả",
    "Ren cotton",
    "Ren kate",
    "Ren chỉ bóng",
    "Ren chỉ xốp",
    "Ren không giãn",
    "Ren thun",
    "Ren mi",
    "Ren lưới",
    "Ren thêu",
    "Thun pháp",
    
];

export const UNITS = ["kg", "mét", "cuộn", "bành", "dây", "tép"];

export const CATEGORY_CODE_PREFIXES = {
    "Ren cotton": "RC",
    "Ren lưới": "RL",
    "Ruy băng": "RB",
    "Nút": "NU",
    "Khóa kéo": "KK",
    "Vải lót": "VL",
    "Chỉ": "CH",
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