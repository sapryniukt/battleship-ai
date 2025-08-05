import { describe, it, expect, vi } from 'vitest';
import { eventBus } from '../eventBus';
import type {
  BattleshipHitEvent,
  BattleshipLLMThinkingEvent,
  BattleshipMistakeEvent,
  BattleshipSinkEvent,
  Player,
  Ship
} from '~/types/battleship';

describe('eventBus', () => {
  it('should call listener when "rotate-camera" event is emitted', () => {
    const handler = vi.fn();
    eventBus.on('rotate-camera', handler);

    eventBus.emit('rotate-camera', 0);
    expect(handler).toHaveBeenCalledWith(0);

    eventBus.emit('rotate-camera', Math.PI);
    expect(handler).toHaveBeenCalledWith(Math.PI);
  });

  it('should not call handler after it is off', () => {
    const handler = vi.fn();
    eventBus.on('rotate-camera', handler);
    eventBus.off('rotate-camera', handler);

    eventBus.emit('rotate-camera', 0);
    expect(handler).not.toHaveBeenCalled();
  });

  it('should call listener when "game:hit:player1" event is emitted', () => {
    const handler = vi.fn();
    const event: BattleshipHitEvent = {
      player: {} as Player,
      coordinate: { x: 0, y: 0 },
      hit: true
    };
    eventBus.on('game:hit:player1', handler);
    eventBus.emit('game:hit:player1', event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should call listener when "game:sink:player1" event is emitted', () => {
    const handler = vi.fn();
    const event: BattleshipSinkEvent = {
      player: {} as Player,
      ship: {} as Ship
    };
    eventBus.on('game:sink:player1', handler);
    eventBus.emit('game:sink:player1', event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should call listener when "game:mistake:player1" event is emitted', () => {
    const handler = vi.fn();
    const event: BattleshipMistakeEvent = {
      player: {} as Player,
      coordinate: { x: 0, y: 0 },
      provider: 'openai'
    };
    eventBus.on('game:mistake:player1', handler);
    eventBus.emit('game:mistake:player1', event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should call listener when "game:llm:thinking:player1" event is emitted', () => {
    const handler = vi.fn();
    const event: BattleshipLLMThinkingEvent = {
      thought: '...',
      provider: 'openai'
    };
    eventBus.on('game:llm:thinking:player1', handler);
    eventBus.emit('game:llm:thinking:player1', event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('should call listener when "game:reset" event is emitted', () => {
    const handler = vi.fn();
    eventBus.on('game:reset', handler);
    eventBus.emit('game:reset');
    expect(handler).toHaveBeenCalledWith(undefined);
  });
});
