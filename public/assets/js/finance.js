containerBlock = document.querySelector('#container')

createLoginForm()
createRegisterForm()

function createLoginForm() {
    let rootBlock = createFormRootBlock(LOGIN_FORM_ID)

    let headerBlock = createFormHeader('Login')
    let loginInputBlock = createFormLabelBlock('Login', 'text', LOGIN_LOGIN_ID)
    let passwordInputBlock = createFormLabelBlock('Password', 'password', PASSWORD_FOR_LOGIN_ID)
    let buttonBlock = createFormButton('Login', LOGIN_BUTTON_ID)
    let anotherFormLink = createAnotherFormLink('Not registered?', LOGIN_FORM_ID, REGISTER_FORM_ID)

    buttonBlock.onclick = function () {
        sendData([LOGIN_LOGIN_ID, PASSWORD_FOR_LOGIN_ID], processLoginAndRegisterResponse)
    }

    rootBlock.append(headerBlock, loginInputBlock, passwordInputBlock, buttonBlock, anotherFormLink)

    containerBlock.append(rootBlock)
}

async function sendData(inputIds, processResultCallback) {
    let inputData = {}

    inputIds.forEach((id) => {
        inputData[id] = document.getElementById(id).value
    })

    let response = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify(inputData)
    });

    let result = await response.json()

    processResultCallback(result)
}

function showList() {
    // #TODO fill
}

function processLoginAndRegisterResponse(result) { // success or fail

    if (result.status === STATUS_SUCCESS) {
        return showList()
    } else if (result.status === STATUS_FAIL) {
        return alert(result.data[NOTIFICATION])
    }

    alert('Unexpected answer from server')

}

function createRegisterForm() {
    let rootBlock = createFormRootBlock(REGISTER_FORM_ID)

    let headerBlock = createFormHeader('Register')
    let loginInputBlock = createFormLabelBlock('Login', 'text', REGISTER_LOGIN_ID)
    let passwordInputBlock = createFormLabelBlock('Password', 'password', PASSWORD_FOR_REGISTER_ID)
    let passwordRepeatInputBlock = createFormLabelBlock('Repeat password', 'password', PASSWORD_REPEAT_FOR_REGISTER_ID)
    let buttonBlock = createFormButton('Register', REGISTER_BUTTON_ID)
    let anotherFormLink = createAnotherFormLink('Already registered?', REGISTER_FORM_ID, LOGIN_FORM_ID)

    rootBlock.style.display = 'none'
    rootBlock.append(headerBlock, loginInputBlock, passwordInputBlock, passwordRepeatInputBlock, buttonBlock, anotherFormLink)

    buttonBlock.onclick = function () {
        sendData([REGISTER_LOGIN_ID, PASSWORD_FOR_REGISTER_ID], processLoginAndRegisterResponse)
    }

    containerBlock.append(rootBlock)
}

/**
 * @param {string} id
 * @returns {HTMLDivElement}
 */
function createFormRootBlock(id) {
    let rootBlock = document.createElement('div')
    rootBlock.classList.add('pt-16', 'mt-8', 'grid', 'grid-cols-1', 'gap-6', 'mx-auto')
    rootBlock.setAttribute('id', id)
    return rootBlock
}

/**
 * @param {string} header
 * @returns {HTMLHeadingElement}
 */
function createFormHeader(header) {
    let h2Block = document.createElement('h2')
    h2Block.classList.add('text-2xl', 'font-bold')
    h2Block.innerText = header
    return h2Block
}

/**
 * @param {string} labelText
 * @param {string} inputType
 * @param {string} id
 * @returns {HTMLLabelElement}
 */
function createFormLabelBlock(labelText, inputType, id) {

    let labelBlock = document.createElement('label')
    labelBlock.classList.add('block')

    let spanBlock = document.createElement('span')
    spanBlock.classList.add('text-gray-700')
    spanBlock.innerText = labelText

    let inputBlock = getInputBlockForForm(inputType, id);

    labelBlock.append(spanBlock, inputBlock)

    return labelBlock
}

/**
 * @param {string} inputType
 * @param {string} id
 * @returns {HTMLLabelElement}
 */
function getInputBlockForForm(inputType, id) {
    let inputBlock

    if (inputType === 'number') {
        inputBlock = document.createElement('textarea')
        inputBlock.setAttribute('rows', '2')
    } else {
        inputBlock = document.createElement('input')
        inputBlock.setAttribute('type', inputType)
    }

    inputBlock.classList.add('mt-0', 'block', 'w-full', 'px-0.5', 'border-0', 'border-b-2', 'border-gray-200', 'focus:ring-0', 'focus:border-black')
    inputBlock.setAttribute('name', id)
    inputBlock.setAttribute('id', id)
    inputBlock.setAttribute('required', '')

    if (inputType === 'number') {
        inputBlock.setAttribute('min', '0')
        inputBlock.setAttribute('step', '0.01')
    }

    return inputBlock;
}

/**
 * @param {string} text
 * @param {string} buttonId
 * @returns {HTMLButtonElement}
 */
function createFormButton(text, buttonId) {

    let buttonBlock = document.createElement('button')
    buttonBlock.classList.add('text-white', 'bg-blue-700', 'hover:bg-blue-800', 'focus:outline-none', 'focus:ring-4', 'focus:ring-blue-300', 'font-medium', 'rounded-full', 'text-sm', 'px-5', 'py-2.5', 'text-center', 'mx-2', 'my-3', 'dark:bg-blue-600', 'dark:hover:bg-blue-700', 'dark:focus:ring-blue-800')
    buttonBlock.setAttribute('type', 'button')
    buttonBlock.setAttribute('id', buttonId)
    buttonBlock.innerText = text
    return buttonBlock
}

/**
 * @param {string} text
 * @param {string} currentFormId
 * @param {string} anotherFormId
 * @returns {HTMLAnchorElement}
 */
function createAnotherFormLink(text, currentFormId, anotherFormId) {
    let linkBlock = document.createElement('a')
    linkBlock.classList.add('font-medium', 'text-blue-600', 'text-right', 'dark:text-blue-500', 'hover:underline')
    linkBlock.innerText = text
    linkBlock.onclick = function () {
        document.getElementById(currentFormId).style.display = 'none'
        document.getElementById(anotherFormId).style.display = 'grid'
    }
    return linkBlock
}

/**
 * @param {string} text
 * @returns {HTMLHeadingElement}
 */
function createHeader(text) {
    let headerBlock = document.createElement('h1')
    headerBlock.classList.add('text-3xl', 'font-bold', 'underline', 'mx-auto my-5')
    headerBlock.innerText = text
    return headerBlock
}