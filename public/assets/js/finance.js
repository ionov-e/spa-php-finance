const OPERATION_LINK_PREFIX = '/?' + OPERATION_ID_KEY_NAME + '=';
const CHECKBOX_ALL_ID = 'checkbox-all-search';
const CHECKBOX_PREFIX_ID = 'checkbox-table-search-';
const DEFAULT_TD_CLASSES = "p-4 px-6";
let containerBlock = createContainerBlock();
createLoginForm();
createRegisterForm();

function createContainerBlock() {
    return createHtmlElement(document.body, 'div', "flex flex-col overflow-hidden container mx-auto py-2 sm:px-6 lg:px-8", 'container');
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} tag Examples: 'div', 'a'
 * @param {string} classes
 * @param {string} id
 * @param {string} innerText
 * @param {Object} attributes Example {'type': 'checkbox', 'required': ''}
 * @returns {HTMLElement}
 */
function createHtmlElement(rootElement, tag, classes = '', id = '', innerText = '', attributes = []) {
    let htmlElement = document.createElement(tag);

    if (classes) {
        addClassesToHtml(htmlElement, classes);
    }

    if (id) {
        htmlElement.setAttribute('id', id);
    }

    if (innerText) {
        htmlElement.innerText = innerText;
    }

    for (const [key, value] of Object.entries(attributes)) {
        htmlElement.setAttribute(key, value);
    }

    rootElement.append(htmlElement);
    return htmlElement;
}

function createLoginForm() {
    let formBlock = createFormRootBlock(LOGIN_FORM_ID);

    createFormHeader(formBlock, 'Login');
    createFormLabelBlock(formBlock, 'Login', 'text', LOGIN_LOGIN_ID);
    createFormLabelBlock(formBlock, 'Password', 'password', PASSWORD_FOR_LOGIN_ID);
    let buttonBlock = createFormButton(formBlock, 'Login', LOGIN_BUTTON_ID);
    createAnotherFormLink(formBlock, 'Not registered?', LOGIN_FORM_ID, REGISTER_FORM_ID);

    buttonBlock.onclick = function () {
        fetchUserData([LOGIN_LOGIN_ID, PASSWORD_FOR_LOGIN_ID]).then(result => processResponse(result, askList));
    }
}

async function fetchUserData(inputIds) {
    let inputData = {};

    inputIds.forEach((id) => {
        inputData[id] = document.getElementById(id).value;
    });

    let response = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(inputData)
    });

    return await response.json();
}

/**
 * @param {number} id
 * @returns {Promise<any>}
 */
async function fetchSingleOperation(id) {
    let response = await fetch(OPERATION_LINK_PREFIX + id, {
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    });

    return await response.json();
}

async function askList() {
    let response = await fetch('/', {
        headers: {'Content-Type': 'application/json;charset=utf-8'},
    });

    let decodedResponse = await response.json(); // success or error

    if (decodedResponse.status === STATUS_ERROR) {
        return alert(decodedResponse.message);
    }

    if (decodedResponse.status !== STATUS_SUCCESS) {
        return alert('Unexpected error');
    }
    return showList(decodedResponse.data['operations']);
}

