// ====================================================================================
// JavaScript functions adapted from the Python code
// ====================================================================================

/**
 * Converts a number from a given base to decimal (base 10).
 * @param {string} number - The number to convert.
 * @param {number} base - The source base (2, 8, 10, or 16).
 * @returns {number|null} The decimal value or null if the input is invalid.
 */
function toDecimal(number, base) {
    let decimalValue = 0;
    // Reverse the digits to process from right to left
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
        // Check for invalid digits for the given base
        if (isNaN(value) || value >= base) {
            return null;
        }
        decimalValue += value * Math.pow(base, i);
    }
    return decimalValue;
}

/**
 * Converts a decimal number to a specified base.
 * @param {number} number - The decimal number to convert.
 * @param {number} base - The target base (2, 8, or 16).
 * @param {number|null} padToBits - Optional parameter to pad binary results with leading zeros.
 * @returns {string} The converted number as a string.
 */
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

    // Pad binary results if specified
    if (padToBits && base === 2) {
        return convertedNumber.padStart(padToBits, '0');
    }

    return convertedNumber;
}

// ====================================================================================
// UI and Event Handlers
// ====================================================================================

// Object to store all multilingual text strings
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

/**
 * Updates all UI text based on the current language setting.
 */
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

    // Show/hide usage instructions text based on language
    if (currentLang === 'he') {
        document.body.style.direction = 'rtl';
        document.getElementById('usage-text-he').style.display = 'block';
        document.getElementById('usage-text-en').style.display = 'none';
    } else {
        document.body.style.direction = 'ltr';
        document.getElementById('usage-text-he').style.display = 'none';
        document.getElementById('usage-text-en').style.display = 'block';
    }
}

// Attach event listeners when the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // Event listener for the "Convert" button
    document.getElementById('convert-btn').addEventListener('click', handleConversion);
    // Event listener for the "Clear" button
    document.getElementById('clear-btn').addEventListener('click', clearAll);
    // Event listener for the "Copy" button
    document.getElementById('copy-btn').addEventListener('click', copyResults);

    // Event listeners for language buttons
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

    // Event listeners for text size buttons
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

    // Event listeners for explanation buttons
    document.querySelectorAll('.exp-btn').forEach(button => {
        button.addEventListener('click', handleExplanation);
    });

    // Event listener for the new collapsible usage section
    const usageToggle = document.getElementById('usage-toggle');
    const usageContent = document.getElementById('usage-content');
    
    usageToggle.addEventListener('click', () => {
        const isOpen = usageContent.classList.toggle('open');
        usageToggle.classList.toggle('open', isOpen);
    });
});

/**
 * Updates the active class on the text size buttons.
 * @param {string} activeId - The ID of the button to set as active.
 */
function updateTextSizeButtons(activeId) {
    document.querySelectorAll('.text-size-options button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

/**
 * Handles the main conversion process.
 */
function handleConversion() {
    const inputNumber = document.getElementById('input-number').value.trim();
    const fromBase = parseInt(document.getElementById('from-base').value);
    const resultsDiv = document.getElementById('results');
    const explanationSection = document.querySelector('.explanation-section');

    // Validate the input number
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

    // Perform conversions to other bases
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

/**
 * Validates the input number based on the selected base using regex.
 * @param {string} number - The number string to validate.
 * @param {number} base - The base to validate against.
 * @returns {boolean} True if the input is valid, otherwise false.
 */
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

/**
 * Generates and displays the detailed conversion explanation.
 * @param {Event} event - The click event from the explanation buttons.
 */
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

    // Step 1: Conversion to Decimal
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

    // Step 2: Conversion from Decimal
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

        // Display steps in correct order (from the last step to the first)
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
    
    // Handle the special case where the source and target bases are the same
    if (fromBase === toBase) {
        explanationHTML = `<p>The number ${inputNumber} is already in base ${fromBase}.</p>`;
    }

    explanationContent.innerHTML = explanationHTML;
}

/**
 * Clears all input and output fields.
 */
function clearAll() {
    document.getElementById('input-number').value = '';
    document.getElementById('results').textContent = '';
    document.getElementById('explanation-content').innerHTML = '';
    document.querySelector('.explanation-section').style.display = 'none';
}

/**
 * Copies the results to the clipboard.
 */
function copyResults() {
    const resultsText = document.getElementById('results').textContent;
    if (resultsText) {
        navigator.clipboard.writeText(resultsText)
            .then(() => alert(langData[currentLang].copySuccess))
            .catch(() => alert(langData[currentLang].copyFail));
    }
}
