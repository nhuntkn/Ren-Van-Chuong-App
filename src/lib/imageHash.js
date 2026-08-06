export function computeHashAndColor(img) {
    // Cắt vùng trung tâm (70% kích thước gốc) để loại bớt nền lộ ra ở rìa ảnh,
    // giúp hash và màu trung bình phản ánh đúng hoạ tiết thay vì bị pha loãng bởi nền.
    const cropRatio = 0.7;
    const cropW = img.width * cropRatio;
    const cropH = img.height * cropRatio;
    const cropX = (img.width - cropW) / 2;
    const cropY = (img.height - cropH) / 2;

    const c = document.createElement("canvas");
    c.width = 9;
    c.height = 8;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, 9, 8);
    const data = ctx.getImageData(0, 0, 9, 8).data;

    const gray = [];
    for (let i = 0; i < 9 * 8; i++) {
        const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
        gray.push(0.299 * r + 0.587 * g + 0.114 * b);
    }

    let hash = "";
    for (let row = 0; row < 8; row++) {
        for (let colI = 0; colI < 8; colI++) {
            const left = gray[row * 9 + colI];
            const right = gray[row * 9 + colI + 1];
            hash += left > right ? "1" : "0";
        }
    }

    const c2 = document.createElement("canvas");
    c2.width = 16;
    c2.height = 16;
    const ctx2 = c2.getContext("2d");
    ctx2.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, 16, 16);
    const d2 = ctx2.getImageData(0, 0, 16, 16).data;

    let r = 0, g = 0, b = 0;
    const n = 16 * 16;
    for (let i = 0; i < n; i++) {
        r += d2[i * 4];
        g += d2[i * 4 + 1];
        b += d2[i * 4 + 2];
    }

    return {
        hash,
        avgColor: [Math.round(r / n), Math.round(g / n), Math.round(b / n)],
    };
}

export function resizeToDataURL(img, maxW, quality) {
    const scale = Math.min(1, maxW / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);
    return c.toDataURL("image/jpeg", quality);
}

export function fileToImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = () => {
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}