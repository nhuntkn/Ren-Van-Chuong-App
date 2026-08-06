import QRCode from "qrcode";

const ID_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // bỏ 0/O, 1/I/L để tránh đọc nhầm

export function generateContainerId() {
    let code = "";
    for (let i = 0; i < 5; i++) {
        code += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)];
    }
    return `B${code}`;
}

export async function generateQrDataUrl(containerId) {
    const url = `https://renvannchuong-app.vn/vat-chua/${containerId}`;
    return await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: "#2B2620", light: "#FFFFFF" },
    });
}