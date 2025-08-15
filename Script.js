// ====================================================================================
// JavaScript functions adapted from the Python code
// ====================================================================================

function toDecimal(number, base) {
    let decimalValue = 0;
    const digits = String(number).toUpperCase().split('').reverse();
    const digitsMap = "0123456789ABCDEF";

    for (let i = 0; i < digits.length; i++) {
        let digit = digits[i];
        let value;
        if (base === 16 && 'A' <= digit && digit <= 'F') {
            value = digitsMap.indexOf(digit);
        } else {
            value = parseInt(digit);
        }
        if (isNaN(value) || value >= base) {
            return null; // Invalid digit for the base
        }
        decimalValue += value * Math.pow(base, i);
    }
    return decimalValue;
}

function fromDecimal(number, base, padToBits = null) {
    if (number === 0) {
        return (padToBits && base === 2) ? '0'.repeat(padToBits) : "0";
    }

    const digitsMap = "0123456789ABCDEF";
    let convertedNumber = "";
    let currentNumber = number;

    while (currentNumber > 0) {
        let remainder = currentNumber % base;
        convertedNumber = digitsMap[remainder] + convertedNumber;
        currentNumber = Math.floor(currentNumber / base);
    }

    if (padToBits && base === 2) {
        return convertedNumber.padStart(padToBits, '0');
    }

    return convertedNumber;
}

// ====================================================================================
// UI and Event Handlers
// ====================================================================================

const langData = {
    en: {
        title: 'Base Converter',
        labelNumber: 'Enter a number:',
        labelFromBase: 'Source Base:',
        convertBtn: 'Convert',
        outputTitle: 'Results:',
        explanationTitle: 'Detailed Explanation',
        copySuccess: 'Copied to clipboard!',
        copyFail: 'Could not copy.',
        shareText: 'Check out this base conversion: ',
        shareSubject: 'Base Conversion Result',
        shareBody: 'Here is the conversion result: ',
        invalidNumber: 'Invalid number. Please check the digits for the selected base.',
        binary: 'Binary',
        octal: 'Octal',
        decimal: 'Decimal',
        hex: 'Hex',
        // Detailed explanation strings
        expToDecTitle: (num, base) => `✨ Converting '${num}' from base ${base} to decimal (base 10) ✨`,
        expToDecBody: (digit, pos, value, base, term) => `  Digit '${digit}' at position ${pos}: ${value} * (${base}^${pos}) = ${term}`,
        expFinalSum: (sum) => `  Final Sum: ${sum}`,
        expFromDecTitle: (num, base) => `✨ Converting '${num}' from decimal (base 10) to base ${base} ✨`,
        expFromDecBody: (current, base, next, rem, remDigit) => `  ${current} / ${base} = ${next} with a remainder of ${rem} (${remDigit})`,
        expReadRemainders: (result) => `  Reading remainders from bottom to top: ${result}`,
        expPaddedBinary: (result) => `  Padded to 8 bits: ${result}`,
    },
    he: {
        title: 'ממיר בסיסים',
        labelNumber: 'הכנס מספר:',
        labelFromBase: 'בסיס מקור:',
        convertBtn: 'המר',
        outputTitle: 'תוצאות:',
        explanationTitle: 'הסבר מפורט',
        copySuccess: 'הועתק ללוח!',
        copyFail: 'העתקה נכשלה.',
        shareText: 'בדיקת המרת בסיס: ',
        shareSubject: 'תוצאת המרת בסיס',
        shareBody: 'הנה תוצאת ההמרה: ',
        invalidNumber: 'מספר לא חוקי. אנא בדוק את הספרות עבור הבסיס שנבחר.',
        binary: 'בינארי',
        octal: 'אוקטלי',
        decimal: 'עשרוני',
        hex: 'הקסדצימלי',
        // Detailed explanation strings
        expToDecTitle: (num, base) => `✨ המרת '${num}' מבסיס ${base} לבסיס עשרוני (10) ✨`,
        expToDecBody: (digit, pos, value, base, term) => `  הספרה '${digit}' במיקום ${pos}: ${value} * (${base}^${pos}) = ${term}`,
        expFinalSum: (sum) => `  סיכום סופי: ${sum}`,
        expFromDecTitle: (num, base) => `✨ המרת '${num}' מבסיס עשרוני (10) לבסיס ${base} ✨`,
        expFromDecBody: (current, base, next, rem, remDigit) => `  ${current} / ${base} = ${next} עם שארית ${rem} (${remDigit})`,
        expReadRemainders: (result) => `  קריאת השאריות מלמטה למעלה: ${result}`,
        expPaddedBinary: (result) => `  מרופד ל-8 ביטים: ${result}`,
    }
};

