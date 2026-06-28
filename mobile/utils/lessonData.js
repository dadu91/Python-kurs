import uvod from "../lessons/uvod";
import promjenljive from "../lessons/promjenljive";
import uslovi from "../lessons/uslovi";
import petlje from "../lessons/petlje";
import liste from "../lessons/liste";
import stringovi from "../lessons/stringovi";
import funkcije from "../lessons/funkcije";
import skupoviTuple from "../lessons/skupovi_tuple";
import rjecnici from "../lessons/rjecnici";
import moduli from "../lessons/moduli";
import greske from "../lessons/greske";

export const LESSON_DATA = {
  1: uvod, 2: promjenljive, 3: uslovi, 4: petlje, 5: liste,
  6: stringovi, 7: funkcije, 8: skupoviTuple, 9: rjecnici,
  10: moduli, 11: greske,
};

export function normalizeCode(code) {
  return code
    .replaceAll(" ", "")
    .replaceAll("\n", "")
    .replaceAll("\t", "")
    .replaceAll("'", '"')
    .toLowerCase();
}
