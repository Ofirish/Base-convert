// DOM Element References
const inputNumber = document.getElementById('input-number');
const fromBase = document.getElementById('from-base');
const convertBtn = document.getElementById('convert-btn');
const resultsDiv = document.getElementById('results');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const smallTextBtn = document.getElementById('small-text');
const mediumTextBtn = document.getElementById('medium-text');
const largeTextBtn = document.getElementById('large-text');
const langEnBtn = document.getElementById('lang-en');
const langHeBtn = document.getElementById('lang-he');
const explanationBtns = document.querySelectorAll('.exp-btn');
const explanationContent = document.getElementById('explanation-content');
const explanationHeader = document.getElementById('explanation-header');
const collapsibleContent = document.querySelector('.collapsible-content');

// --- Language and UI Elements ---

// Language content object
const translations = {
    en: {
        pageTitle: "Base Converter",
        labelNumber: "Enter a number:",
        labelFromBase: "Source Base:",
        convertBtn: "Convert",
        outputTitle: "Results:",
        copyBtnTitle: "Copy to Clipboard",
        clearBtnTitle: "Clear All",
        explanationTitle: "Detailed Explanation",
        binaryExp: "Binary is a base-2 number system. It uses only two digits: 0 and 1. This system is the fundamental language of computers and digital electronics.",
        octalExp: "Octal is a base-8 number system. It uses digits from 0 to 7. It is often used in computer programming as a more compact representation of binary numbers.",
        decimalExp: "Decimal is the base-10 number system we use every day. It uses ten digits: 0 through 9. Each digit's position represents a power of 10.",
        hexExp: "Hexadecimal is a base-16 number system. It uses sixteen digits: 0-9 and A-F. It is widely used in computing for memory addresses and color codes.",
        placeholder: "e.g., 10110",
        whatIsThis: "What is this page?",
        collapsibleText: "This tool allows you to convert numbers between different number systems: Binary (Base 2), Octal (Base 8), Decimal (Base 10), and Hexadecimal (Base 16). Simply enter your number, select its current base from the dropdown, and press \"Convert\" to see the results in all other bases.",
        invalidInput: "Invalid input. Please enter a valid number for the selected base."
    },
    he: {
        pageTitle: "ממיר בסיסים",
        labelNumber: "הכנס מספר:",
        labelFromBase: "בסיס מקור:",
        convertBtn: "המר",
        outputTitle: "תוצאות:",
        copyBtnTitle: "העתק ללוח",
        clearBtnTitle: "נקה הכל",
        explanationTitle: "הסבר מפורט",
        binaryExp: "בינארי הוא שיטת ספירה על בסיס 2. היא משתמשת בשתי ספרות בלבד: 0 ו-1. שיטה זו היא השפה הבסיסית של מחשבים ואלקטרוניקה דיגיטלית.",
        octalExp: "אוקטלי הוא שיטת ספירה על בסיס 8. היא משתמשת בספרות מ-0 עד 7. היא משמשת לעיתים קרובות בתכנות כמייצג קומפקטי יותר של מספרים בינאריים.",
        decimalExp: "עשרוני היא שיטת הספירה על בסיס 10 שאנו משתמשים בה מדי יום. היא משתמשת בעשר ספרות: 0 עד 9. מיקום כל ספרה מייצג חזקה של 10.",
        hexExp: "הקסדצימלי הוא שיטת ספירה על בסיס 16. היא משתמשת בשש עשרה ספרות: 0-9 ו-A-F. היא נמצאת בשימוש נרחב במחשוב עבור כתובות זיכרון וקודי צבע.",
        placeholder: "לדוגמה: 10110",
        whatIsThis: "מהו הדף הזה?",
        collapsibleText: "כלי זה מאפשר לך להמיר מספרים בין שיטות ספירה שונות: בינארי (בסיס 2), אוקטלי (בסיס 8), עשרוני (בסיס 10) והקסדצימלי (בסיס 16). כל שעליך לעשות הוא להזין את המספר שלך, לבחור את בסיס המקור שלו מהרשימה הנפתחת וללחוץ על 'המר' כדי לראות את התוצאות בכל שאר הבסיסים.",
        invalidInput: "קלט לא חוקי. אנא הכנס מספר תקף עבור הבסיס שנבחר."
    }
};

let currentLanguage = 'en';

