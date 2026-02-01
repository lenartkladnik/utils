function changeContents(id, new_type) {
    document.getElementById(id).childNodes.forEach(el => {
        if (el.tagName && el.tagName.toLowerCase() == 'div') {
            hideElement(el);

            if (el.id == new_type.id + '-contents') {
                showElement(el);
            }
        }
    });
}

// Fill in esc-seq-str and fb-str
function applyEscFbText() {
    Array.from(document.getElementsByClassName('esc-seq-str')).forEach(el => {
        el.textContent = getOpt('esc-seq');
    });
    Array.from(document.getElementsByClassName('fb-str')).forEach(el => {
        el.textContent = getOpt('fb-color');
    });
}
applyEscFbText();

function changeOptAnsi(container, new_opt) {
    changeOpt(container, new_opt);
    applyEscFbText();
}
