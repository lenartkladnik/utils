from flask import Flask, render_template, request
import waitress
from resources import ansi_colors, ansi_cursor_controls, ansi_erase, ansi_screen, ansi_general

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/public-ip')
def public_ip():
    return render_template("public_ip.html", public_ip=request.remote_addr)

@app.route('/color-picker')
def color_picker():
    return render_template("color_picker.html")

@app.route('/ansi')
def ansi_codes():
    return render_template("ansi_codes.html", colors=ansi_colors(), cursor_controls=ansi_cursor_controls, erase=ansi_erase, screen=ansi_screen, general=ansi_general)

@app.route('/unicode')
def unicode_chars():
    return render_template("unicode_chars.html")

@app.route('/converter')
def translator():
    # Bin to text, hex to dec, ...
    return render_template("converter.html")

if __name__ == '__main__':
    waitress.serve(app, port=5009)
