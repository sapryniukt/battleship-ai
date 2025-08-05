export const shipLengths = new Map<string, number>();

shipLengths.set('Carrier', 5);
shipLengths.set('Battleship', 4);
shipLengths.set('Cruiser', 3);
shipLengths.set('Submarine', 3);
shipLengths.set('Destroyer', 2);
shipLengths.set('Vilha', 1);

export const fleetComposition = Array.from(shipLengths.entries())
  .map(([name, length]) => `- ${name}: ${length} cell${length > 1 ? 's' : ''}`)
  .join('\n');