/** @param {Array.<{id: number, is_income: boolean, amount: number, comment: string}>} operations */
function showList(operations) {

    if (operations.length === 0) {
        return alert('There are no operations in DB');
    }

    containerBlock.remove();
    containerBlock = createContainerBlock();

    let tableBlock = createHtmlElement(containerBlock, 'table', "w-full");
    let theadBlock = createHtmlElement(tableBlock, 'thead', "text-xs text-gray-700 uppercase bg-gray-50 text-left");
    let trHeadBlock = createHtmlElement(theadBlock, 'tr');

    let thCheckboxBlock = createHtmlElement(trHeadBlock, 'th', "p-4", '', '', {'scope': 'col'});
    createCheckboxForTableBlock(thCheckboxBlock, CHECKBOX_ALL_ID);
    createThForTable(trHeadBlock, 'ID');
    createThForTable(trHeadBlock, 'Amount');
    createThForTable(trHeadBlock, 'Comment');
    createThForTable(trHeadBlock, 'Type');
    createThForTable(trHeadBlock, 'Action');

    let tbodyBlock = createHtmlElement(tableBlock, 'tbody', "border-b bg-white text-gray-500 text-sm");

    operations.forEach((operation) => {
        let trBlock = createHtmlElement(tbodyBlock, 'tr', "hover:bg-gray-50");

        let tdForCheckboxBlock = createHtmlElement(trBlock, 'td', "p-4 w-4");
        createCheckboxForTableBlock(tdForCheckboxBlock, CHECKBOX_PREFIX_ID + operation.id);
        createHtmlElement(trBlock, 'td', DEFAULT_TD_CLASSES, '', operation.id);
        createTdForAmount(trBlock, operation.amount, operation.is_income)
        createHtmlElement(trBlock, 'td', DEFAULT_TD_CLASSES, '', operation.comment);
        createTdForType(trBlock, operation.is_income);
        createTdForLink(trBlock, operation.id);
    })
}

/** @param {Array.<id: number, is_income: boolean, amount: number, comment: string>} operation */
function showOperation(operation) {
    // #TODO Show Operation
}

function processResponse(result, successCallback) { // success or fail

    if (result.status === STATUS_SUCCESS) {
        return successCallback(result);
    } else if (result.status === STATUS_FAIL) {
        return alert(result.data[NOTIFICATION]);
    }

    alert('Unexpected answer from server');
}

function createRegisterForm() {
    let formBlock = createFormRootBlock(REGISTER_FORM_ID);

    createFormHeader(formBlock, 'Register');
    createFormLabelBlock(formBlock, 'Login', 'text', REGISTER_LOGIN_ID);
    createFormLabelBlock(formBlock, 'Password', 'password', PASSWORD_FOR_REGISTER_ID);
    createFormLabelBlock(formBlock, 'Repeat password', 'password', PASSWORD_REPEAT_FOR_REGISTER_ID);
    let buttonBlock = createFormButton(formBlock, 'Register', REGISTER_BUTTON_ID);
    createAnotherFormLink(formBlock, 'Already registered?', REGISTER_FORM_ID, LOGIN_FORM_ID);

    formBlock.style.display = 'none';

    buttonBlock.onclick = function () {
        fetchUserData([REGISTER_LOGIN_ID, PASSWORD_FOR_REGISTER_ID]).then(result => processResponse(result, askList));
    }
}

/**
 * @param {string} id
 * @returns {HTMLDivElement}
 */
function createFormRootBlock(id) {
    return createHtmlElement(containerBlock, 'div', 'pt-16 mt-8 grid grid-cols-1 gap-6 mx-auto', id);
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} header
 * @returns {HTMLHeadingElement}
 */
function createFormHeader(rootElement, header) {
    return createHtmlElement(rootElement, 'h2', 'text-2xl font-bold', '', header);
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} labelText
 * @param {string} inputType
 * @param {string} id
 * @returns {HTMLLabelElement}
 */
function createFormLabelBlock(rootElement, labelText, inputType, id) {
    let labelBlock = createHtmlElement(rootElement, 'label', 'block');
    createHtmlElement(labelBlock, 'span', 'text-gray-700', '', labelText);
    createInputBlockForForm(labelBlock, inputType, id);

    return labelBlock;
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} inputType
 * @param {string} id
 * @returns {HTMLLabelElement}
 */
function createInputBlockForForm(rootElement, inputType, id) {
    let inputBlock

    if (inputType === 'number') {
        inputBlock = document.createElement('textarea');
        inputBlock.setAttribute('rows', '2');
        inputBlock.setAttribute('min', '0');
        inputBlock.setAttribute('step', '0.01');
    } else {
        inputBlock = document.createElement('input');
        inputBlock.setAttribute('type', inputType);
    }

    addClassesToHtml(inputBlock, "mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black");
    inputBlock.setAttribute('name', id);
    inputBlock.setAttribute('id', id);
    inputBlock.setAttribute('required', '');

    rootElement.append(inputBlock);

    return inputBlock;
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} text
 * @param {string} buttonId
 * @returns {HTMLButtonElement}
 */
