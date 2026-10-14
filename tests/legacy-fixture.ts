import { initialGame as freshGame } from "../lib/game";

// Existing tests cover saves created before mandatory prologue onboarding.
export function initialGame() {
  const game = freshGame();
  delete game.prologue;
  return game;
}
