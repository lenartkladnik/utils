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

function similarity(s0, s1) {
    var parts = s0.split(" ");
    if (parts.length > 1) {
        var min_s = Infinity;
        for (let i = 0; i < parts.length; i++) {
            let s = similarity(parts[i], s1);
            if (s < min_s) {
                min_s = s;
            }
        }

        return min_s;
    }

    if (s0 === s1) {
        return 0;
    }

    if (!(containsEvery(s0, s1))) {
        return Infinity;
    }

    var l0 = s0.length;
    var l1 = s1.length;

    if (l0 === 0 || l1 === 0) {
        // Return no results if there is no query or data
        return Infinity;
    }

    var d = l0 / l1;

    if (d === 1) {
        return levenshtein(s0, s1);
    }

    var min = Infinity;
    if (d > 0) {
        for (let i = 0; i < Math.floor(d); i++) {
            let l = levenshtein(s0.substring(0 + i, l1 + i), s1);
            if (l < min) {
                min = l;
                if (l <= 0) { return l; }
            }
        }

        return min;
    }

    else {
        for (let i = 0; i < Math.floor(l1 / l0); i++) {
            let l = levenshtein(s1.substring(0 + i, l0 + i), s0);
            if (l < min) {
                min = l;
                if (l <= 0) { return l; }
            }
        }

        return min;
    }

    return Infinity; // Something went wrong, so the safest bet is to say they do not match at all
}

// Source - https://stackoverflow.com/a/35279162
// Posted by gustf, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-13, License - CC BY-SA 3.0

function levenshtein(s, t) {
    // console.log(`Comparing '${s}' with '${t}'.`)
    if (s === t) {
        return 0;
    }
    var n = s.length, m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    var x = 0, y, a, b, c, d, g, h, k;
    var p = new Array(n);
    for (y = 0; y < n;) {
        p[y] = ++y;
    }

    for (; (x + 3) < m; x += 4) {
        var e1 = t.charCodeAt(x);
        var e2 = t.charCodeAt(x + 1);
        var e3 = t.charCodeAt(x + 2);
        var e4 = t.charCodeAt(x + 3);
        c = x;
        b = x + 1;
        d = x + 2;
        g = x + 3;
        h = x + 4;
        for (y = 0; y < n; y++) {
            k = s.charCodeAt(y);
            a = p[y];
            if (a < c || b < c) {
                c = (a > b ? b + 1 : a + 1);
            }
            else {
                if (e1 !== k) {
                    c++;
                }
            }

            if (c < b || d < b) {
                b = (c > d ? d + 1 : c + 1);
            }
            else {
                if (e2 !== k) {
                    b++;
                }
            }

            if (b < d || g < d) {
                d = (b > g ? g + 1 : b + 1);
            }
            else {
                if (e3 !== k) {
                    d++;
                }
            }

            if (d < g || h < g) {
                g = (d > h ? h + 1 : d + 1);
            }
            else {
                if (e4 !== k) {
                    g++;
                }
            }
            p[y] = h = g;
            g = d;
            d = b;
            b = c;
            c = a;
        }
    }

    for (; x < m;) {
        var e = t.charCodeAt(x);
        c = x;
        d = ++x;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || d < c) {
                d = (a > d ? d + 1 : a + 1);
            }
            else {
                if (e !== s.charCodeAt(y)) {
                    d = c + 1;
                }
                else {
                    d = c;
                }
            }
            p[y] = d;
            c = a;
        }
        h = d;
    }

    return h;
}

function containsEvery(string, substring) {
    var letters = [...string];
    return [...substring].every(x => {
        var index = letters.indexOf(x);
        if (~index) {
            letters.splice(index, 1);
            return true;
        }
    });
}
