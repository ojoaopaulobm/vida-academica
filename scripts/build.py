"""Junta index.html, css/ e js/ em vida-academica.html, o arquivo unico publicado no artifact."""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LINK_CSS = '<link rel="stylesheet" href="css/styles.css">'
SCRIPT_JS = '<script src="js/app.js"></script>'


def ler(caminho):
    return (RAIZ / caminho).read_text(encoding="utf-8")


def main():
    pagina = ler("index.html")
    cabeca = pagina.split("<!-- artifact:head -->\n", 1)[1].split("</head>", 1)[0]
    corpo = pagina.split("<body>\n", 1)[1].split("</body>", 1)[0]
    saida = cabeca + corpo
    saida = saida.replace(LINK_CSS, f"<style>\n{ler('css/styles.css')}</style>")
    saida = saida.replace(SCRIPT_JS, f"<script>\n{ler('js/app.js')}</script>")
    (RAIZ / "vida-academica.html").write_text(saida, encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
