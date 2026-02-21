import urllib.request
import urllib.error
from contextlib import closing
import requests

def get_status(uri):
    color = ""
    text_r = ""

    try:
        code = requests.get(uri).status_code
        text_r = f"Up [{code}]"
        if code < 400:
            color = "green-basic-color"
        else:
            color = "yellow-basic-color"
    except requests.exceptions.ConnectionError:
        color = "red-basic-color"
        text_r = "Down"

    except requests.exceptions.InvalidSchema:
        try:
            with closing(urllib.request.urlopen(uri, timeout=2)) as _: pass
        except urllib.error.URLError as e:
            color = "yellow-basic-color"
            text_r = str(e)

            if "unknown url type" in str(e):
                text_r = "Unknown URL schema"

            elif "timed out" in str(e):
                text_r = "Timed out"

            elif "No address associated with hostname" in str(e):
                color = "red-basic-color"
                text_r = "Down"

    return f"<span style=\"color: var(--{color})\">{text_r}</span>"
