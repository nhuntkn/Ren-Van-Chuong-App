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
    const score = 1 - (0.6 * (hd / 64) + 0.4 * (Math.min(cd, 441.7) / 441.7));
    return Math.round(Math.max(0, Math.min(1, score)) * 100);
}