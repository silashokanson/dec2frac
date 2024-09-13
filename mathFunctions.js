// mathFunctions.js

export function decimalToFraction(decimalStr) {
    decimalStr = decimalStr.replace(/[^0-9\.\-]/g, '');
    console.log(decimalStr)
    let sign = decimalStr[0] === '-' ? BigInt(-1) : BigInt(1);
    if (decimalStr[0] === '-') {
        decimalStr = decimalStr.slice(1);
    }

    let [integerPart, fractionalPart] = decimalStr.includes('.')
        ? decimalStr.split('.')
        : [decimalStr, '0'];

    let numerator = BigInt(fractionalPart);

    fractionalPart = fractionalPart.replace(/[^0-9]/g, '');
    console.log(fractionalPart);
    let denominator = BigInt(10) ** BigInt(fractionalPart.length);

    if (integerPart !== '0') {
        let integerValue = BigInt(integerPart);
        numerator += integerValue * denominator;
    }

    numerator *= sign;

    return [numerator, denominator];
}

export function continuedFraction(numerator, denominator) {
    const cf = [];
    while (denominator !== BigInt(0)) {
        const quotient = numerator / denominator;
        cf.push(quotient);
        [numerator, denominator] = [denominator, numerator % denominator];
    }
    return cf;
}

export function continuedFractionToFraction(cf, nTerms) {
    let num = BigInt(1);
    let denom = cf[nTerms - 1];

    for (let i = nTerms - 2; i >= 0; i--) {
        [num, denom] = [denom, cf[i] * denom + num];
    }

    return [denom, num];
}

function divRoundClosest(n, d) {
    return ((n < BigInt(0)) === (d < BigInt(0)))
        ? (n + d / BigInt(2)) / d
        : (n - d / BigInt(2)) / d;
}

function roundFraction(numer, denom, targetNumer, targetDenom) {
    return divRoundClosest(numer * targetDenom, denom) === targetNumer;
}

function binarySearchCf(cf, targetNumer, targetDenom) {
    let low = BigInt(1);
    let high = BigInt(cf.length);

    while (low < high) {
        const mid = (low + high) / BigInt(2);
        const [numer, denom] = continuedFractionToFraction(cf, Number(mid));

        const scaledNumer = numer * (targetDenom / denom);
        const scaledDenom = denom * (targetDenom / denom);

        if (roundFraction(scaledNumer, scaledDenom, targetNumer, targetDenom)) {
            high = mid;
        } else {
            low = mid + BigInt(1);
        }
    }

    return low;
}

export function simplifyFraction(decimalStr) {
    const [numerator, denominator] = decimalToFraction(decimalStr);
    const cf = continuedFraction(numerator, denominator);
    const nTerms = binarySearchCf(cf, numerator, denominator);
    return continuedFractionToFraction(cf, Number(nTerms));
}

export function dec2frac(decimalStr) {
    const sign = decimalStr[0] === '-' ? '-' : '';
    const [integerPart, fractionalPart] = decimalStr.includes('.')
        ? decimalStr.split('.')
        : [decimalStr, ''];

    const [numer, denom] = simplifyFraction(decimalStr);

    // Convert to mixed fraction if needed
    let integer = numer / denom;
    let fractionNumer = numer % denom;
    let fractionDenom = denom;

    return [integer, fractionNumer, fractionDenom];


}