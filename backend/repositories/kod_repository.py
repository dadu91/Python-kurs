import subprocess
import sys
import tempfile
import os

TIMEOUT_SEKUNDE = 5


def izvrsi_kod(kod: str) -> dict:
    tmp_fajl = None
    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False,
            encoding="utf-8",
        ) as f:
            f.write(kod)
            tmp_fajl = f.name

        rezultat = subprocess.run(
            [sys.executable, tmp_fajl],
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SEKUNDE,
        )

        if rezultat.returncode != 0:
            tip, poruka = _parsiraj_stderr(rezultat.stderr.strip())
            return {"uspjeh": False, "tip_greske": tip, "poruka_greske": poruka}

        return {"uspjeh": True, "output": rezultat.stdout}

    except subprocess.TimeoutExpired:
        return {
            "uspjeh": False,
            "tip_greske": "TimeoutError",
            "poruka_greske": f"Izvršavanje je prekoračilo vremenski limit od {TIMEOUT_SEKUNDE} sekundi.",
        }
    except Exception as e:
        return {
            "uspjeh": False,
            "tip_greske": type(e).__name__,
            "poruka_greske": str(e),
        }
    finally:
        if tmp_fajl and os.path.exists(tmp_fajl):
            os.unlink(tmp_fajl)


def _parsiraj_stderr(stderr: str) -> tuple[str, str]:
    if not stderr:
        return "RuntimeError", "Nepoznata greška (prazan stderr)."

    for linija in reversed(stderr.splitlines()):
        linija = linija.strip()
        if ":" in linija and not linija.startswith("File") and not linija.startswith("Traceback"):
            dijelovi = linija.split(":", 1)
            tip = dijelovi[0].strip()
            poruka = dijelovi[1].strip() if len(dijelovi) > 1 else linija
            if tip and tip[0].isupper():
                return tip, poruka

    return "RuntimeError", stderr