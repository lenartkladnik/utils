function clipValue(el, prefix = '', suffix = '') {
    navigator.clipboard.writeText(prefix + el.textContent + suffix);
}

function hideElement(element) {
    try {
        element.style.opacity = 0;
        element.style.display = "none";
    } catch (e) {
        console.warn(`[hideElement] Couldn't hide element '${element}': ${e}`);
    }
}

function showElement(element) {
    try {
        element.style.opacity = 1;
        const display = window.getComputedStyle(element).getPropertyValue('--display');
        element.style.display = display;
    } catch (e) {
        console.warn(`[showElement] Couldn't show element '${element}': ${e}`);
    }
}

function toggleVisibility(element) {
    if (element.style.opacity == 0) {
        showElement(element);
    }
    else {
        hideElement(element);
    }
}

function changeOpt(container, new_opt) {
    let found = false;
    document.getElementById(container).childNodes.forEach(el => {
        if (el.tagName && el.tagName.toLowerCase() == 'span') {
            el.classList.remove('selected');
            if (el == new_opt) {
                el.classList.add('selected');
                found = true;
            }
        }
    });
    if (found) {
        Array.from(document.getElementsByClassName(`for-${container}`)).forEach(el => {
            el.textContent = new_opt.textContent;
            document.getElementById(container).childNodes.forEach(el1 => {
              if (el1.tagName && el1.tagName.toLowerCase() == 'span') {
                  el1.style.width = `${el.parentElement.offsetWidth - 10}px`;
              }
            });
        });
    }
}

function getOpt(container) {
    var content = "";
    document.getElementById(container).childNodes.forEach(el => {
        if (el.tagName && el.tagName.toLowerCase() == 'span') {
            if (el.classList.contains('selected')) {
                content = el.getAttribute('value');
            }
        }
    });

    return content;
}

// Init all the dropdowns
Array.from(document.getElementsByClassName("dropdown")).forEach(el => {
    changeOpt(el.id, el.firstElementChild);
});

function changeType(container, action, new_type) {
    document.getElementById(container).childNodes.forEach(el => {
        if (el.tagName && el.tagName.toLowerCase() == 'span') {
            el.classList.remove('selected');
            if (el == new_type) {
                el.classList.add('selected');
            }
        }
    });

    action();
}
