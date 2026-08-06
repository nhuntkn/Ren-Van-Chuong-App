export function hammingDistance(hashA, hashB) {
    let d = 0;
    for (let i = 0; i < hashA.length; i++) {
        if (hashA[i] !== hashB[i]) d++;
    }
    return d;
}

export function colorDistance(colorA, colorB) {
    return Math.sqrt(
        (colorA[0] - colorB[0]) ** 2 +
        (colorA[1] - colorB[1]) ** 2 +
        (colorA[2] - colorB[2]) ** 2
    );
}

export function similarityPercent(featureA, featureB) {
    const hd = hammingDistance(featureA.hash, featureB.hash);
    const cd = colorDistance(featureA.avgColor, featureB.avgColor);

    const hashScore = 1 - hd / featureA.hash.length;
    const colorScore = 1 - Math.min(cd, 441.7) / 441.7;

    // Cân bằng lại: hoạ tiết vẫn là yếu tố chính (0.5), màu hỗ trợ phân biệt (0.5)
    // — vì giờ màu đã được tính trên vùng đã crop, không còn bị nền pha loãng nữa.
    let score = 0.5 * hashScore + 0.5 * colorScore;

    if (cd > 90) {
        score = Math.min(score, 0.5);
    }

    return Math.round(Math.max(0, Math.min(1, score)) * 100);
}