// Function to update the UI based on the selected language
function updateUI(lang) {
    const content = translations[lang];
    document.title = content.pageTitle;
    document.getElementById('label-number').textContent = content.labelNumber;
    document.getElementById('label-from-base').textContent = content.labelFromBase;
    convertBtn.textContent = content.convertBtn;
    document.getElementById('output-title').textContent = content.outputTitle;
    copyBtn.title = content.copyBtnTitle;
    clearBtn.title = content.clearBtnTitle;
    document.getElementById('explanation-title').textContent = content.explanationTitle;
    inputNumber.placeholder = content.placeholder;
    document.getElementById('explanation-header').innerHTML = `<i class="fas fa-info-circle"></i> ${content.whatIsThis} <i class="fas fa-chevron-down arrow-icon"></i>`;
    collapsibleContent.querySelector('p').textContent = content.collapsibleText;

    // Handle RTL for Hebrew
    document.documentElement.lang = lang;
    document.body.dir = lang === 'he' ? 'rtl' : 'ltr';

    // Update explanation section based on active button
    const activeExpBtn = document.querySelector('.exp-btn.active');
    if (activeExpBtn) {
        showExplanation(activeExpBtn.dataset.base);
    }
}

// Event listeners for language buttons
langEnBtn.addEventListener('click', () => {
    currentLanguage = 'en';
    langEnBtn.classList.add('active');
    langHeBtn.classList.remove('active');
    updateUI(currentLanguage);
});

langHeBtn.addEventListener('click', () => {
    currentLanguage = 'he';
    langHeBtn.classList.add('active');
    langEnBtn.classList.remove('active');
    updateUI(currentLanguage);
});

// --- Collapsible Section Logic ---

explanationHeader.addEventListener('click', () => {
    collapsibleContent.classList.toggle('show');
    explanationHeader.classList.toggle('expanded');
});

// --- Core Conversion Logic ---

// Function to validate the input number based on the source base
function isValidInput(number, base) {
    const validChars = {
        '2': /^[01]+$/,
        '8': /^[0-7]+$/,
        '10': /^\d+$/,
        '16': /^[0-9a-fA-F]+$/
    };
    return validChars[base].test(number);
}

// Function to perform the conversion
function convertNumber() {
    const numberStr = inputNumber.value.trim();
    const sourceBase = fromBase.value;

    // Clear previous results
    resultsDiv.innerHTML = '';
    
    // Validate input
    if (numberStr === '' || !isValidInput(numberStr, sourceBase)) {
        resultsDiv.innerHTML = `<p class="error-message">${translations[currentLanguage].invalidInput}</p>`;
        return;
    }

    let decimalValue;
    try {
        decimalValue = parseInt(numberStr, sourceBase);
    } catch (e) {
        resultsDiv.innerHTML = `<p class="error-message">${translations[currentLanguage].invalidInput}</p>`;
        return;
    }

    // Convert to other bases and display
    const bases = {
        '2': 'Binary',
        '8': 'Octal',
        '10': 'Decimal',
        '16': 'Hexadecimal'
    };

    let resultHtml = `<h4>Number: ${numberStr} (Base ${sourceBase})</h4>`;

    for (const base in bases) {
        if (base !== sourceBase) {
            let convertedValue;
            if (base === '16') {
                convertedValue = decimalValue.toString(base).toUpperCase();
            } else {
                convertedValue = decimalValue.toString(base);
            }
            resultHtml += `<p><b>${bases[base]} (${base}):</b> ${convertedValue}</p>`;
        }
    }

    resultsDiv.innerHTML = resultHtml;
}

// Event listener for the convert button
convertBtn.addEventListener('click', convertNumber);

// --- Action Buttons (Copy & Clear) ---

// Copy results to clipboard
copyBtn.addEventListener('click', () => {
    const textToCopy = resultsDiv.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Results copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

// Clear all fields
clearBtn.addEventListener('click', () => {
    inputNumber.value = '';
    fromBase.value = '2';
    resultsDiv.innerHTML = '';
    explanationContent.innerHTML = '';
    explanationBtns.forEach(btn => btn.classList.remove('active'));
});

// --- Text Size Adjustment ---

const textSizes = [smallTextBtn, mediumTextBtn, largeTextBtn];
textSizes.forEach(btn => {
    btn.addEventListener('click', () => {
        textSizes.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        resultsDiv.classList.remove('small-text', 'medium-text', 'large-text');
        
        if (btn.id === 'small-text') {
            resultsDiv.classList.add('small-text');
        } else if (btn.id === 'medium-text') {
            resultsDiv.classList.add('medium-text');
        } else if (btn.id === 'large-text') {
            resultsDiv.classList.add('large-text');
        }
    });
});

// --- Detailed Explanation ---

// Function to show the detailed explanation
function showExplanation(base) {
    let explanation;
    switch (base) {
        case '2':
            explanation = translations[currentLanguage].binaryExp;
            break;
        case '8':
            explanation = translations[currentLanguage].octalExp;
            break;
        case '10':
            explanation = translations[currentLanguage].decimalExp;
            break;
        case '16':
            explanation = translations[currentLanguage].hexExp;
            break;
        default:
            explanation = '';
    }
    explanationContent.textContent = explanation;
}

// Event listeners for explanation buttons
explanationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        explanationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showExplanation(btn.dataset.base);
    });
});

// Initial UI setup
updateUI(currentLanguage);
