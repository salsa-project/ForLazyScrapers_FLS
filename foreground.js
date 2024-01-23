let token = null;


/***********************************

      Handle Sending Messages

***********************************/
function sendMessage(payload){
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
      handleTokenResponse(token)
    break;

    case "getSelectors":
      //todo: gett selectors
      let selectorsRes = getSelectorForToken(token)
      console.log(selectorsRes);
      sendResponse('Handling Selectors..')
    break;

    default:
      break;
  }
  console.log("Message from service worker:", message);
  sendResponse({ message: "from_foreground" }); // Optional response
});


/***********************************

            Other Handles

***********************************/
function handleTokenResponse(token) {
  console.log(token)
  // Check if the token is not null
  if (token !== null) {
    // inject token to the chosen HTML element
    document.addEventListener('click', (event) => {
      // prevent submit form or changing page
      event.preventDefault();
      // clear dom from previouse token
      clearElementsWithPreviousToken(token)
      // inject the token
      const clickedElement = event.target;
      clickedElement.setAttribute('data-fls', token);
    });
  }
}

// CLEAR Elements With Previouse Token
function clearElementsWithPreviousToken(token) {
  const elementsWithPreviousToken = document.querySelectorAll('[data-fls]');
  elementsWithPreviousToken.forEach(element => {
    // Check if the data-key attribute matches the previous token
    if (element.getAttribute('data-fls') === token) {
      // Remove the attribute
      element.removeAttribute('data-fls');
    }
  });
}


// get target element
function getSelectorForToken(token) {
  const matchingElement = document.querySelector(`[data-fls="${token}"]`);
  const selector = getSelector(matchingElement);
  return selector;
}

function getSelector(element) {
  if (!element) return null;

  const selectorList = [];
  while (element.parentElement) {
    const part = getElementSelectorPart(element);
    if (part) {
      selectorList.unshift(part);
    }
    element = element.parentElement;
  }

  return selectorList.join(' ');
}

function getElementSelectorPart(element) {
  if (!element) return null;

  const tagSelector = element.tagName.toLowerCase();
  if (element.id) {
    return `#${element.id}`;
  }

  const classList = Array.from(element.classList);
  const classes = classList.map(className => `.${className}`).join('');
  return `${tagSelector}${classes}`;
}
