export const BOARD_SIZE_X = 10;
export const BOARD_SIZE_Y = 10;

export enum DefaultNames {
  AI = 'AI',
  Player = 'You'
}

export enum CellMode {
  Empty = 0,
  Occupied = 1,
  Missed = 2,
  Damaged = 3
}

export enum CellColor {
  Empty = '#777777',
  Occupied = '#0275c7',
  Missed = '#575e69',
  Damaged = '#a61c1c'
}

export enum TabColor {
  Active = '#555555',
  Inactive = '#222222'
}

export enum Orientation {
  Vertical = 0,
  Horizontal = 1
}
