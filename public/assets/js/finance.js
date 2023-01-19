/**
 * @typedef ResponseJson
 * @type {object}
 * @property {string} status
 * @property {string} message
 * @property {Array} data

 * @typedef OperationArray
 * @type {Array}
 * @property {number} id
 * @property {boolean} is_income
 * @property {number} amount
 * @property {string} comment
 */

const OPERATION_LINK_PREFIX = '/?' + OPERATION_ID_KEY_NAME + '=';
const OPERATION_MODAL_ID = 'operationModal';
const OPERATION_ID_PREFIX = 'single-operation-';
const OPERATION_ID_ID = OPERATION_ID_PREFIX + ID_KEY_NAME;
const OPERATION_TYPE_ID = OPERATION_ID_PREFIX + 'type';
const OPERATION_AMOUNT_ID = OPERATION_ID_PREFIX + AMOUNT_KEY_NAME;
const OPERATION_COMMENT_ID = OPERATION_ID_PREFIX + COMMENT_KEY_NAME;
const CHECKBOX_ALL_ID = 'checkbox-all-search';
const CHECKBOX_PREFIX_ID = 'checkbox-table-search-';
const DEFAULT_TD_CLASSES = "p-4 px-6";


askForList();

/** @returns {HTMLElement} */
function createCleanContainerBlock() {
    let containerBlock = document.getElementById('container');

    if (containerBlock !== null) {
        containerBlock.remove();
    }

    return createHtmlElement(document.body, 'div', "flex flex-col overflow-hidden container mx-auto py-2 sm:px-6 lg:px-8", 'container');
}

/**
 * @param {HTMLElement} rootElement
 * @param {'div'|'span'|'a'|'button'|'p'|'input'|'label'|'h1'|'h2'|'h3'|'h4'|'h5'|'table'|'thead'|'tbody'|'tfoot'|'th'|'tr'|'td'|'svg'|'path'} tag
 * @param {string} classes
 * @param {string} id
 * @param {string} innerText
 * @param {Object.<string, string>} attributes
 * @returns {HTMLElement}
 */
function createHtmlElement(rootElement, tag, classes = '', id = '', innerText = '', attributes = {}) {
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
        fetchUserData([LOGIN_LOGIN_ID, PASSWORD_FOR_LOGIN_ID]).then(result => processResponse(result, askForList));
    }
}

/**
 * @param {String[]} inputIds
 * @returns {Promise<ResponseJson>}
 */
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
 * @returns {Promise<ResponseJson>}
 */
async function fetchSingleOperation(id) {
    let response = await fetch(OPERATION_LINK_PREFIX + id, {
        headers: {'Content-Type': 'application/json;charset=utf-8'}
    });

    return await response.json();
}

function createUnauthenticatedForms() {
    createCleanContainerBlock();
    createLoginForm();
    createRegisterForm();
}

async function askForList() {
    let response = await fetch('/', {
        headers: {'Content-Type': 'application/json;charset=utf-8'},
    });

    /** @type {ResponseJson} */
    let decodedResponse = await response.json();

    if (decodedResponse.status === STATUS_ERROR) {
        return alert(decodedResponse.message);
    }

    if (decodedResponse.status === STATUS_FAIL && decodedResponse.data[UNAUTHENTICATED_KEY_NAME]) {
        return createUnauthenticatedForms();
    }

    if (decodedResponse.status !== STATUS_SUCCESS) {
        return alert('Unexpected error');
    }
    return showList(decodedResponse.data['operations']);
}

/**
 * @param {Array.<OperationArray>} operations
 * @param {String} title
 */
