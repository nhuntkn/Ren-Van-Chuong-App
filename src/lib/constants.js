export const CATEGORIES = [
    "Tất cả",
    "Cotton",
    "Ren kate",
    "Ren chỉ bóng",
    "Ren chỉ xốp",
    "Ren không giãn",
    "Ren thun",
    "Ren mi",
    "Ren lưới",
    "Ren thêu",
];

export const UNITS = ["kg", "mét", "cuộn"];

export const CONTAINER_TYPES = [
    { value: "single", label: "1 mẫu" },
    { value: "mixed", label: "Hàng lẻ (nhiều mẫu)" },
];

export const STOCK_STATUS_THRESHOLD = {
    low: 2, //dưới ngưỡng này (theo đơn vị của mẫu) coi là "sắp hết"
};

export function getStockStatus(totalStock) {
    if (totalStock === 0) return "out";
    if (totalStock <= STOCK_STATUS_THRESHOLD.low) return "low";
    return "ok";
}