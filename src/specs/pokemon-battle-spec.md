# Creature Battle Arena — Spec Kit

## Overview

**Creature Battle Arena** is a turn-based battle simulator where enemy AI decisions are powered by the GitHub Copilot SDK. The app is built as a page within the existing Gatsby site and features original creatures, moves, and type mechanics inspired by classic monster-battling RPGs.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Gatsby Page                     │
│              /pokemon-battle                     │
│                                                  │
│  ┌──────────────┐    ┌───────────────────────┐  │
│  │  Battle UI    │    │    Battle Engine       │  │
│  │  (React)      │───▶│  - Damage calc        │  │
│  │  - HP bars    │    │  - Turn order          │  │
│  │  - Move panel │    │  - Type effectiveness  │  │
│  │  - Battle log │    │  - PP tracking         │  │
│  └──────────────┘    └───────────────────────┘  │
│         │                       │                │
│         ▼                       ▼                │
│  ┌──────────────────────────────────────────┐   │
│  │          Copilot AI Module                │   │
│  │  - Builds battle state prompt             │   │
│  │  - Sends to Copilot SDK API               │   │
│  │  - Parses move index response             │   │
│  │  - Falls back to local heuristic AI       │   │
│  └──────────────────────────────────────────┘   │
│                     │                            │
└─────────────────────│────────────────────────────┘
                      │
                      ▼
          ┌───────────────────────┐
          │  GitHub Copilot SDK   │
          │  (External API)       │
          │                       │
          │  POST /api/copilot-   │
          │       battle-ai       │
          │                       │
          │  Input: battle state  │
          │  Output: move index   │
          │         (0-3)         │
          └───────────────────────┘
```

## Components

### 1. Battle Data (`battleData.js`)
- **Types**: Fire, Water, Grass, Electric, Normal
- **Type Chart**: Classic effectiveness matrix (2x, 0.5x, 1x)
- **Moves**: 10 original moves with power, accuracy, PP, and type
- **Creatures**: 4 original creatures (Blazeling, Tidalin, Thornyx, Voltpup)
- **Factory**: `createBattleCreature()` instantiates a creature with full HP and PP

### 2. Copilot AI Module (`copilotAI.js`)
- **Prompt Builder**: Serializes battle state into a structured prompt
- **API Integration**: Sends POST request to Copilot SDK endpoint
- **Response Parsing**: Extracts move index (0-3) from AI response
- **Fallback AI**: Local heuristic that evaluates type effectiveness × power × accuracy
- **Validation**: Ensures selected move has PP remaining, re-rolls if not

### 3. Battle Engine (`battleEngine.js`)
- **Damage Formula**: `((22 * power * atk/def) / 50 + 2) × effectiveness × STAB × random`
- **Turn Order**: Higher speed goes first; ties broken randomly
- **STAB**: 1.5× bonus when move type matches creature type
- **Accuracy**: Random roll against move accuracy percentage
- **State Management**: Pure functions returning new state objects

### 4. Battle UI (`BattleUI.js`)
- **CreatureCard**: Shows sprite (emoji), name, type badge, HP bar
- **MovePanel**: 2×2 grid of move buttons with type/power/accuracy/PP info
- **BattleLog**: Scrollable combat log with highlighted effectiveness messages
- **CreatureSelect**: Creature picker grid for game start
- **BattleResult**: Win/loss screen with play again option

### 5. Page (`pokemon-battle.js`)
- **Phase Machine**: SELECT → BATTLE → RESULT
- **Async AI**: Awaits Copilot SDK response during enemy turns
- **State**: React hooks manage creature state, battle log, and phase

## Copilot SDK Integration

### Request Format
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a battle AI... respond with ONLY a single digit (0-3)..."
    },
    {
      "role": "user",
      "content": "[battle state prompt with creatures, moves, types, HP]"
    }
  ],
  "model": "gpt-4o",
  "max_tokens": 5,
  "temperature": 0.3
}
```

### Response Format
```json
{
  "choices": [
    {
      "message": {
        "content": "2"
      }
    }
  ]
}
```

### Prompt Design
The prompt includes:
- Both creatures' full stats (HP, ATK, DEF, SPD)
- All available enemy moves with type, power, accuracy, and remaining PP
- Type effectiveness rules for reference
- Strategic hints (be aggressive when low HP)
- Instruction to respond with ONLY a move index

### Fallback Behavior
When the Copilot SDK is unavailable:
1. Network error → local heuristic AI
2. Non-OK response → local heuristic AI
3. Invalid response (not 0-3) → local heuristic AI
4. Selected move has 0 PP → local heuristic AI

The local AI scores each move as: `power × effectiveness × (accuracy/100)` and picks the highest-scoring available move.

## Configuration

### API Endpoint
Set `window.__COPILOT_ENDPOINT__` before page load to override the default endpoint:
```js
window.__COPILOT_ENDPOINT__ = "https://your-copilot-proxy.example.com/v1/chat/completions"
```

Default: `/api/copilot-battle-ai`

### Server Proxy Setup
The Copilot SDK requires server-side authentication. A proxy endpoint should:
1. Accept the battle AI request from the client
2. Authenticate with the Copilot SDK using a server-side token
3. Forward the request to the Copilot completions API
4. Return the response to the client

## Type Effectiveness Chart

| Attack ↓ / Defend → | Fire | Water | Grass | Electric | Normal |
|---------------------|------|-------|-------|----------|--------|
| Fire                | 0.5× | 0.5× | 2×    | 1×       | 1×     |
| Water               | 2×   | 0.5× | 0.5×  | 1×       | 1×     |
| Grass               | 0.5× | 2×   | 0.5×  | 1×       | 1×     |
| Electric            | 1×   | 2×   | 0.5×  | 1×       | 1×     |
| Normal              | 1×   | 1×   | 1×    | 1×       | 1×     |

## Creatures

| Name      | Type     | HP  | ATK | DEF | SPD | Moves                                    |
|-----------|----------|-----|-----|-----|-----|------------------------------------------|
| Blazeling | Fire     | 120 | 65  | 50  | 70  | Ember, Flamethrower, Tackle, Body Slam   |
| Tidalin   | Water    | 130 | 55  | 60  | 60  | Water Gun, Hydro Pump, Tackle, Body Slam |
| Thornyx   | Grass    | 125 | 60  | 55  | 65  | Vine Whip, Solar Beam, Tackle, Body Slam |
| Voltpup   | Electric | 110 | 70  | 45  | 80  | Spark, Thunderbolt, Tackle, Body Slam    |

## File Structure
```
src/
├── pages/
│   └── pokemon-battle.js          # Main battle page
├── components/
│   └── pokemon/
│       ├── battleData.js           # Creatures, moves, types
│       ├── battleEngine.js         # Combat mechanics
│       ├── copilotAI.js            # Copilot SDK integration
│       └── BattleUI.js             # React UI components
└── specs/
    └── pokemon-battle-spec.md      # This spec kit
```

## Future Enhancements
- Multi-creature teams with switching
- Status effects (burn, paralyze, sleep)
- AI difficulty levels via Copilot temperature parameter
- Battle history and win/loss tracking
- Multiplayer via WebSocket
- Sound effects and animations