function showList(operations, title = 'Last 10 operations:') {

    if (operations.length === 0) {
        return alert('There are no operations in DB');
    }

    let containerBlock = createCleanContainerBlock();

    let logoutLink = createHtmlElement(containerBlock,
        'a', 'font-medium text-blue-600 text-right hover:underline cursor-pointer', '', 'Logout');
    logoutLink.onclick = logout;

    createHtmlElement(containerBlock, 'h1', 'text-3xl font-bold underline mx-auto my-5', '', title);

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

    let totalExpense = 0;
    let totalIncome = 0;

    operations.forEach((operation) => {
        let trBlock = createHtmlElement(tbodyBlock, 'tr', "hover:bg-gray-50");

        let tdForCheckboxBlock = createHtmlElement(trBlock, 'td', "p-4 w-4");
        createCheckboxForTableBlock(tdForCheckboxBlock, CHECKBOX_PREFIX_ID + operation.id);
        createHtmlElement(trBlock, 'td', DEFAULT_TD_CLASSES, '', operation.id.toString());
        createTdForAmount(trBlock, operation);
        createHtmlElement(trBlock, 'td', DEFAULT_TD_CLASSES, '', operation.comment);
        createTdForType(trBlock, operation.is_income);
        createTdForLink(trBlock, operation.id);

        if (operation.is_income) {
            totalIncome += operation.amount;
        } else {
            totalExpense += operation.amount;
        }
    })

    let tfootTotalBlock = createHtmlElement(tableBlock, 'tfoot', "border-b bg-white text-gray-500 text-sm");
    let trTotalBlock = createHtmlElement(tfootTotalBlock, 'tr', "bg-gray-50");
    let thTotalBlock = createHtmlElement(trTotalBlock, 'th', "p-4 px-6", '', '', {'colspan': '6'});
    let divIncomeBlock = createHtmlElement(thTotalBlock, 'div');
    createHtmlElement(divIncomeBlock, 'span', 'pr-1', '', 'Total income:');
    createHtmlElement(divIncomeBlock, 'span', 'text-green-500', '', totalIncome.toFixed(2));
    let divExpenseBlock = createHtmlElement(thTotalBlock, 'div');
    createHtmlElement(divExpenseBlock, 'span', 'pr-1', '', 'Total expense:');
    createHtmlElement(divExpenseBlock, 'span', 'text-red-500', '', totalExpense.toFixed(2));
}

async function logout () {
    let response = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({[LOGOUT_KEY_NAME]: 'logout'})
    });

    /** @type {ResponseJson} */
    let decodedResponse = await response.json();

    if (decodedResponse.status === STATUS_SUCCESS) {
        return createUnauthenticatedForms();
    }

    if (decodedResponse.status === STATUS_ERROR) {
        return alert(decodedResponse.message);
    }

    return alert('Unexpected error');
}

/** @param {OperationArray} operation */
function showOperation(operation) {
    if (document.getElementById(OPERATION_MODAL_ID) === null) {
        createModalForOperation(operation);
    } else {
        changeAndShowModalForOperation(operation);
    }
}

/** @param {OperationArray} operation */
function createModalForOperation(operation) {
    let modalBlock = createHtmlElement(document.body, 'div', "bg-slate-600/50 fixed w-full p-4 inset-0", OPERATION_MODAL_ID);
    let divRoot2Block = createHtmlElement(modalBlock, 'div', "relative w-full h-full max-w-2xl m-auto");
    let divRoot3Block = createHtmlElement(divRoot2Block, 'div', "bg-white rounded-lg shadow");

    let line1Block = createHtmlElement(divRoot3Block, 'div', "flex items-start justify-between p-4 border-b rounded-t text-xl font-semibold text-gray-900");
    createHtmlElement(line1Block, 'span', '', '', 'Operation ID:');
    createHtmlElement(line1Block, 'span', 'pl-1', OPERATION_ID_ID, operation.id.toString());
    let closeButtonBlock = createHtmlElement(line1Block, 'button', "text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center", '', '', {'type': 'button'});
    let svgCloseButtonBlock = createHtmlElement(closeButtonBlock, 'svg', "w-5 h-5", '', '', {
        "fill": "currentColor",
        "viewBox": "0 0 20 20",
        "xmlns": "http://www.w3.org/2000/svg"
    });
    createHtmlElement(svgCloseButtonBlock, 'path', '', '', '', {
        "fill-rule": "evenodd",
        "d": "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",
        "clip-rule": "evenodd"
    });
    createHtmlElement(line1Block, 'span', "sr-only", '', 'Close modal');

    let line2Block = createHtmlElement(divRoot3Block, 'span', "flex items-start justify-between p-4 border-b rounded-t text-xl font-semibold text-gray-900");
    createHtmlElement(line2Block, 'span', "pl-1", '', 'Type:');
    createHtmlElement(line2Block, 'span', '', OPERATION_TYPE_ID, getOperationTypeString(operation));

    let line3Block = createHtmlElement(divRoot3Block, 'span', "flex items-start justify-between p-4 border-b rounded-t text-xl font-semibold text-gray-900");
    createHtmlElement(line3Block, 'span', "pl-1", '', 'Amount:');
    createHtmlElement(line3Block, 'span', operation.is_income ? "text-green-500" : "text-red-500", OPERATION_AMOUNT_ID, getOperationAmountString(operation));

    createHtmlElement(divRoot3Block, 'p', 'p-6 space-y-6 text-base text-gray-500', OPERATION_COMMENT_ID, operation.comment);

    let line4Block = createHtmlElement(divRoot3Block, 'div', "flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b");
    let bottomButton = createHtmlElement(line4Block, 'button', "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center", '', 'Back to list', {'type': 'button'});

    closeButtonBlock.addEventListener('click', toggleModal);
    bottomButton.addEventListener('click', toggleModal);
}

