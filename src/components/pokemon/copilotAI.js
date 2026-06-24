/**
 * Copilot SDK AI integration for enemy battle decisions.
 *
 * This module sends the current battle state to the GitHub Copilot SDK
 * and receives strategic move decisions for the enemy creature.
 *
 * Architecture:
 * - Battle state is serialized and sent as a prompt to the Copilot API
 * - The AI analyzes type matchups, HP, and available moves
 * - Returns a move index (0-3) for the enemy's chosen action
 * - Falls back to local heuristic AI if the API is unavailable
 */

const COPILOT_API_ENDPOINT =
  typeof window !== "undefined"
    ? window.__COPILOT_ENDPOINT__ || "/api/copilot-battle-ai"
    : "/api/copilot-battle-ai"

/**
 * Build the prompt that describes the battle state for the AI.
 */
export function buildBattlePrompt(enemyCreature, playerCreature) {
  const enemyMoves = enemyCreature.moves
    .map(
      (m, i) =>
        `${i}: ${m.name} (type: ${m.type}, power: ${m.power}, accuracy: ${m.accuracy}, PP remaining: ${enemyCreature.movePP[i]})`
    )
    .join("\n")

  return `You are the AI opponent in a turn-based creature battle game.

Your creature: ${enemyCreature.name} (type: ${enemyCreature.type})
  HP: ${enemyCreature.currentHp}/${enemyCreature.maxHp}
  Attack: ${enemyCreature.attack}, Defense: ${enemyCreature.defense}, Speed: ${enemyCreature.speed}

Opponent creature: ${playerCreature.name} (type: ${playerCreature.type})
  HP: ${playerCreature.currentHp}/${playerCreature.maxHp}
  Attack: ${playerCreature.attack}, Defense: ${playerCreature.defense}, Speed: ${playerCreature.speed}

Your available moves:
${enemyMoves}

Type effectiveness rules:
- Fire is super effective against Grass, not very effective against Water and Fire
- Water is super effective against Fire, not very effective against Grass and Water
- Grass is super effective against Water, not very effective against Fire and Grass
- Electric is super effective against Water, not very effective against Grass
- Normal has no special effectiveness

Choose the best move index (0-3) considering:
1. Type effectiveness against the opponent
2. Move power and accuracy
3. Remaining PP for each move
4. Current HP situation (be aggressive if low HP)

Respond with ONLY a single digit: the move index (0, 1, 2, or 3).`
}

/**
 * Query the Copilot SDK for an enemy AI decision.
 *
 * @param {object} enemyCreature - The enemy creature's current state
 * @param {object} playerCreature - The player creature's current state
 * @returns {Promise<number>} - The index of the chosen move (0-3)
 */
export async function getCopilotDecision(enemyCreature, playerCreature) {
  const prompt = buildBattlePrompt(enemyCreature, playerCreature)

  try {
    const response = await fetch(COPILOT_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a battle AI for a creature combat game. You must respond with ONLY a single digit (0-3) representing the move index you choose. No other text.",
          },
          { role: "user", content: prompt },
        ],
        model: "gpt-4o",
        max_tokens: 5,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      console.warn(
        "Copilot API returned non-OK status, falling back to local AI"
      )
      return getLocalAIDecision(enemyCreature, playerCreature)
    }

    const data = await response.json()
    const choiceText =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    const moveIndex = parseInt(choiceText, 10)

    if (isNaN(moveIndex) || moveIndex < 0 || moveIndex > 3) {
      console.warn("Copilot returned invalid move index, falling back")
      return getLocalAIDecision(enemyCreature, playerCreature)
    }

    // Check if the move has PP remaining
    if (enemyCreature.movePP[moveIndex] <= 0) {
      console.warn("Copilot chose a move with no PP, falling back")
      return getLocalAIDecision(enemyCreature, playerCreature)
    }

    return moveIndex
  } catch (err) {
    console.warn("Copilot API error, using local AI fallback:", err.message)
    return getLocalAIDecision(enemyCreature, playerCreature)
  }
}

/**
 * Local heuristic AI fallback when Copilot SDK is unavailable.
 * Uses type effectiveness and move power to make decisions.
 */
export function getLocalAIDecision(enemyCreature, playerCreature) {
  const { getEffectiveness } = require("./battleData")

  let bestIndex = 0
  let bestScore = -1

  enemyCreature.moves.forEach((move, i) => {
    if (enemyCreature.movePP[i] <= 0) return

    const effectiveness = getEffectiveness(move.type, playerCreature.type)
    const accuracyFactor = move.accuracy / 100
    const score = move.power * effectiveness * accuracyFactor

    if (score > bestScore) {
      bestScore = score
      bestIndex = i
    }
  })

  return bestIndex
}
