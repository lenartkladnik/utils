def is_text_request(request):
    text_request_headers = [
        "curl",
        "python",
        "binget",
        "java",
        "perl",
        "php",
        "pycurl",
        "go-http"
    ]
    return any([x in request.headers["User-Agent"].lower() for x in text_request_headers])
