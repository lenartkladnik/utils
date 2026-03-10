from flask import Flask, render_template, request, abort
import waitress
from lists import tools_list, ansi_colors, ansi_cursor_controls, ansi_erase, ansi_screen, ansi_general, ascii_table, status_codes
from resources import is_text_request
import url_actions

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html", tools_list=tools_list)

@app.route('/public-ip')
def public_ip():
    ip = request.headers.get('CF-Connecting-IP') or request.remote_addr # Fallback to remote_addr in case this isn't hosted trough cloudflare tunnels

    if is_text_request(request):
        return f"{ip}\n"

    return render_template("public_ip.html", tools_list=tools_list, public_ip=ip)

@app.route('/color-picker')
def color_picker():
    return render_template("color_picker.html", tools_list=tools_list)

@app.route('/ansi')
def ansi_codes():
    return render_template("ansi_codes.html", tools_list=tools_list, colors=ansi_colors(), cursor_controls=ansi_cursor_controls, erase=ansi_erase, screen=ansi_screen, general=ansi_general)

@app.route('/ascii')
def ascii():
    return render_template("ascii.html", tools_list=tools_list, ascii=ascii_table, round=round)

@app.route('/url', methods=["GET", "POST"])
def status():
    if request.form:
        action = request.form["action-type"]

        if action == "status":
            return render_template("url.html", tools_list=tools_list, status=url_actions.get_status(request.form["uri"]), status_codes=status_codes)

        elif action == "check":
            return render_template("url.html", tools_list=tools_list, status_codes=status_codes)

    return render_template("url.html", tools_list=tools_list, status_codes=status_codes)

@app.route('/return-http-status/<int:code>')
def return_http_status(code):
    if code >= 200 and code < 600:
        return '', code

    return abort(404)

if __name__ == '__main__':
    waitress.serve(app, port=5009)
