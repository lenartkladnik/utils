def text_request(request):
    return any([x in request.headers["User-Agent"].lower() for x in ["curl", "python", "binget", "java", "perl", "php", "pycurl", "go-http"]])