/** @param {OperationArray} operation */
function changeAndShowModalForOperation(operation) {
    document.getElementById(OPERATION_ID_ID).innerText = operation.id.toString();
    document.getElementById(OPERATION_TYPE_ID).innerText = getOperationTypeString(operation);
    document.getElementById(OPERATION_AMOUNT_ID).innerText = getOperationAmountString(operation);
    document.getElementById(OPERATION_AMOUNT_ID).classList.add(operation.is_income ? "text-green-500" : "text-red-500");
    document.getElementById(OPERATION_COMMENT_ID).innerText = operation.comment;
    toggleModal();
}

/** @param {OperationArray} operation */
function getOperationTypeString(operation) {
    return operation.is_income ? 'Income' : 'Expense';
}

/** @param {OperationArray} operation */
function getOperationAmountString(operation) {
    let prefix = operation.is_income ? '+' : '-';
    let amount = operation.amount.toFixed(2)
    return prefix + amount;
}

function toggleModal() {
    let modalBlock = document.getElementById(OPERATION_MODAL_ID);

    if (modalBlock.style.display === "none") {
        modalBlock.style.display = "block";
    } else {
        modalBlock.style.display = "none";
    }
}

/**
 * @param {ResponseJson} result
 * @param successCallback
 * @returns {*|void}
 */
function processResponse(result, successCallback) {
    if (result.status === STATUS_SUCCESS) {
        return successCallback(result.data);
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
        fetchUserData([REGISTER_LOGIN_ID, PASSWORD_FOR_REGISTER_ID]).then(result => processResponse(result, askForList));
    }
}

/**
 * @param {string} id
 * @returns {HTMLDivElement}
 */
function createFormRootBlock(id) {
    let containerBlock = document.getElementById('container');
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
 * @returns {HTMLInputElement}
 */
function createInputBlockForForm(rootElement, inputType, id) {
    let inputBlock = createHtmlElement(
        rootElement,
        'input',
        "mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black",
        id,
        '',
        {'type': inputType, 'name': id, 'required': ''}
    )

    if (inputType === 'number') {
        inputBlock.setAttribute('rows', '2');
        inputBlock.setAttribute('min', '0');
        inputBlock.setAttribute('step', '0.01');
    }

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
 * @param {OperationArray} operation
 * @returns {HTMLElement}
 */
function createTdForAmount(rootBlock, operation) {
    let tdForAmountBlock = createHtmlElement(rootBlock, 'td', DEFAULT_TD_CLASSES);
    if (operation.is_income) {
        createHtmlElement(tdForAmountBlock, 'span', "font-semibold text-base text-green-500", '', getOperationAmountString(operation));
    } else {
        createHtmlElement(tdForAmountBlock, 'span', "font-semibold text-base text-red-500", '', getOperationAmountString(operation));
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
        fetchSingleOperation(id).then(operation => processResponse(operation, showOperation));
    }
    return tdBlock;
}

/**
 * @param {HTMLElement} htmlElement
 * @param {string} classes
 */
function addClassesToHtml(htmlElement, classes) {
    let classesArray = classes.split(' ');
    htmlElement.classList.add(...classesArray);
}