function createFormButton(rootElement, text, buttonId) {
    return createHtmlElement(rootElement,
        'button',
        'text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mx-2 my-3',
        buttonId,
        text,
        {'type': 'button'});
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} text
 * @param {string} currentFormId
 * @param {string} anotherFormId
 * @returns {HTMLAnchorElement}
 */
function createAnotherFormLink(rootElement, text, currentFormId, anotherFormId) {
    let linkBlock = createHtmlElement(rootElement,
        'a', 'font-medium text-blue-600 text-right hover:underline cursor-pointer', '', text);
    linkBlock.onclick = function () {
        document.getElementById(currentFormId).style.display = 'none';
        document.getElementById(anotherFormId).style.display = 'grid';
    }
    return linkBlock;
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} text
 * @param {string} classes
 * @returns {HTMLElement}
 */
function createThForTable(rootElement, text, classes = "py-3 px-6") {
    return createHtmlElement(rootElement, 'th', classes, '', text, {'scope': 'col'});
}

function createCheckboxForTableBlock(rootBlock, id) {
    let divBlock = createHtmlElement(rootBlock, 'div', "flex items-center");
    createHtmlElement(divBlock, 'input', "w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2", id, '', {'type': 'checkbox'});
    createHtmlElement(divBlock, 'label', "sr-only", '', 'checkbox', {'for': id});
}

/**
 * @param {HTMLElement} rootBlock
 * @param {number} amount
 * @param {boolean} isIncome
 * @returns {HTMLElement}
 */
function createTdForAmount(rootBlock, amount, isIncome) {
    let tdForAmountBlock = createHtmlElement(rootBlock, 'td', DEFAULT_TD_CLASSES);
    if (isIncome) {
        createHtmlElement(tdForAmountBlock, 'span', "font-semibold text-base text-green-500", '', '+' + amount.toFixed(2));
    } else {
        createHtmlElement(tdForAmountBlock, 'span', "font-semibold text-base text-red-500", '', '-' + amount.toFixed(2));
    }
    return tdForAmountBlock;
}

/**
 * @param {HTMLElement} rootBlock
 * @param {boolean} isIncome
 * @returns {HTMLElement}
 */
function createTdForType(rootBlock, isIncome) {
    let typeOfTdBlock = createHtmlElement(rootBlock, 'td', DEFAULT_TD_CLASSES);
    let divBlock = createHtmlElement(typeOfTdBlock, 'div', "flex items-center");
    createHtmlElement(divBlock,
        'span',
        isIncome ? "h-2.5 w-2.5 rounded-full bg-green-500 mr-2" : "h-2.5 w-2.5 rounded-full bg-red-500 mr-2");
    createHtmlElement(divBlock, 'span', '', '', isIncome ? 'Income' : 'Expense');
    return typeOfTdBlock;
}

/**
 * @param {HTMLElement} rootBlock
 * @param {int} id
 * @returns {HTMLElement}
 */
function createTdForLink(rootBlock, id) {
    let tdBlock = createHtmlElement(rootBlock, 'td', DEFAULT_TD_CLASSES);
    let buttonBlock = createHtmlElement(tdBlock, 'button', "font-medium text-blue-600 hover:underline", '', 'View');
    buttonBlock.onclick = function () {
        fetchSingleOperation(id).then(result => processResponse(result, showOperation));
    }
    return tdBlock;
}

/**
 * @param {HTMLElement} rootElement
 * @param {string} text
 * @returns {HTMLHeadingElement}
 */
function createHeader(rootElement, text) {
    return createHtmlElement(rootElement, 'h1', 'text-3xl font-bold underline mx-auto my-5', '', text);
}

/**
 * @param {HTMLElement} htmlElement
 * @param {string} classes
 */
function addClassesToHtml(htmlElement, classes) {
    let classesArray = classes.split(' ');
    htmlElement.classList.add(...classesArray);
}