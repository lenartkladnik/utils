from flask import Flask, render_template, request
import waitress
from lists import tools_list, ansi_colors, ansi_cursor_controls, ansi_erase, ansi_screen, ansi_general, ascii_table
from resources import text_request
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html", tools=tools_list)

@app.route('/public-ip')
def public_ip():
    if text_request(request):
        return f"{request.remote_addr}\n"

    return render_template("public_ip.html", public_ip=request.remote_addr)

@app.route('/color-picker')
def color_picker():
    return render_template("color_picker.html")

@app.route('/ansi')
def ansi_codes():
    return render_template("ansi_codes.html", colors=ansi_colors(), cursor_controls=ansi_cursor_controls, erase=ansi_erase, screen=ansi_screen, general=ansi_general)

@app.route('/ascii')
def ascii():
    return render_template("ascii.html", ascii=ascii_table, round=round)

@app.route('/status', methods=["GET", "POST"])
def status():
    if request.form:
        try:
            return render_template("status.html", status=f"<span style=\"color: var(--green-basic-color)\">Up [{requests.get(request.form['uri']).status_code}]</span>")
        except requests.exceptions.ConnectionError:
            return render_template("status.html", status="<span style=\"color: var(--red-basic-color)\">Down</span>")

    return render_template("status.html")

if __name__ == '__main__':
    waitress.serve(app, port=5009)
