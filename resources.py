def ansi_colors() -> list[tuple[int, str, str]]:
    colors = []

    # source: https://en.wikipedia.org/wiki/ANSI_escape_code
    for code in range(0, 16):
        if code > 8:
            level = 255
        elif code == 7:
            level = 229
        else:
            level = 205

        r = 127 if code == 8 else level if (code & 1) != 0 else 92 if code == 12 else 0
        g = 127 if code == 8 else level if (code & 2) != 0 else 92 if code == 12 else 0
        b = 127 if code == 8 else 238 if code == 4 else level if (code & 4) != 0 else 0

        colors.append((code, f"rgb({r}, {g}, {b})", "white" if (r + b + g) / 3 < 127 else "black"))

    for red in range(0, 6):
        for green in range(0, 6):
            for blue in range(0, 6):
                code = 16 + (red * 36) + (green * 6) + blue

                r = red   * 40 + 55 if red   != 0 else 0
                g = green * 40 + 55 if green != 0 else 0
                b = blue  * 40 + 55 if blue  != 0 else 0

                colors.append((code, f"rgb({r}, {g}, {b})", "white" if (r + b + g) / 3 < 127 else "black"))

    for gray in range(0, 24):
        level = gray * 10 + 8
        code = 232 + gray

        colors.append((code, f"rgb({level}, {level}, {level})", "white" if level < 127 else "black"))

    return colors

ansi_cursor_controls = [
    (["[H"], "Moves the cursor to the home position (0, 0)."),
    (["[{line}:{column}H", "[{line}:{column}f"], "Moves cursor to line # and column #."),
    (["[#A"], "Moves cursor up # lines."),
    (["[#B"], "Moves cursor down # lines."),
    (["[#C"], "Moves cursor right # columns."),
    (["[#D"], "Moves cursor left # columns."),
    (["[#E"], "Moves cursor to the beginning of the next line, # lines down."),
    (["[#F"], "Moves cursor to the beginning of the previous line, # lines up."),
    (["[#G"], "Moves cursor to column #."),
    (["[6n"], "Reports the cursor position by transmitting ESC[{line};{column}R."),
    ([" M"], "Moves cursor one line up scrolling if needed."),
    (["[#S"], "Scroll whole page up by # (default 1) lines. New lines are added at the bottom."),
    (["[#T"], "Scroll whole page down by # (default 1) lines. New lines are added at the top."),
    ([" 7", "[s"], "Saves cursor position"),
    ([" 8", "[u"], "Returns to the saved cursor position."),
    (["[?25h"], "Show cursor."),
    (["[?25l"], "Hide cursor."),
    (["[?1004h"], "Enable reporting focus. Reports whenever terminal emulator enters or exits focus as ESC [I and ESC [O, respectively."),
    (["[?1004l"], "Disable reporting focus."),
    (["[?1049h"], "Enable alternative screen buffer, from xterm."),
    (["[?1049l"], "Disable alternative screen buffer."),
    (["[?2004h"], "Turn on bracketed paste mode. In bracketed paste mode, text pasted into the terminal will be surrounded by ESC [200~ and ESC [201~; programs running in the terminal should not treat characters bracketed by those sequences as commands (Vim, for example, does not treat them as commands)."),
    (["[?2004l"], "Turn off bracketed paste mode."),
]

ansi_erase = [
    (["[#J"], "Erase in display. If # is 0 (or missing), clear from cursor to the end of the screen. If # is 1, clear from the cursor to the beginning of the screen. If # is 2, clear the entire screen. If # is 3, clear the entire screen and the scrollback buffer."),
    (["[#K"], "Erases part of the line. If # is 0 (or missing), clear from cursor to the end of the line. If # is 1, clear from cursor to beginning of the line. If # is 2, clear entire line. Cursor position does not change. ")
]

