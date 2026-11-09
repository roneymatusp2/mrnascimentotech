#!/usr/bin/env python3
"""Update the public two-page CV from its versioned original.

Requires PyMuPDF 1.28.2 (`python -m pip install pymupdf==1.28.2`).
Run from any directory: python scripts/update-cv.py
The fixed Git source makes reruns independent of an already updated PDF.
"""

from pathlib import Path
import re
import subprocess

import pymupdf as pdf


ROOT = Path(__file__).resolve().parents[1]
SOURCE = "0ef5a45:public/cv-tmp-m1.pdf"
OUTPUT = ROOT / "public/cv-tmp-m1.pdf"
BODY_SIZE = 9.0975
LEADING = 12.75
LEFT, RIGHT = 39.75, 555.75
INK = (26 / 255, 29 / 255, 33 / 255)
ACCENT = (11 / 255, 79 / 255, 108 / 255)
MUTED = (82 / 255, 88 / 255, 95 / 255)

source = subprocess.check_output(["git", "-C", str(ROOT), "show", SOURCE])
document = pdf.open(stream=source, filetype="pdf")
assert len(document) == 2, "The source CV must have two pages."
original_text = [page.get_text() for page in document]

# Reuse the actual embedded Liberation Sans subsets, retaining the original
# typography without depending on machine-installed replacement fonts.
font_data = {
    "regular": document.extract_font(8)[3],
    "regular_alt": document.extract_font(6)[3],
    "bold": document.extract_font(4)[3],
    "italic": document.extract_font(13)[3],
    "heading": document.extract_font(5)[3],
}
fonts = {name: pdf.Font(fontbuffer=data) for name, data in font_data.items()}


def register_fonts(page):
    for name, data in font_data.items():
        page.insert_font(fontname=f"CV{name}", fontbuffer=data)


def put(page, point, text, style="regular", size=BODY_SIZE, color=INK):
    missing = {c for c in text if not fonts[style].has_glyph(ord(c))}
    if missing and style == "regular":
        # The original PDF has several subsets of the same regular font.
        # Its digit 9 is in the contact-line subset rather than the body subset.
        x, y = point
        for char in text:
            char_style = "regular" if fonts["regular"].has_glyph(ord(char)) else "regular_alt"
            put(page, (x, y), char, char_style, size, color)
            x += fonts[char_style].text_length(char, fontsize=size)
        return
    assert not missing, f"Missing glyphs in {style}: {missing}"
    page.insert_text(point, text, fontname=f"CV{style}", fontsize=size, color=color)


def text_width(text, style="regular", size=BODY_SIZE):
    return sum(
        fonts["regular_alt" if style == "regular" and not fonts[style].has_glyph(ord(c)) else style]
        .text_length(c, fontsize=size)
        for c in text
    )


def paragraph(page, baseline, runs):
    """Wrap styled runs at the original margins, without shrinking the font."""
    lines, line, width = [], [], 0.0
    for style, content in runs:
        for token in re.findall(r"\s+|\S+", content):
            token = " " if token.isspace() else token
            token_width = text_width(token, style)
            if token != " " and line and width + token_width > RIGHT - LEFT:
                while line and line[-1][1] == " ":
                    line.pop()
                lines.append(line)
                line, width = [], 0.0
            if token == " " and not line:
                continue
            line.append((style, token))
            width += token_width
    if line:
        lines.append(line)
    for line in lines:
        x = LEFT
        for style, token in line:
            put(page, (x, baseline), token, style)
            x += text_width(token, style)
        assert x <= RIGHT + 0.01, "A CV line exceeds its original margin."
        baseline += LEADING
    return baseline + 3.0


first = document[0]
old_website = "mrnascimentotech.web.app"
old_profile = (
    "two books on generative AI, keynote speaker at ICAILY 2026 in Cape Town, "
    "and Claude Certified Architect."
)
new_profile = (
    "two books on generative AI. Delivered a keynote online at ICAILY 2026. "
    "Claude Certified Architect."
)
for text in (old_website, old_profile):
    matches = first.search_for(text)
    assert len(matches) == 1, f"Expected one source occurrence: {text}"
    first.add_redact_annot(matches[0], fill=(1, 1, 1))
