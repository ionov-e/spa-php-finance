let containerBlock = createContainerBlock();
createLoginForm();
createRegisterForm();

function createContainerBlock() {
    return createHtmlElement('div', "flex flex-col overflow-hidden container mx-auto py-2 sm:px-6 lg:px-8", 'container');
}

/**
 * @param {string} tag Examples: 'div', 'a'
 * @param {string} classes
 * @param {string} id
 * @param {string} innerText
 * @returns {HTMLElement}
 */
function createHtmlElement(tag, classes, id = '', innerText = '') {
    let divBlock = document.createElement(tag);
    addClassesToHtml(divBlock, classes);

    if (id) {
        divBlock.setAttribute('id', id);
    }

    if (innerText) {
        divBlock.innerText = innerText;
    }

    document.body.append(divBlock);
    return divBlock;
}

function createLoginForm() {
    let rootBlock = createFormRootBlock(LOGIN_FORM_ID);

    let headerBlock = createFormHeader('Login');
    let loginInputBlock = createFormLabelBlock('Login', 'text', LOGIN_LOGIN_ID);
    let passwordInputBlock = createFormLabelBlock('Password', 'password', PASSWORD_FOR_LOGIN_ID);
    let buttonBlock = createFormButton('Login', LOGIN_BUTTON_ID);
    let anotherFormLink = createAnotherFormLink('Not registered?', LOGIN_FORM_ID, REGISTER_FORM_ID);

    buttonBlock.onclick = function () {
        sendData([LOGIN_LOGIN_ID, PASSWORD_FOR_LOGIN_ID]).then(r => processLoginAndRegisterResponse(r));
    }

    rootBlock.append(headerBlock, loginInputBlock, passwordInputBlock, buttonBlock, anotherFormLink);

    containerBlock.append(rootBlock);
}

async function sendData(inputIds) {
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
    return showList(decodedResponse.data['articles']);
}

/**
 * @param {Array.<{id: number, is_income: boolean, amount: number, comment: string}>} articles
 */
function showList(articles) {

    if (articles.length === 0) {
        return alert('There are no articles in DB');
    }

    containerBlock.remove();
    containerBlock = createContainerBlock();
}

function processLoginAndRegisterResponse(result) { // success or fail

    if (result.status === STATUS_SUCCESS) {
        return askList();
    } else if (result.status === STATUS_FAIL) {
        return alert(result.data[NOTIFICATION]);
    }

    alert('Unexpected answer from server');

}

function createRegisterForm() {
    let rootBlock = createFormRootBlock(REGISTER_FORM_ID);

    let headerBlock = createFormHeader('Register');
    let loginInputBlock = createFormLabelBlock('Login', 'text', REGISTER_LOGIN_ID);
    let passwordInputBlock = createFormLabelBlock('Password', 'password', PASSWORD_FOR_REGISTER_ID);
    let passwordRepeatInputBlock = createFormLabelBlock('Repeat password', 'password', PASSWORD_REPEAT_FOR_REGISTER_ID);
    let buttonBlock = createFormButton('Register', REGISTER_BUTTON_ID);
    let anotherFormLink = createAnotherFormLink('Already registered?', REGISTER_FORM_ID, LOGIN_FORM_ID);

    rootBlock.style.display = 'none';
    rootBlock.append(headerBlock, loginInputBlock, passwordInputBlock, passwordRepeatInputBlock, buttonBlock, anotherFormLink);

    buttonBlock.onclick = function () {
        sendData([REGISTER_LOGIN_ID, PASSWORD_FOR_REGISTER_ID]).then(r => processLoginAndRegisterResponse(r));
    }

    containerBlock.append(rootBlock);
}

/**
 * @param {string} id
 * @returns {HTMLDivElement}
 */
function createFormRootBlock(id) {
    return createHtmlElement('div', 'pt-16 mt-8 grid grid-cols-1 gap-6 mx-auto', id);
}

/**
 * @param {string} header
 * @returns {HTMLHeadingElement}
 */
function createFormHeader(header) {
    return createHtmlElement('h2', 'text-2xl font-bold', '', header);
}

/**
 * @param {string} labelText
 * @param {string} inputType
 * @param {string} id
 * @returns {HTMLLabelElement}
 */
function createFormLabelBlock(labelText, inputType, id) {

    let labelBlock = createHtmlElement('label', 'block');
    let spanBlock = createHtmlElement('span', 'text-gray-700', '', labelText);
    let inputBlock = createInputBlockForForm(inputType, id);

    labelBlock.append(spanBlock, inputBlock);

    return labelBlock;
}

/**
 * @param {string} inputType
 * @param {string} id
 * @returns {HTMLLabelElement}
 */
function createInputBlockForForm(inputType, id) {
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

    return inputBlock;
}

/**
 * @param {string} text
 * @param {string} buttonId
 * @returns {HTMLButtonElement}
 */
function createFormButton(text, buttonId) {
    let buttonBlock = createHtmlElement('button',
        'text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mx-2 my-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800',
        buttonId,
        text);
    buttonBlock.setAttribute('type', 'button');
    return buttonBlock;
}

/**
 * @param {string} text
 * @param {string} currentFormId
 * @param {string} anotherFormId
 * @returns {HTMLAnchorElement}
 */
function createAnotherFormLink(text, currentFormId, anotherFormId) {
    let linkBlock = createHtmlElement('a', 'font-medium text-blue-600 text-right dark:text-blue-500 hover:underline cursor-pointer', '', text);
    linkBlock.onclick = function () {
        document.getElementById(currentFormId).style.display = 'none';
        document.getElementById(anotherFormId).style.display = 'grid';
    }
    return linkBlock;
}

/**
 * @param {string} text
 * @returns {HTMLHeadingElement}
 */
function createHeader(text) {
    return createHtmlElement('h1', 'text-3xl font-bold underline mx-auto my-5', '', text);
}

/**
 * @param {HTMLElement} htmlElement
 * @param {string} classes
 */
function addClassesToHtml(htmlElement, classes) {
    let classesArray = classes.split(' ');
    htmlElement.classList.add(...classesArray);
}