let token = null;
let hoveredElementTextContent = null;
let allSelectors = null;



/***********************************

        HANDLE GET SELECTORS

***********************************/
function getAllSelectorsForToken(token) {
  const matchingElement = document.querySelector(`[data-fls="${token}"]`);
  if (!matchingElement) {
    return null;
  }
  const selectors = {
    // ID
    idSelector: matchingElement.id ? { name: matchingElement.id, type: 'id', index: 0, count: 1, types: { query: `#${matchingElement.id}` } } : null,
    // CLASSES
    classNamesSelector: getClassNamesSelector(matchingElement),
    // TAG
    tagNameSelector: getTagNameSelector(matchingElement),
    // XPATH
    xpathSelector: getXPathSelector(matchingElement),
  };
  return selectors;
}

// get class names
function getClassNamesSelector(element) {
  if (!element || !element.classList || element.classList.length === 0) {
    return null;
  }
  const classList = Array.from(element.classList);
  const selectors = classList.map(className => {
    const elementsWithSameClass = document.querySelectorAll(`.${className}`);
    const index = Array.from(elementsWithSameClass).indexOf(element);
    return {
      type: 'class',
      name: className,
      index: index,
      count: elementsWithSameClass.length,
      types: {
        query: `.${className}:nth-of-type(${index})`,
      }
    }
  });
  return selectors;
}

// get tag names
function getTagNameSelector(element) {
  const tagName = element.tagName.toLowerCase();
  const elementsWithSameTag = document.querySelectorAll(`${tagName}`);
  const index = Array.from(elementsWithSameTag).indexOf(element);
  return {
    type: 'tag',
    name: tagName,
    index: index,
    count: 0, //todo: fix tag count
    types: {
      query: `${tagName}${index !== 0 ? `:nth-of-type(${index})` : ''}`,
    }
  }
}

//TODO: FIXING XPATH
// get xpath
function getXPathSelector(element) {
  const idx = (sib, name) => sib
    ? idx(sib.previousElementSibling, name || sib.localName) + (sib.localName === name)
    : 1;

  const segs = [];
  for (; element && element.nodeType === 1; element = element.parentNode) {
    if (element.hasAttribute('id')) {
      segs.unshift(`#${element.getAttribute('id')}`);
      break;
    } else {
      let sib = element.previousElementSibling;
      let nth = 1;

      while (sib) {
        if (sib.nodeType === 1 && sib.localName === element.localName) {
          nth++;
        }
        sib = sib.previousElementSibling;
      }
      const tagName = element.localName.toLowerCase();
      const nthStr = nth !== 1 ? `:nth-child(${nth})` : '';
      segs.unshift(`${tagName}${nthStr}`);
    }
  }
  return segs.length ? `/${segs.join('/')}` : null;
}

