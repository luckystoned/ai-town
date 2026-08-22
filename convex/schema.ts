import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { agentTables } from './agent/schema';
import { aiTownTables } from './aiTown/schema';
import { conversationId, playerId } from './aiTown/ids';
import { engineTables } from './engine/schema';

export default defineSchema({
  gameSessions: defineTable({
    code: v.string(),
    status: v.literal('lobby'),
    createdAt: v.number(),
  }).index('code', ['code']),

  lobbyPlayers: defineTable({
    sessionId: v.id('gameSessions'),
    name: v.string(),
    tokenHash: v.string(),
    joinedAt: v.number(),
    characterId: v.optional(
      v.union(
        v.literal('san-martin'),
        v.literal('belgrano'),
        v.literal('guemes'),
        v.literal('azurduy'),
        v.literal('moreno'),
        v.literal('rosas'),
        v.literal('sarmiento'),
        v.literal('brown'),
      ),
    ),
  })
    .index('sessionId', ['sessionId'])
    .index('sessionTokenHash', ['sessionId', 'tokenHash']),

  music: defineTable({
    storageId: v.string(),
    type: v.union(v.literal('background'), v.literal('player')),
  }),

  messages: defineTable({
    conversationId,
    messageUuid: v.string(),
    author: playerId,
    text: v.string(),
    worldId: v.optional(v.id('worlds')),
  })
    .index('conversationId', ['worldId', 'conversationId'])
    .index('messageUuid', ['conversationId', 'messageUuid']),

  ...agentTables,
  ...aiTownTables,
  ...engineTables,
});
