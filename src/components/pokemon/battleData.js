/**
 * Battle data for the Pokemon-inspired battle simulator.
 * Contains creature definitions, moves, and type effectiveness.
 *
 * NOTE: This is an original creation inspired by Pokemon mechanics.
 * All creature names, moves, and stats are original.
 */

export const TYPES = {
  FIRE: "fire",
  WATER: "water",
  GRASS: "grass",
  ELECTRIC: "electric",
  NORMAL: "normal",
}

export const TYPE_EFFECTIVENESS = {
  [TYPES.FIRE]: { [TYPES.GRASS]: 2, [TYPES.WATER]: 0.5, [TYPES.FIRE]: 0.5 },
  [TYPES.WATER]: { [TYPES.FIRE]: 2, [TYPES.GRASS]: 0.5, [TYPES.WATER]: 0.5 },
  [TYPES.GRASS]: {
    [TYPES.WATER]: 2,
    [TYPES.FIRE]: 0.5,
    [TYPES.GRASS]: 0.5,
  },
  [TYPES.ELECTRIC]: { [TYPES.WATER]: 2, [TYPES.GRASS]: 0.5 },
  [TYPES.NORMAL]: {},
}

export function getEffectiveness(attackType, defenderType) {
  const matchups = TYPE_EFFECTIVENESS[attackType] || {}
  return matchups[defenderType] || 1
}

export const MOVES = {
  ember: {
    name: "Ember",
    type: TYPES.FIRE,
    power: 40,
    accuracy: 100,
    pp: 25,
    description: "A small flame attack.",
  },
  waterGun: {
    name: "Water Gun",
    type: TYPES.WATER,
    power: 40,
    accuracy: 100,
    pp: 25,
    description: "A blast of water.",
  },
  vineWhip: {
    name: "Vine Whip",
    type: TYPES.GRASS,
    power: 45,
    accuracy: 100,
    pp: 25,
    description: "Strikes with vines.",
  },
  tackle: {
    name: "Tackle",
    type: TYPES.NORMAL,
    power: 40,
    accuracy: 100,
    pp: 35,
    description: "A basic physical attack.",
  },
  flamethrower: {
    name: "Flamethrower",
    type: TYPES.FIRE,
    power: 90,
    accuracy: 100,
    pp: 15,
    description: "A powerful fire blast.",
  },
  hydroPump: {
    name: "Hydro Pump",
    type: TYPES.WATER,
    power: 110,
    accuracy: 80,
    pp: 5,
    description: "A massive water cannon.",
  },
  solarBeam: {
    name: "Solar Beam",
    type: TYPES.GRASS,
    power: 120,
    accuracy: 100,
    pp: 10,
    description: "A concentrated beam of light.",
  },
  thunderbolt: {
    name: "Thunderbolt",
    type: TYPES.ELECTRIC,
    power: 90,
    accuracy: 100,
    pp: 15,
    description: "A powerful electric shock.",
  },
  spark: {
    name: "Spark",
    type: TYPES.ELECTRIC,
    power: 65,
    accuracy: 100,
    pp: 20,
    description: "An electric charge attack.",
  },
  bodySlam: {
    name: "Body Slam",
    type: TYPES.NORMAL,
    power: 85,
    accuracy: 100,
    pp: 15,
    description: "A full-body charge.",
  },
}

export const CREATURES = {
  blazeling: {
    name: "Blazeling",
    type: TYPES.FIRE,
    baseHp: 120,
    attack: 65,
    defense: 50,
    speed: 70,
    sprite: "🔥",
    moves: [MOVES.ember, MOVES.flamethrower, MOVES.tackle, MOVES.bodySlam],
  },
  tidalin: {
    name: "Tidalin",
    type: TYPES.WATER,
    baseHp: 130,
    attack: 55,
    defense: 60,
    speed: 60,
    sprite: "🌊",
    moves: [MOVES.waterGun, MOVES.hydroPump, MOVES.tackle, MOVES.bodySlam],
  },
  thornyx: {
    name: "Thornyx",
    type: TYPES.GRASS,
    baseHp: 125,
    attack: 60,
    defense: 55,
    speed: 65,
    sprite: "🌿",
    moves: [MOVES.vineWhip, MOVES.solarBeam, MOVES.tackle, MOVES.bodySlam],
  },
  voltpup: {
    name: "Voltpup",
    type: TYPES.ELECTRIC,
    baseHp: 110,
    attack: 70,
    defense: 45,
    speed: 80,
    sprite: "⚡",
    moves: [MOVES.spark, MOVES.thunderbolt, MOVES.tackle, MOVES.bodySlam],
  },
}

export function createBattleCreature(creatureKey) {
  const base = CREATURES[creatureKey]
  return {
    ...base,
    key: creatureKey,
    currentHp: base.baseHp,
    maxHp: base.baseHp,
    movePP: base.moves.map(m => m.pp),
  }
}
