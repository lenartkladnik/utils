function clipInputValue(el, prefix = '', suffix = '') {
    navigator.clipboard.writeText(prefix + el.value + suffix);
}

let color_type = "hex";

const drag_x = document.querySelectorAll(".draggable-x");
const drag_y = document.querySelectorAll(".draggable-y");

const colors_1d = [
    [255, 0, 0],
    [255, 255, 0],
    [0, 255, 0],
    [0, 255, 255],
    [0, 0, 255],
    [255, 0, 255],
    [255, 0, 0]
];

let clampY = 94;
let clampX = 96;

let copy_timeouts = [];
let original_color = "";

function recalcColorSlider(percentage) {
    let [r, g, b] = getColor1D(colors_1d, percentage);

    document.getElementById("color-picker-sel").style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// source: https://labex.io/tutorials/javascript-hsl-to-rgb-conversion-28378
function HSLToRGB(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

function RGBToHSL(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;

    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `${h}, ${Math.round(s)}%, ${Math.round(l)}%`;
}

function applyData(cc, value, prefix = '', suffix = '') {
    cc.value = value;
    cc.tabIndex = -1;
    cc.onmousedown = function(e) {
        e.preventDefault();
    };
    cc.onclick = function(){
        copy_timeouts.push(setTimeout(clipInputValue, 600, this, prefix, suffix));
    };
    cc.ondblclick = function(e){
        if (copy_timeouts) {
            for (const copy_timeout of copy_timeouts) {
                clearTimeout(copy_timeout);
            }
            copy_timeouts = [];
        }
        this.focus();
        this.select();
    }
}

function setInputValue(r, g, b) {
    let text_color = r > 255 / 2 || g > 255 / 2 || b > 255 / 2 ? "#101010" : "#EFEFEF";

    let hex = r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

    let color = `rgb(${r}, ${g}, ${b})`;
    document.getElementById("color-display").style.backgroundColor = color;
    document.getElementById("color-code-chooser").style.backgroundColor = color.substr(0, color.length - 1) + ', 0.4)';

    let cc = document.getElementById("color-code");
    cc.style.color = text_color;

    if (cc.classList.contains("hex-code")) {
        applyData(cc, hex, '#');

    } else if (cc.classList.contains("rgb-code")) {
        applyData(cc, `${r}, ${g}, ${b}`, 'rgb(', ')');

    } else if (cc.classList.contains("hsl-code")) {
        let hsl = RGBToHSL(r, g, b);
        applyData(cc, hsl, 'hsl(', ')');

    } else if (cc.classList.contains("ansi-code")) {
        applyData(cc, `;2;${r};${g};${b}m`);
    }

    original_color = document.getElementById("color-code").value;
}

function recalcColorMain() {
    let p = document.getElementById("slider-sel").style.left || "0%";
    let [r1, g1, b1] = getColor1D(colors_1d, parseInt(p.substr(0, p.length - 1)));

    let px = document.getElementById("main-sel").style.left;
    let py = document.getElementById("main-sel").style.top;

    let [r, g, b] = getColor2D([r1, g1, b1], parseInt(px.substr(0, px.length - 1)) / clampX * 100, parseInt(py.substr(0, py.length - 1)) / clampY * 100);
    setInputValue(r, g, b);
}

// Initial calculations
recalcColorSlider(0);
recalcColorMain();

function onMouseDragY(event, element) {

    let topValue = parseInt(window.getComputedStyle(element).top);

    let px = topValue + event.movementY;
    let per = px / parseInt(window.getComputedStyle(element.parentElement).height) * 100;

    if (per > clampY) { per = clampY };
    if (per < 0) { per = 0 };

    element.style.top = `${per}%`;

    if (element.id == "main-sel") {
        recalcColorMain();
    }
}

function onMouseDragX(event, element) {
    let leftValue = parseInt(window.getComputedStyle(element).left);

    let px = leftValue + event.movementX;
    let per = px / parseInt(window.getComputedStyle(element.parentElement).width) * 100;

    if (per > clampX) { per = clampX; }
    if (per < 0) { per = 0; }

    element.style.left = `${per}%`;

    if (element.id == "slider-sel") {
        recalcColorSlider(per / clampX * 100);
        recalcColorMain();
    } else if (element.id == "main-sel") {
        recalcColorMain();
    }
}

drag_x.forEach((element) => {
    element.addEventListener("mousedown", (e) => {
    const onMove = (event) => onMouseDragX(event, element);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onMove);
        }, { once: true });
    });
});

drag_y.forEach((element) => {
    element.addEventListener("mousedown", (e) => {
    const onMove = (event) => onMouseDragY(event, element);
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", onMove);
        }, { once: true });
    });
});

