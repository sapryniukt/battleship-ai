import { describe, it, expect } from 'vitest';
import { getMaterial } from '~/utils/battleship/fieldMaterial';
import { CellMode, CellColor } from '~/constants/battleship';
import { DoubleSide } from 'three';
import type { Cell } from '~/types/battleship';

describe('getMaterial', () => {
  const baseMaterial = {
    roughness: 0.4,
    metalness: 1,
    side: DoubleSide,
    flatShading: true
  };

  it('returns AI color for Occupied cell if useAI is true', () => {
    const cell: Cell = {
      id: '1',
      coordinate: { x: 0, y: 0 },
      mode: CellMode.Occupied
    };
    const material = getMaterial(cell, true);

    expect(material).toEqual({
      ...baseMaterial,
      color: CellColor.Occupied
    });
  });

  it('returns Empty color for Occupied cell if useAI is false', () => {
    const cell: Cell = {
      id: '1',
      coordinate: { x: 0, y: 0 },
      mode: CellMode.Occupied
    };
    const material = getMaterial(cell, false);

    expect(material).toEqual({
      ...baseMaterial,
      color: CellColor.Empty
    });
  });

  it('returns Missed color for Missed cell', () => {
    const cell: Cell = {
      id: '1',
      coordinate: { x: 0, y: 0 },
      mode: CellMode.Missed
    };
    const material = getMaterial(cell, false);

    expect(material).toEqual({
      ...baseMaterial,
      color: CellColor.Missed
    });
  });

  it('returns Damaged color for Damaged cell', () => {
    const cell: Cell = {
      id: '1',
      coordinate: { x: 0, y: 0 },
      mode: CellMode.Damaged
    };
    const material = getMaterial(cell, true);

    expect(material).toEqual({
      ...baseMaterial,
      color: CellColor.Damaged
    });
  });

  it('returns Empty color for unknown cell mode', () => {
    const cell: Cell = {
      id: '1',
      coordinate: { x: 0, y: 0 },
      mode: 'Unknown' as unknown as CellMode // force cast
    };
    const material = getMaterial(cell, false);

    expect(material).toEqual({
      ...baseMaterial,
      color: CellColor.Empty
    });
  });
});
