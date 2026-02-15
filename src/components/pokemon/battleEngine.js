/**
 * Battle engine for the creature combat simulator.
 * Handles damage calculation, turn order, and battle flow.
 */

import { getEffectiveness } from "./battleData"

/**
 * Calculate damage dealt by an attack.
 */
export function calculateDamage(attacker, defender, move) {
  // Accuracy check
  const accuracyRoll = Math.random() * 100
  if (accuracyRoll > move.accuracy) {
    return { damage: 0, missed: true, effectiveness: 1 }
  }

  const effectiveness = getEffectiveness(move.type, defender.type)

  // Simplified damage formula inspired by classic RPGs
  const baseDamage = Math.floor(
    ((2 * 50) / 5 + 2) * move.power * (attacker.attack / defender.defense)
  ) / 50 + 2

  // Random variance (85-100%)
  const randomFactor = (Math.random() * 15 + 85) / 100

  // STAB (Same Type Attack Bonus)
  const stab = move.type === attacker.type ? 1.5 : 1

  const finalDamage = Math.max(
    1,
    Math.floor(baseDamage * effectiveness * randomFactor * stab)
  )

  return {
    damage: finalDamage,
    missed: false,
    effectiveness,
  }
}

/**
 * Determine turn order based on speed stats.
 */
export function getFirstAttacker(creature1, creature2) {
  if (creature1.speed !== creature2.speed) {
    return creature1.speed > creature2.speed ? "creature1" : "creature2"
  }
  return Math.random() > 0.5 ? "creature1" : "creature2"
}

/**
 * Apply damage to a creature, returning updated creature state.
 */
export function applyDamage(creature, damage) {
  return {
    ...creature,
    currentHp: Math.max(0, creature.currentHp - damage),
  }
}

/**
 * Use PP for a move, returning updated creature state.
 */
export function usePP(creature, moveIndex) {
  const newPP = [...creature.movePP]
  newPP[moveIndex] = Math.max(0, newPP[moveIndex] - 1)
  return {
    ...creature,
    movePP: newPP,
  }
}

/**
 * Check if a creature has fainted.
 */
export function isFainted(creature) {
  return creature.currentHp <= 0
}

/**
 * Get a display message for effectiveness.
 */
export function getEffectivenessMessage(effectiveness) {
  if (effectiveness > 1) return "It's super effective!"
  if (effectiveness < 1) return "It's not very effective..."
  return ""
}

/**
 * Execute a full turn of combat.
 */
export function executeTurn(
  playerCreature,
  playerMoveIndex,
  enemyCreature,
  enemyMoveIndex
) {
  const log = []
  let updatedPlayer = { ...playerCreature }
  let updatedEnemy = { ...enemyCreature }

  const first = getFirstAttacker(playerCreature, enemyCreature)
  const firstIsPlayer = first === "creature1"

  const attacker1 = firstIsPlayer ? updatedPlayer : updatedEnemy
  const defender1 = firstIsPlayer ? updatedEnemy : updatedPlayer
  const move1Index = firstIsPlayer ? playerMoveIndex : enemyMoveIndex
  const move1 = attacker1.moves[move1Index]

  // First attack
  const result1 = calculateDamage(attacker1, defender1, move1)

  if (firstIsPlayer) {
    updatedPlayer = usePP(updatedPlayer, playerMoveIndex)
  } else {
    updatedEnemy = usePP(updatedEnemy, enemyMoveIndex)
  }

  if (result1.missed) {
    log.push(`${attacker1.name} used ${move1.name}... but it missed!`)
  } else {
    if (firstIsPlayer) {
      updatedEnemy = applyDamage(updatedEnemy, result1.damage)
    } else {
      updatedPlayer = applyDamage(updatedPlayer, result1.damage)
    }
    log.push(`${attacker1.name} used ${move1.name}! (${result1.damage} damage)`)
    const effMsg = getEffectivenessMessage(result1.effectiveness)
    if (effMsg) log.push(effMsg)
  }

  // Check if defender fainted
  const defender1Updated = firstIsPlayer ? updatedEnemy : updatedPlayer
  if (isFainted(defender1Updated)) {
    log.push(`${defender1.name} fainted!`)
    return {
      playerCreature: updatedPlayer,
      enemyCreature: updatedEnemy,
      log,
      battleOver: true,
      winner: firstIsPlayer ? "player" : "enemy",
    }
  }

  // Second attack
  const attacker2 = firstIsPlayer ? updatedEnemy : updatedPlayer
  const move2Index = firstIsPlayer ? enemyMoveIndex : playerMoveIndex
  const move2 = attacker2.moves[move2Index]
  const defender2 = firstIsPlayer ? updatedPlayer : updatedEnemy

  const result2 = calculateDamage(attacker2, defender2, move2)

  if (firstIsPlayer) {
    updatedEnemy = usePP(updatedEnemy, enemyMoveIndex)
  } else {
    updatedPlayer = usePP(updatedPlayer, playerMoveIndex)
  }

  if (result2.missed) {
    log.push(`${attacker2.name} used ${move2.name}... but it missed!`)
  } else {
    if (firstIsPlayer) {
      updatedPlayer = applyDamage(updatedPlayer, result2.damage)
    } else {
      updatedEnemy = applyDamage(updatedEnemy, result2.damage)
    }
    log.push(`${attacker2.name} used ${move2.name}! (${result2.damage} damage)`)
    const effMsg = getEffectivenessMessage(result2.effectiveness)
    if (effMsg) log.push(effMsg)
  }

  // Check if second defender fainted
  const defender2Updated = firstIsPlayer ? updatedPlayer : updatedEnemy
  if (isFainted(defender2Updated)) {
    log.push(`${defender2.name} fainted!`)
    return {
      playerCreature: updatedPlayer,
      enemyCreature: updatedEnemy,
      log,
      battleOver: true,
      winner: firstIsPlayer ? "enemy" : "player",
    }
  }

  return {
    playerCreature: updatedPlayer,
    enemyCreature: updatedEnemy,
    log,
    battleOver: false,
    winner: null,
  }
}