function getColor1D(colors, percentage) {
    percentage = Math.round(percentage);
    pos = (colors.length - 1) * percentage / 100
    c1 = Math.floor(pos);
    c2 = Math.ceil(pos);

    if (c1 == c2) {
        const [r, g, b] = colors[c1];
        return [r, g, b];
    }

    const localPercent = pos - c1;

    const startColor = colors[c1];
    const endColor = colors[c2];

    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * localPercent);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * localPercent);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * localPercent); 

    return [r, g, b];
}

function getColor2D(base, xPercent, yPercent) {
    [xPercent, yPercent] = [Math.round(xPercent), Math.round(yPercent)];
    let [r, g, b] = base;

    const xFactor = xPercent / 100;
    r = Math.round(255 + (r - 255) * xFactor);
    g = Math.round(255 + (g - 255) * xFactor);
    b = Math.round(255 + (b - 255) * xFactor);

    const yFactor = yPercent / 100;
    r = Math.round(r * (1 - yFactor));
    g = Math.round(g * (1 - yFactor));
    b = Math.round(b * (1 - yFactor));

    return [r, g, b];
}

function getPosition2D(base, r, g, b) {
    let best_x = 0;
    let best_y = 0;
    let min = Infinity;

    for (let x = 0; x <= 100; x++) {
        for (let y = 0; y <= 100; y++) {
            const [cr, cg, cb] = getColor2D(base, x, y);

            const distance = Math.sqrt((cr - r) ** 2 + (cg - g) ** 2 + (cb - b) ** 2);
            if (distance < min) {
                min = distance;
                best_x = x;
                best_y = y;
            }
        }
    }

    return [best_x, best_y];
}

function updateSliderForColor(r, g, b) {
    let best_match = null;
    let min = Infinity;

    for (let p1d = 0; p1d <= 100; p1d++) {
        let base = getColor1D(colors_1d, p1d);
        let [x_perc, y_perc] = getPosition2D(base, r, g, b);

        let [cr, cg, cb] = getColor2D(base, x_perc, y_perc);
        const distance = Math.sqrt((cr - r) ** 2 + (cg - g) ** 2 + (cb - b) ** 2);

        if (distance < min) {
            min = distance;
            best_match = {p1d, x_perc, y_perc};
            if (distance == 0) {
                break;
            }
        }
    }

    setInputValue(r, g, b);
    document.getElementById("slider-sel").style.left = best_match.p1d + "%";
    document.getElementById("main-sel").style.left = ((best_match.x_perc / 100) * clampX) + "%";
    document.getElementById("main-sel").style.top = ((best_match.y_perc / 100) * clampY) + "%";

    return best_match
}

function HEXToRGB(hex) {
    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16)
    ]
}

function recalcPosition(e) {
    e.preventDefault();

    try {
        let r, g, b = NaN;
        let color = document.getElementById("color-code").value;

        if (color_type == "hex") {
            if (color[0] == '#') {
                color = color.substr(1, color.length)
            }

            if (color.length == 6) {
                [r, g, b] = HEXToRGB(color);
            }
        }
        else if (color_type == "rgb") {
            if (color.startsWith("rgb(")) {
                color = color.substr(4, color.length)
            }
            color = color.replaceAll(" ", "");
            color = color.replaceAll("(", "").replaceAll(")", "");
            [r, g, b] = color.split(",");
            [r, g, b] = [parseInt(r), parseInt(g), parseInt(b)];

        }
        else if (color_type == "hsl") {
            if (color.startsWith("hsl(")) {
                color = color.substr(4, color.length)
            }
            color = color.replaceAll("%", "");
            color = color.replaceAll("(", "").replaceAll(")", "");
            color = color.replaceAll(" ", "");
            [h, s, l] = color.split(",");
            [r, g, b] = HSLToRGB(parseInt(h), parseInt(s), parseInt(l));
        }
        else if (color_type == "ansi") {
            [_, r, g, b] = color.match(/;2;(\d+);(\d+);(\d+)m/);
            [r, g, b] = [parseInt(r), parseInt(g), parseInt(b)];
        }

        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            let best_match = updateSliderForColor(r, g, b);
            recalcColorSlider(best_match.p1d);
        }
        else {
            if (r && b && g) {
                setInputValue(r, g, b);
            }
        }
    }
    finally {
        document.getElementById("color-code").value = original_color;
    }
}

function changeColorTypeTo(code) {
    color_type = code;
    Array.from(document.getElementById('color-code-chooser').children).forEach((el) => el.classList.remove('selected'))
    document.getElementById(code).classList.add('selected');
    document.getElementById('color-code').className = `${code}-code`;

    recalcColorMain();
}
