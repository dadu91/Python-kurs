import ast
from repositories import kod_repository
from schemas.kod_schema import KodIzvrsavanjeOut, IzvrsavanjeGreskaOut


def izvrsi_kod(kod: str) -> KodIzvrsavanjeOut:
    # 1. Provjera sintakse prije pokretanja subprocesa
    greska_sintakse = _provjeri_sintaksu(kod)
    if greska_sintakse:
        return KodIzvrsavanjeOut(output=None, greska=greska_sintakse)

    # 2. Izvršavanje kroz repository
    rezultat = kod_repository.izvrsi_kod(kod)

    # 3. Mapiranje na izlaznu shemu
    if rezultat["uspjeh"]:
        return KodIzvrsavanjeOut(output=rezultat["output"], greska=None)

    return KodIzvrsavanjeOut(
        output=None,
        greska=IzvrsavanjeGreskaOut(
            tip=rezultat["tip_greske"],
            poruka=rezultat["poruka_greske"],
        ),
    )


def _provjeri_sintaksu(kod: str) -> IzvrsavanjeGreskaOut | None:
    try:
        ast.parse(kod)
        return None
    except SyntaxError as e:
        poruka = f"Linija {e.lineno}: {e.msg}"
        if e.text:
            poruka += f" — `{e.text.strip()}`"
        return IzvrsavanjeGreskaOut(tip="SyntaxError", poruka=poruka)