// Function to get an element using XPath selector
function getElementByXPath(xpath) {
  return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
// todo: add tag[attribute] // tag[attribute="value"] selector
// todo: add combined selector (tag+className)


/***********************************

              ALERT BOX

***********************************/
// Create a <style> element
const styleElement = document.createElement('style');

// Add your CSS rules to the <style> element
styleElement.textContent = `
  :root {
    --main: #43766C;
    --second: #F8FAE5;
    --third: #B19470;
    --fourth: #76453B;
  }
  *{
    padding: 0px;
    margin 0px;
  }
  #alertBox{
    position: fixed;
    top: 0px;
    height: 100%;
    width: 100%;
    background-color: rgba(67,118,108,.5);
    z-index: 9999999;
  }
  #closeAlert{
    position: absolute;
    top: 3px;
    right: 5px;
    padding: 3px 8px 4px;
    color: var(--second);
    background-color: var(--fourth);
    border-radius: 50%;
    box-shadow: -1px 1px 1px 1px var(--main);
    cursor: pointer;
  }
  #closeAlert:hover{
    background-color: var(--main);
  }
  #closeAlert:active{
    filter:brightness(1.5);
  }
  #box{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 100px;
    height: 60%;
    width: 650px;
    padding: 15px 0px;
    margin: 0px auto;
    transform: translateX(5%);
    background-color: var(--third);
    right: 0px;
  }
  #box::before{
    position: absolute;
    bottom: 0px;
    left: 0px;
    content: '';
    width: 100%;
    height: 3px;
    background-color: var(--fourth);
  }
  #box::after{
    position: absolute;
    top: 0px;
    right: 0px;
    content: '';
    width: 2px;
    height: 100%;
    background-color: var(--fourth);
  }
  #box>.titles{
    flex-grow: 1;
    width: 100%;
    margin-top: 10px;
    color: var(--second);
    text-align: center;
    border-bottom: 1px solid  var(--second);
  }
  #elmTags{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 8;
    flex-wrap: wrap;
    width: 100%;  
    border-bottom: 1px solid  var(--second);
    overflow-y: hidden;
  }
  .tag{
    display: flex;
    justify-content: center;
    height: 22px;
    width: 120px;
    margin: 3px 5px;
    background: var(--main);
    border-radius: 3px;
    cursor: pointer;
    box-shadow: -2px 2px 2px 1px var(--fourth);
  }
  .tag:hover{
    filter:brightness(1.2);
  }
  .tag:active{
    filter:brightness(0.8);
  }
  .tagText{
    flex-grow: 1;
    padding: 3px;
    margin: 0px auto;
    color: var(--second);
    text-align: center;
    font-size: 11pt;
    overflow: hidden;
  }
  .tagValue{
    flex-grow: 6;
    color: var(--third);
    background: var(--second);
    border-right: 1px dotted var(--second);
    border-left: 1px dotted var(--second);
  }
  .tagValue:hover{
    filter:brightness(.8);
  }
  .tagType, .tagCount{
    font-family: monospace;
    font-size: 8pt !important;
  }



  #elmSelector{
    flex-grow: 2;
    display: flex;
    align-items: center;
    width: 100%;
  }
  #tokenDisplay{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    margin: 10px auto 0px;
    background-color: var(--third);
  }
  #token{
    width: 100%;
    padding: 10px 3px;
    color: var(--fourth);
    background: var(--second);
    text-align: center;
    border-radius: 3px;
    font-family: monospace;
    font-size: 12pt !important;
    box-shadow: -2px 2px 2px 1px var(--fourth);
  }
  .copyBtn{
    position: relative;
    padding: 12px 10px;
    color: var(--second);
    background-color: var(--fourth);
    border-radius: 3px;
    font-size: 9pt;
    font-family: monospace;
    border-bottom: 1px solid  var(--second);
    box-shadow: -2px 2px 2px 1px var(--fourth);
    cursor: pointer;
  }
  .copyBtn:hover{
    background-color: var(--main);
    transition: 0.3s all;
  }
  .copyBtn:active{
    filter:brightness(1.4);
  }
  .copied{
    display: block;
    position: absolute;
    bottom: -10px;
    right: 0px;
    content: "Copied";
    color: var(--third);
    animation: spawn 0.5s ease-in infinite;
  }
  .hide{
    display: none !important;
  }
  @keyframes spawn {
    0%{
      bottom: -10px;
    }
    100%{
      bottom: 50px;
    }
  }
`;

// Append the <style> element to the <head>
document.head.appendChild(styleElement);

// Create a <div> for the following text
const followText = document.createElement('div');
followText.id = 'followText';
followText.classList.add('hide') // todo : swith on and off follow mouse box
document.body.appendChild(followText);

// Create a <div> for the following text
let alertBox = `
  
<div id="alertBox" class="hide">
  <div id="box">
      <div id="closeAlert">x</div>
      <p class="titles">SELECTOR!</p>
      <div id="elmTags">
        <div class="tag">
          <p class="tagType tagText">ID</p>
          <p class="tagValue tagText">block</p>
          <p class="tagCount tagText">1</p>
        </div>
        <div class="tag">
          <p class="tagType tagText">class</p>
          <p class="tagValue tagText">room</p>
          <p class="tagCount tagText">20</p>
        </div>
        <div class="tag">
          <p class="tagType tagText">class</p>
          <p class="tagValue tagText">fite</p>
          <p class="tagCount tagText">5</p>
        </div>
        <div class="tag">
          <p class="tagType tagText">class</p>
          <p class="tagValue tagText">robe</p>
          <p class="tagCount tagText">3</p>
        </div>
      </div>
    
    <div id="elmSelector">
      <div id="tokenDisplay">
              <p id="token">xxxxxxxxxxxxxxx</p>
              <div class="copyBtn">
                <p>Copy</p>
                  <p class="copied hide">Copied!</p>
              </div>
          </div>  
    </div>
  </div>
</div>
`
document.body.insertAdjacentHTML("afterend", alertBox);

// add style/hightlight to the hovered element
document.addEventListener('mouseover', handleMouseOver);
document.addEventListener('mouseout', handleMouseOut);
document.addEventListener('mousemove', handleMouseMove);
// Event handler for mouseover
function handleMouseOver(event) {
  const hoveredElement = event.target;
  // Add the CSS class when the element is hovered
  hoveredElement.classList.add('hover-highlight');
  hoveredElementTextContent = hoveredElement.innerText;
}
// Event handler for mouseout
function handleMouseOut(event) {
  const hoveredElement = event.target;
  // Remove the CSS class when the mouse leaves the element
  hoveredElement.classList.remove('hover-highlight');
}
// Event handler for mousemove
function handleMouseMove(event) {
  // Update the position of the follow text
  followText.style.left = event.pageX + 20 + 'px';
  followText.style.top = event.pageY + 20 + 'px';
  followText.textContent = hoveredElementTextContent || "NULL";
}


const alertBoxContainer = document.getElementById('alertBox');
const alert = document.getElementById('box');
const closeAlert = document.getElementById('closeAlert');
const copyBtn = document.getElementsByClassName('copyBtn')[0];
const copiedPopup = document.getElementsByClassName('copied')[0];
const queryText = document.getElementById('token');

alertBoxContainer.addEventListener('click', function(e){
  if(alert.contains(e.target)){
    //inside
  }else{
    //outside
    alertBoxContainer.classList.toggle('hide');
  }
})

closeAlert.addEventListener('click', function () {
  alertBoxContainer.classList.toggle('hide');
  queryText.innerText = 'Pick One From Above..'
})

copyBtn.addEventListener('click', function () {
  copyToClipboard(queryText.innerText)
  copiedPopup.classList.toggle('hide');
  setTimeout(() => {
    copiedPopup.classList.toggle('hide');
  }, 500)
})


/***********************************

      Handle Sending Messages

***********************************/
function sendMessage(payload) {
  // Send a message to service worker
  chrome.runtime.sendMessage(payload, response => {
    console.log("Response from service worker:", response);
  });
}

/***********************************

      Handle Received Messages

***********************************/
// Listen for messages from service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'generatedToken':
      token = message.payload.token;
      injectTokenFn(token)
      break;

    case "getSelectors":
      allSelectors = getAllSelectorsForToken(token)
      console.log(allSelectors);
      alertBoxContainer.classList.toggle('hide');
      // generate 
      let generatedTags = generateTagsHtml(allSelectors);
      const elmTagsContainer = document.getElementById('elmTags');
      elmTagsContainer.innerHTML = generatedTags;
      sendResponse('Handling Selectors..')
      break;

    default:
      break;
  }
  sendResponse({ message: "from_foreground" }); // Optional response
});