let currentLang = 'en';

function updateUI() {
    const data = langData[currentLang];
    document.title = data.title;
    document.querySelector('h1').textContent = data.title;
    document.getElementById('label-number').textContent = data.labelNumber;
    document.getElementById('label-from-base').textContent = data.labelFromBase;
    document.getElementById('convert-btn').textContent = data.convertBtn;
    document.getElementById('output-title').textContent = data.outputTitle;
    document.getElementById('explanation-title').textContent = data.explanationTitle;
    document.querySelector('.exp-btn[data-base="2"]').textContent = data.binary;
    document.querySelector('.exp-btn[data-base="8"]').textContent = data.octal;
    document.querySelector('.exp-btn[data-base="10"]').textContent = data.decimal;
    document.querySelector('.exp-btn[data-base="16"]').textContent = data.hex;

    // Check for Hebrew to set text direction
    if (currentLang === 'he') {
        document.body.style.direction = 'rtl';
    } else {
        document.body.style.direction = 'ltr';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    document.getElementById('convert-btn').addEventListener('click', handleConversion);
    document.getElementById('clear-btn').addEventListener('click', clearAll);
    document.getElementById('copy-btn').addEventListener('click', copyResults);
    document.getElementById('share-btn').addEventListener('click', shareResults);

    document.getElementById('lang-en').addEventListener('click', () => {
        currentLang = 'en';
        updateUI();
        document.getElementById('lang-en').classList.add('active');
        document.getElementById('lang-he').classList.remove('active');
    });

    document.getElementById('lang-he').addEventListener('click', () => {
        currentLang = 'he';
        updateUI();
        document.getElementById('lang-he').classList.add('active');
        document.getElementById('lang-en').classList.remove('active');
    });

    document.getElementById('small-text').addEventListener('click', () => {
        document.getElementById('results').style.fontSize = '0.9em';
        document.getElementById('explanation-content').style.fontSize = '0.9em';
        updateTextSizeButtons('small-text');
    });

    document.getElementById('medium-text').addEventListener('click', () => {
        document.getElementById('results').style.fontSize = '1em';
        document.getElementById('explanation-content').style.fontSize = '1em';
        updateTextSizeButtons('medium-text');
    });

    document.getElementById('large-text').addEventListener('click', () => {
        document.getElementById('results').style.fontSize = '1.2em';
        document.getElementById('explanation-content').style.fontSize = '1.2em';
        updateTextSizeButtons('large-text');
    });

    document.querySelectorAll('.exp-btn').forEach(button => {
        button.addEventListener('click', handleExplanation);
    });
});

