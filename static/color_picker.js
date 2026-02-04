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

function recalcColorSlider(percentage) {
    let color = getColor1D(colors_1d, percentage);

    document.getElementById("color-picker-sel").style.backgroundColor = color;
}

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

function recalcColorMain() {
    let p = document.getElementById("slider-sel").style.left || "0%";
    let color_raw = getColor1D(colors_1d, parseInt(p.substr(0, p.length - 1)));
    let [_1, r1, g1, b1] = color_raw.match(/rgb\((\d+), (\d+), (\d+)\)/);

    let px = document.getElementById("main-sel").style.left;
    let py = document.getElementById("main-sel").style.top;

    let color = getColor2D([r1, g1, b1], parseInt(px.substr(0, px.length - 1)) / clampX * 100, parseInt(py.substr(0, py.length - 1)) / clampY * 100);
    let [_, r, g, b] = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
    r = parseInt(r);
    g = parseInt(g);
    b = parseInt(b);

    let text_color = r > 255 / 2 || g > 255 / 2 || b > 255 / 2 ? "#101010" : "#EFEFEF";

    let hex = r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

    document.getElementById("color-display").style.backgroundColor = color;
    document.getElementById("color-code-chooser").style.backgroundColor = color.substr(0, color.length - 1) + ', 0.4)';

    let cc = document.getElementById("color-code");
    cc.style.color = text_color;

    if (cc.classList.contains("hex-code")) {
        cc.textContent = hex;
        cc.onclick = function(){clipValue(this, '#')};

    } else if (cc.classList.contains("rgb-code")) {
        cc.textContent = `${r}, ${g}, ${b}`;
        cc.onclick = function(){clipValue(this, 'rgb(', ')')};

    } else if (cc.classList.contains("hsl-code")) {
        let hsl = RGBToHSL(r, g, b);
        cc.textContent = hsl;
        cc.onclick = function(){clipValue(this, 'hsl(', ')')};

    } else if (cc.classList.contains("ansi-code")) {
        cc.textContent = `;2;${r};${g};${b}m`;
        cc.onclick = function(){clipValue(this)};
    }
}

recalcColorMain(); // Initial calculation

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
    pos = (colors.length - 1) * percentage / 100
    c1 = Math.floor(pos);
    c2 = Math.ceil(pos);

    if (c1 == c2) {
        const [r, g, b] = colors[c1];
        return `rgb(${r}, ${g}, ${b})`;
    }

    const localPercent = pos - c1;

    const startColor = colors[c1];
    const endColor = colors[c2];

    const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * localPercent);
    const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * localPercent);
    const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * localPercent);

    return `rgb(${r}, ${g}, ${b})`;
}

function getColor2D(base, xPercent, yPercent) {
    let [r, g, b] = base;

    const xFactor = xPercent / 100;
    r = Math.round(255 + (r - 255) * xFactor);
    g = Math.round(255 + (g - 255) * xFactor);
    b = Math.round(255 + (b - 255) * xFactor);

    const yFactor = yPercent / 100;
    r = Math.round(r * (1 - yFactor));
    g = Math.round(g * (1 - yFactor));
    b = Math.round(b * (1 - yFactor));

    return `rgb(${r}, ${g}, ${b})`;
}

function changeColorTypeTo(code) {
    Array.from(document.getElementById('color-code-chooser').children).forEach((el) => el.classList.remove('selected'))
    document.getElementById(code).classList.add('selected');
    document.getElementById('color-code').className = `${code}-code`;

    recalcColorMain();
}