ansi_screen = [
    (["[={value}h"], "Changes the screen width or type to the mode specified by value."),
    (["[=0h"], "40 x 25 monochrome (text)"),
    (["[=1h"], "40 x 25 color (text)"),
    (["[=2h"], "80 x 25 monochrome (text)"),
    (["[=3h"], "80 x 25 color (text)"),
    (["[=4h"], "320 x 200 4-color (graphics)"),
    (["[=5h"], "320 x 200 monochrome (graphics)"),
    (["[=6h"], "640 x 200 monochrome (graphics)"),
    (["[=7h"], "Enables line wrapping"),
    (["[=13h"], "320 x 200 color (graphics)"),
    (["[=14h"], "640 x 200 color (16-color graphics)"),
    (["[=15h"], "640 x 350 monochrome (2-color graphics)"),
    (["[=16h"], "640 x 350 color (16-color graphics)"),
    (["[=17h"], "640 x 480 monochrome (2-color graphics)"),
    (["[=18h"], "640 x 480 color (16-color graphics)"),
    (["[=19h"], "320 x 200 color (256-color graphics)"),
    (["[={value}l"], "Resets the mode by using the same values that Set Mode uses, except for 7, which disables line wrapping. The last character in this escape sequence is a lowercase L.")
]

ansi_general = [
    (["[0m"], "Reset or normal."),
    (["[1m"], "Bold or increased intensity."),
    (["[2m"], "Faint, decreased intensity, or dim"),
    (["[3m"], "Italic"),
    (["[4m"], "Underline"),
    (["[5m"], "Slow blink"),
    (["[6m"], "Rapid blink"),
    (["[7m"], "Reverse video or invert"),
    (["[8m"], "Conceal or hide"),
    (["[9m"], "Crossed-out, or strike"),
    (["[10m"], "Primary (default) font"),
    (["[{11–19}m"], "Alternative font"),
    (["[20m"], "Fraktur (Gothic)"),
    (["[21m"], "Doubly underlined; or: not bold"),
    (["[22m"], "Normal intensity"),
    (["[23m"], "Neither italic, nor blackletter"),
    (["[24m"], "Not underlined"),
    (["[25m"], "Not blinking"),
    (["[26m"], "Proportional spacing"),
    (["[27m"], "Not reversed"),
    (["[28m"], "Reveal"),
    (["[29m"], "Not crossed out"),
    (["[{30–37}m"], "Set foreground color"),
    (["[38m"], "Set foreground color"),
    (["[39m"], "Default foreground color"),
    (["[{40–47}m"], "Set background color"),
    (["[48m"], "Set background color"),
    (["[49m"], "Default background color"),
    (["[50m"], "Disable proportional spacing"),
    (["[51m"], "Framed"),
    (["[52m"], "Encircled"),
    (["[53m"], "Overlined"),
    (["[54m"], "Neither framed nor encircled"),
    (["[55m"], "Not overlined"),
    (["[58m"], "Set underline color"),
    (["[59m"], "Default underline color"),
    (["[60m"], "Ideogram underline or right side line"),
    (["[61m"], "Ideogram double underline, or double line on the right side"),
    (["[62m"], "Ideogram overline or left side line"),
    (["[63m"], "Ideogram double overline, or double line on the left side"),
    (["[64m"], "Ideogram stress marking"),
    (["[65m"], "No ideogram attributes"),
    (["[73m"], "Superscript"),
    (["[74m"], "Subscript"),
    (["[75m"], "Neither superscript nor subscript"),
    (["[{90–97}m"], "Set bright foreground color"),
    (["[{100–107}m"], "Set bright background color"),
    (["[5i"], "AUX port on."),
    (["[4i"], "AUX port off."),
    ([" N"], "Single Shift Two (SS2)"),
    ([" O"], "Single Shift Three (SS3)"),
    ([" P"], "Device Control String (DCS)"),
    ([" ["], "Control Sequence Introducer (CSI)"),
    ([" \\"], "String Terminator (ST)"),
    ([" ]"], "Operating System Command (OSC)"),
    ([" X"], "Start of String (SOS)"),
    ([" ^"], "Privacy Message (PM)"),
    ([" _"], "Application Program Command (APC)"),
    ([" # 3"], "DEC Double-Height Letters, Top Half"),
    ([" # 4"], "DEC Double-Height Letters, Bottom Half"),
    ([" # 5"], "DEC Single-Width Line"),
    ([" # 6"], "DEC Double-Width Line"),
]
