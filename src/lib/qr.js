import QRCode from "qrcode";

export async function generateQrDataUrl(containerId) {
    const url = `https://renvannchuong-app.vn/vat-chua/${containerId}`;
    return await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: "#2B2620", light: "#FFFFFF"},
    });
}

export function generateContainerId() {
    return "bag-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
}