function updateTextSizeButtons(activeId) {
    document.querySelectorAll('.text-size-options button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

function handleConversion() {
    const inputNumber = document.getElementById('input-number').value.trim();
    const fromBase = parseInt(document.getElementById('from-base').value);
    const resultsDiv = document.getElementById('results');
    const explanationSection = document.querySelector('.explanation-section');

    if (!validateInput(inputNumber, fromBase)) {
        resultsDiv.textContent = langData[currentLang].invalidNumber;
        explanationSection.style.display = 'none';
        return;
    }

    let decimalValue;
    if (fromBase === 10) {
        decimalValue = parseInt(inputNumber);
    } else {
        decimalValue = toDecimal(inputNumber, fromBase);
    }

    if (decimalValue === null) {
        resultsDiv.textContent = langData[currentLang].invalidNumber;
        explanationSection.style.display = 'none';
        return;
    }

    const binary = fromDecimal(decimalValue, 2, 8);
    const octal = fromDecimal(decimalValue, 8);
    const hex = fromDecimal(decimalValue, 16);

    const output = `
  Decimal: ${decimalValue}
  Binary:  ${binary}
  Octal:   ${octal}
  Hex:     ${hex}
    `;

    resultsDiv.textContent = output;
    explanationSection.style.display = 'block';
}

function validateInput(number, base) {
    if (!number) return false;

    switch (base) {
        case 2:
            return /^[01]+$/.test(number);
        case 8:
            return /^[0-7]+$/.test(number);
        case 10:
            return /^[0-9]+$/.test(number);
        case 16:
            return /^[0-9A-Fa-f]+$/.test(number);
        default:
            return false;
    }
}

function handleExplanation(event) {
    const toBase = parseInt(event.target.dataset.base);
    const inputNumber = document.getElementById('input-number').value.trim();
    const fromBase = parseInt(document.getElementById('from-base').value);
    const explanationContent = document.getElementById('explanation-content');
    explanationContent.innerHTML = '';
    
    if (!validateInput(inputNumber, fromBase)) {
        explanationContent.textContent = langData[currentLang].invalidNumber;
        return;
    }

    let decimalValue;
    if (fromBase === 10) {
        decimalValue = parseInt(inputNumber);
    } else {
        decimalValue = toDecimal(inputNumber, fromBase);
    }

    if (decimalValue === null) {
        explanationContent.textContent = langData[currentLang].invalidNumber;
        return;
    }

    let explanationHTML = '';
    const data = langData[currentLang];

    // Step 1: To Decimal
    if (fromBase !== 10) {
        explanationHTML += `<h4>${data.expToDecTitle(inputNumber, fromBase)}</h4>`;
        const digits = String(inputNumber).toUpperCase().split('').reverse();
        let sum = 0;
        const digitsMap = "0123456789ABCDEF";

        for (let i = 0; i < digits.length; i++) {
            const digit = digits[i];
            let value;
            if (fromBase === 16 && 'A' <= digit && digit <= 'F') {
                value = digitsMap.indexOf(digit);
            } else {
                value = parseInt(digit);
            }
            const term = value * Math.pow(fromBase, i);
            sum += term;
            explanationHTML += `<p>${data.expToDecBody(digit, i, value, fromBase, term)}</p>`;
        }
        explanationHTML += `<p><b>${data.expFinalSum(sum)}</b></p>`;
    }

    // Step 2: From Decimal
    if (toBase !== 10) {
        const digitsMap = "0123456789ABCDEF";
        explanationHTML += `<h4>${data.expFromDecTitle(decimalValue, toBase)}</h4>`;
        
        let currentNumber = decimalValue;
        let convertedNumber = "";
        let steps = [];

        while (currentNumber > 0) {
            const remainder = currentNumber % toBase;
            const nextNumber = Math.floor(currentNumber / toBase);
            steps.push({ current: currentNumber, next: nextNumber, remainder: remainder });
            currentNumber = nextNumber;
        }

        // Display steps in correct order
        for(let i = steps.length - 1; i >= 0; i--) {
            const step = steps[i];
            explanationHTML += `<p>${data.expFromDecBody(step.current, toBase, step.next, step.remainder, digitsMap[step.remainder])}</p>`;
            convertedNumber = digitsMap[step.remainder] + convertedNumber;
        }

        explanationHTML += `<p><b>${data.expReadRemainders(convertedNumber)}</b></p>`;
        if (toBase === 2) {
            explanationHTML += `<p><b>${data.expPaddedBinary(fromDecimal(decimalValue, 2, 8))}</b></p>`;
        }
    }
    
    // Handle special case where from_base and to_base are the same
    if (fromBase === toBase) {
        explanationHTML = `<p>${langData[currentLang].outputTitle} ${inputNumber} (${fromBase}) is already in the target base.</p>`;
    }

    explanationContent.innerHTML = explanationHTML;
}

function clearAll() {
    document.getElementById('input-number').value = '';
    document.getElementById('results').textContent = '';
    document.getElementById('explanation-content').innerHTML = '';
    document.querySelector('.explanation-section').style.display = 'none';
}

function copyResults() {
    const resultsText = document.getElementById('results').textContent;
    if (resultsText) {
        navigator.clipboard.writeText(resultsText)
            .then(() => alert(langData[currentLang].copySuccess))
            .catch(() => alert(langData[currentLang].copyFail));
    }
}

function shareResults() {
    const resultsText = document.getElementById('results').textContent;
    if (resultsText) {
        const shareTitle = langData[currentLang].shareSubject;
        const shareBody = langData[currentLang].shareBody + resultsText;

        // Try using the Web Share API first
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareBody,
            }).catch((error) => console.log('Error sharing', error));
        } else {
            // Fallback for browsers that don't support Web Share API
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareBody)}`;
            const mailtoUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareBody)}`;
            
            if (confirm("Choose sharing option:\nOK for WhatsApp, Cancel for Email")) {
                window.open(whatsappUrl, '_blank');
            } else {
                window.open(mailtoUrl, '_blank');
            }
        }
    }
}

