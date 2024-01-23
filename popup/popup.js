const alertBox = document.getElementById('alertBox');
const closeAlertBoxBtn = document.getElementById('closeAlert');
const alertBoxText = document.getElementById('alertBoxText');
const generateTokenBtn = document.getElementsByClassName('generateBtn')[0];
const tokenTextElm = document.getElementById('token');
const copyBtns = document.getElementsByClassName('copyBtn');
const copyTokenBtn = copyBtns[0];
const updateTokenBtn = document.getElementsByClassName('generateBtn')[1];
const getSelectorsBtn = document.getElementsByClassName('getSelectors')[0];

// The generated token
let tokenRes = null;
generateTokenBtn.addEventListener('click', function(){
    tokenRes = generateTokenFn(15);
    tokenTextElm.innerText = tokenRes;
})
// copy generated token
copyTokenBtn.addEventListener('click', function(){
    if(!tokenRes) {
        //Show alert
        alertBox.classList.toggle('hide');
        alertBoxText.innerText = "Generate Token Please!!"
        return;
    }
    // copy token to clipboard
    copyToClipboard(`${tokenRes}`);
    // pop up "Copied!" animation
    copyTokenBtn.children[1].classList.toggle("hide");
    setTimeout(()=>{
        copyTokenBtn.children[1].classList.toggle("hide");
    }, 500)
})
//close alert box
closeAlertBoxBtn.addEventListener('click', function(){
    alertBox.classList.toggle('hide');
})
// update foreground token
updateTokenBtn.addEventListener('click', function(){
    //send message to service worker
    chrome.runtime.sendMessage({ action: "tokenSetup", payload: {token: tokenRes} }, function(response) {
        // Handle the response from background.js
        console.log(response)
    });
})
// Generate Selectors
getSelectorsBtn.addEventListener('click', function(){
    chrome.runtime.sendMessage({ action: "getSelectors"}, function(response) {
        // Handle the response from background.js
        console.log(response)
    });
})



//Receiving a message from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message from service worker:", message);
    sendResponse({ message: "from_popup" }); // Optional response
});








/*=============================
        Functions
=============================*/
/* Generate token */
function generateTokenFn(length){
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters.charAt(randomIndex);
    }
    return token;
}
/* Copy To Clipboard */
function copyToClipboard(value) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
