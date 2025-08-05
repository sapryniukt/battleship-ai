import type { Player } from '~/types/battleship';

export function getPlayers(): [string, Player][] {
  return import.meta.client ? JSON.parse(localStorage.getItem('players') || '[]') : [];
}

export function* getPlayer(): Generator<[string, Player]> {
  let i = 0;
  const playerArray = getPlayers();

  while (true) {
    yield playerArray[i++ % playerArray.length];
  }
}

export function savePlayers(players: [string, Player][]) {
  const playerArray = Array.from(players.values()).map(([id, player]) => [
    id,
    { id, name: player.name, winCount: player.winCount }
  ]);

  return import.meta.client ? localStorage.setItem('players', JSON.stringify(playerArray)) : null;
}
