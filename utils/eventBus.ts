import mitt from 'mitt';
import type {
  BattleshipHitEvent,
  BattleshipLLMThinkingEvent,
  BattleshipMistakeEvent,
  BattleshipSinkEvent
} from '~/types/battleship';

type Events = {
  'rotate-camera'?: 0 | Math['PI'];
  'game:hit:player1': BattleshipHitEvent;
  'game:sink:player1': BattleshipSinkEvent;
  'game:hit:player2': BattleshipHitEvent;
  'game:sink:player2': BattleshipSinkEvent;
  'game:mistake:player1': BattleshipMistakeEvent;
  'game:mistake:player2': BattleshipMistakeEvent;
  'game:llm:thinking:player1': BattleshipLLMThinkingEvent;
  'game:llm:thinking:player2': BattleshipLLMThinkingEvent;
  'game:reset': void;
};

export const eventBus = mitt<Events>();
