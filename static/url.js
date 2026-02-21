function HTTPStatusChange(input) {
    const threshold = 3;
    var query = input.value.toLowerCase();
    var result = [];

    // Only digits, means status code search
    const test_code = (/^\d+$/.test(query));

    Array.from(document.getElementsByClassName("http-status-opt")).forEach(el => {
        el.style.display = "none"; // Ensure all are hidden
        if (test_code ? similarity(el.dataset.code.toLowerCase(), query) < threshold : (similarity(el.dataset.desc.toLowerCase(), query) < threshold && el.dataset.desc.toLowerCase() != "undefined")) {
            result.push(el);
        }
    });

    result.forEach(el => {
        el.style.display = "block";
    });
}
