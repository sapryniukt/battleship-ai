import { z } from 'zod';

// Coordinate schema
export const coordinateSchema = z.object({
  x: z.number().min(0).max(9),
  y: z.number().min(0).max(9)
});

// Move response schema
export const moveResponseSchema = z.object({
  thought: z.string().describe('The strategic thinking process behind the move'),
  move: z.object({
    x: z.number().min(0).max(9).describe('Row coordinate (0-9)'),
    y: z.number().min(0).max(9).describe('Column coordinate (0-9)')
  }),
  confidence: z.number().min(0).max(1).describe('Confidence level in the move (0-1)'),
  strategy: z.enum(['hunt', 'target', 'finish']).describe('Current strategic approach')
});

// Analysis response schema
export const analysisResponseSchema = z.object({
  hits: z.array(coordinateSchema),
  misses: z.array(coordinateSchema),
  potentialShips: z.array(
    z.object({
      startX: z.number().min(0).max(9),
      startY: z.number().min(0).max(9),
      orientation: z.enum(['horizontal', 'vertical']),
      length: z.number().min(1).max(5),
      probability: z.number().min(0).max(1)
    })
  ),
  suggestedMoves: z.array(
    z.object({
      x: z.number().min(0).max(9),
      y: z.number().min(0).max(9),
      probability: z.number().min(0).max(1),
      reasoning: z.string()
    })
  ),
  strategy: z.enum(['hunt', 'target', 'finish'])
});

export type MoveResponse = z.infer<typeof moveResponseSchema>;
export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
