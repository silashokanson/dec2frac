// mathFunctions.js

export function decimalToFraction(decimalStr) {
    let sign = decimalStr[0] === '-' ? -1 : 1;
    if (decimalStr[0] === '-') {
        decimalStr = decimalStr.slice(1);
    }

    let [integerPart, fractionalPart] = decimalStr.includes('.')
        ? decimalStr.split('.')
        : [decimalStr, '0'];

    let numerator = parseInt(fractionalPart, 10);
    let denominator = Math.pow(10, fractionalPart.length);

    if (integerPart !== '0') {
        let integerValue = parseInt(integerPart, 10);
        numerator += integerValue * denominator;
    }

    numerator *= sign;

    return [numerator, denominator];
}

export function continuedFraction(numerator, denominator) {
    const cf = [];
    while (denominator !== 0) {
        const quotient = Math.floor(numerator / denominator);
        cf.push(quotient);
        [numerator, denominator] = [denominator, numerator % denominator];
    }
    return cf;
}

export function continuedFractionToFraction(cf, nTerms) {
    let num = 1;
    let denom = cf[nTerms - 1];

    for (let i = nTerms - 2; i >= 0; i--) {
        [num, denom] = [denom, cf[i] * denom + num];
    }

    return [denom, num];
}

function divRoundClosest(n, d) {
    return ((n < 0) === (d < 0))
        ? Math.floor((n + Math.floor(d / 2)) / d)
        : Math.floor((n - Math.floor(d / 2)) / d);
}

function roundFraction(numer, denom, targetNumer, targetDenom) {
    return divRoundClosest(numer * targetDenom, denom) === targetNumer;
}

function binarySearchCf(cf, targetNumer, targetDenom) {
    let low = 1;
    let high = cf.length;

    while (low < high) {
        const mid = Math.floor((low + high) / 2);
        const [numer, denom] = continuedFractionToFraction(cf, mid);

        const scaledNumer = numer * Math.floor(targetDenom / denom);
        const scaledDenom = denom * Math.floor(targetDenom / denom);

        if (roundFraction(scaledNumer, scaledDenom, targetNumer, targetDenom)) {
            high = mid;
        } else {
            low = mid + 1;
        }
    }

    return low;
}

export function simplifyFraction(decimalStr) {
    const [numerator, denominator] = decimalToFraction(decimalStr);
    const cf = continuedFraction(numerator, denominator);
    const nTerms = binarySearchCf(cf, numerator, denominator);
    return continuedFractionToFraction(cf, nTerms);
}

export function prettyPrintResult(decimalStr) {
    const sign = decimalStr[0] === '-' ? '-' : '';
    const [integerPart, fractionalPart] = decimalStr.includes('.')
        ? decimalStr.split('.')
        : [decimalStr, ''];

    const [numer, denom] = simplifyFraction(decimalStr);

    // Convert to mixed fraction if needed
    let integer = Math.floor(numer / denom);
    let fractionNumer = numer % denom;
    let fractionDenom = denom;

    // Build the result string
    let result = sign;
    if (integer !== 0 || (fractionNumer === 0 && integer === 0)) {
        result += integer;
    }
    if (fractionNumer !== 0) {
        if (integer !== 0){
	    result += ` + `;
	}
        result += `${fractionNumer}/${fractionDenom}`;
    }

    return result.trim()
}