/***********************************

            Token Handlers

***********************************/
/* INJECT TOKEN */
function injectTokenFn(token) {
  // Check if the token is not null
  if (token !== null) {
    // inject token to the chosen HTML element
    document.addEventListener('click', (event) => {
      // prevent submit form or changing page
      event.preventDefault();
      if (!event.target.closest('#alertBox')) {
        // clear dom from previouse token
        clearElementsWithPreviousToken(token)
        // inject the token
        const clickedElement = event.target;
        clickedElement.setAttribute('data-fls', token);
        clickedElement.style = 'border: 2px dotted blue;';
      }
    });
  }
}
/* CLEAR PREVIOUSE TOKEN */
// CLEAR Elements With Previouse Token
function clearElementsWithPreviousToken(token) {
  const elementsWithPreviousToken = document.querySelectorAll('[data-fls]');
  elementsWithPreviousToken.forEach(element => {
    // Check if the data-key attribute matches the previous token
    if (element.getAttribute('data-fls') === token) {
      // Remove the attribute
      element.removeAttribute('data-fls');
      element.style = 'border-width: 0px';
    }
  });
}

//todo: fix tags generator
/* GENERATE TAGS HTML */
function generateTagsHtml(data) {
  
  // tags html generator
  function htmlTagTemplate(obj) {
    let type = {
      "id":    'getElementById',
      "class": 'getElementsByClassName',
      'tag':   'getElementsByTagName'
    }
    let queryGenerator = `document.${type[obj.type]}('${obj.name}')${(obj.type == 'id')?'':'['+obj.index+']'}`
    return `
        <div class="tag" data-query="${queryGenerator}" onclick="document.getElementById('token').innerText=event.target.parentElement.getAttribute('data-query')">
        <p class="tagType tagText">${obj.type}</p>
        <p class="tagValue tagText">${obj.name}</p>
        <p class="tagCount tagText">${obj.count}</p>
        </div>
        `
  }
  // HTML tags result
  selectorTagsHTML = "";
  // data
  let idData = data?.idSelector;
  let classesData = data?.classNamesSelector;
  let tagData = data?.tagNameSelector;
  // generate ID html tags
  if (idData) {
    selectorTagsHTML += htmlTagTemplate(idData)
  }
  // generate CLASS html tags
  if (Array.isArray(classesData)) {
    classesData.forEach(obj => {
      selectorTagsHTML += htmlTagTemplate(obj)
    });
  }
  // generate TAG html tags
  selectorTagsHTML += htmlTagTemplate(tagData)

  return selectorTagsHTML;
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




