import { manufacturers } from "./manufacturers";
import { plastics } from "./plastics";
import { proPlayers } from "./pro-players";
import { random } from "./random";
import { retailers } from "./retailers";
import { specialCharacters } from "./special-characters";

export const blacklist: string[] = [
  ...manufacturers,
  ...plastics,
  ...proPlayers,
  ...random,
  ...retailers,
].map((x) => x.toLowerCase());