first.apply_redactions(images=0, graphics=0)
register_fonts(first)
put(first, (395.25, 103.5), "mrnascimento.com", size=8.295, color=MUTED)
assert fonts["regular"].text_length(new_profile, fontsize=BODY_SIZE) <= RIGHT - LEFT
put(first, (LEFT, 221.25), new_profile)

second = document[1]
# Remove the former section body and the language block, including the old
# rule. The section heading above y=365 and every earlier section are retained.
second.add_redact_annot(pdf.Rect(39, 365, 557, 525), fill=(1, 1, 1))
second.apply_redactions(images=0, graphics=1)
register_fonts(second)

paragraphs = [
    [
        ("bold", "Books. "),
        ("italic", "Generative AI for Teachers: A Practical Guide to Educational Technology"),
        ("regular", " (2025) and "),
        ("italic", "Inteligência Artificial Generativa para Professores"),
        ("regular", " (Editora Dialética, 2026). The Portuguese book was launched at Livraria da Vila on 9 October 2026."),
    ],
    [
        ("bold", "Speaking. "),
        ("regular", "Delivered a keynote online at ICAILY 2026 and a presentation at DataMinitech. MiningTech South America 2026, São Paulo. Summit de Inteligência Artificial do Brasil 2026, Joinville."),
    ],
    [
        ("bold", "Teacher development. "),
        ("regular", "Delivered four AI training sessions at Colégio São Luís during September and October 2026, with teachers from early years, primary and secondary education."),
    ],
    [
        ("bold", "Peer review. "),
        ("regular", "Education and Information Technologies (Springer). Programme committee and emergency reviewer, International Conference on Educational Data Mining 2026."),
    ],
    [
        ("bold", "Writing on AI evaluation and governance. "),
        ("regular", "18 original articles published in 2026 as of 14 October, including in Folha de S.Paulo, The Fulcrum, HEPI, Educational Leadership (ISTE and ASCD), EUobserver, GovInsider, Business Day (South Africa), eSchool News and Nexo Políticas Públicas."),
    ],
]
baseline = 375.0
for runs in paragraphs:
    baseline = paragraph(second, baseline, runs)

# Reposition the unchanged language information after the expanded section.
heading_y = baseline + 12.0
heading_x = LEFT
for char in "LANGUAGES":
    put(second, (heading_x, heading_y), char, "heading", 8.1975, ACCENT)
    heading_x += text_width(char, "heading", 8.1975) + 1.1475
second.draw_rect(
    pdf.Rect(LEFT, heading_y + 6, RIGHT, heading_y + 6.75),
    fill=(0.8392, 0.8549, 0.8706), color=None,
)
language_text = "Portuguese (native)  ·  English (full professional)  ·  Spanish (professional working)"
put(second, (LEFT, heading_y + 20.25), language_text)
assert heading_y + 23 < 800, "The final CV block exceeds the original page margin."

# Fully rewrite the document after redaction; no old confidential text is kept
# in an incremental revision or unreferenced content stream.
document.save(OUTPUT, garbage=4, clean=True, deflate=True)
document.close()

with pdf.open(OUTPUT) as check:
    assert len(check) == 2
    text = "\n".join(page.get_text() for page in check)
    for forbidden in ("Global Digital Citizenship", "Bloomsbury", "Cape Town", old_website):
        assert forbidden not in text, forbidden
    for required in (
        "mrnascimento.com", "online at ICAILY 2026", "DataMinitech",
        "MiningTech South America 2026", "Livraria da Vila", "9 October 2026",
        "four AI training sessions", "Colégio São Luís", "18 original articles",
        "The Fulcrum", "Portuguese (native)",
    ):
        assert required in text, required
    # Earlier sections on page two remain text-identical.
    anchor = "PUBLICATIONS, SPEAKING AND PEER REVIEW"
    assert check[1].get_text().split(anchor)[0] == original_text[1].split(anchor)[0]
print(f"Updated {OUTPUT}: two pages, original body font size {BODY_SIZE} pt.")
