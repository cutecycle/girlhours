import React, { useState, useCallback, useRef, useEffect } from "react"
import { CREATURES, createBattleCreature } from "../components/pokemon/battleData"
import { getCopilotDecision } from "../components/pokemon/copilotAI"
import { executeTurn } from "../components/pokemon/battleEngine"
import {
  CreatureCard,
  MovePanel,
  BattleLog,
  CreatureSelect,
  BattleResult,
  styles,
} from "../components/pokemon/BattleUI"

const PHASES = {
  SELECT: "select",
  BATTLE: "battle",
  RESULT: "result",
}

/**
 * Pick a random enemy creature key, preferring one different from the player's.
 */
function pickEnemyCreature(playerKey) {
  const keys = Object.keys(CREATURES).filter(k => k !== playerKey)
  return keys[Math.floor(Math.random() * keys.length)]
}

export default function PokemonBattle() {
  const [phase, setPhase] = useState(PHASES.SELECT)
  const [playerCreature, setPlayerCreature] = useState(null)
  const [enemyCreature, setEnemyCreature] = useState(null)
  const [battleLog, setBattleLog] = useState([])
  const [winner, setWinner] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [aiSource, setAiSource] = useState("")
  const logEndRef = useRef(null)

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [battleLog])

  const handleCreatureSelect = useCallback(playerKey => {
    const enemyKey = pickEnemyCreature(playerKey)
    const player = createBattleCreature(playerKey)
    const enemy = createBattleCreature(enemyKey)

    setPlayerCreature(player)
    setEnemyCreature(enemy)
    setBattleLog([
      `You sent out ${player.name}!`,
      `Enemy sent out ${enemy.name}! (Copilot AI)`,
      `---`,
    ])
    setWinner(null)
    setPhase(PHASES.BATTLE)
  }, [])

  const handleMoveSelect = useCallback(
    async playerMoveIndex => {
      if (thinking || phase !== PHASES.BATTLE) return

      setThinking(true)
      setAiSource("Querying Copilot SDK for enemy decision...")

      let enemyMoveIndex
      try {
        enemyMoveIndex = await getCopilotDecision(enemyCreature, playerCreature)
        setAiSource("Enemy decision powered by Copilot SDK ✨")
      } catch {
        enemyMoveIndex = 0
        setAiSource("Fallback AI (Copilot unavailable)")
      }

      const result = executeTurn(
        playerCreature,
        playerMoveIndex,
        enemyCreature,
        enemyMoveIndex
      )

      setPlayerCreature(result.playerCreature)
      setEnemyCreature(result.enemyCreature)
      setBattleLog(prev => [...prev, ...result.log, "---"])

      if (result.battleOver) {
        setWinner(result.winner)
        setPhase(PHASES.RESULT)
      }

      setThinking(false)
    },
    [playerCreature, enemyCreature, thinking, phase]
  )

  const handlePlayAgain = useCallback(() => {
    setPhase(PHASES.SELECT)
    setPlayerCreature(null)
    setEnemyCreature(null)
    setBattleLog([])
    setWinner(null)
    setAiSource("")
  }, [])

  return (
    <div style={styles.container}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cabin:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>

      <h1 style={styles.title}>
        ⚔️ Creature Battle Arena
      </h1>
      <p style={styles.subtitle}>
        Enemy AI powered by GitHub Copilot SDK
      </p>

      {phase === PHASES.SELECT && (
        <CreatureSelect
          creatures={CREATURES}
          onSelect={handleCreatureSelect}
        />
      )}

      {phase !== PHASES.SELECT && playerCreature && enemyCreature && (
        <>
          <div style={styles.battleField}>
            <div style={styles.creatureRow}>
              <CreatureCard creature={playerCreature} isEnemy={false} />
              <span style={styles.vs}>VS</span>
              <CreatureCard creature={enemyCreature} isEnemy={true} />
            </div>
          </div>

          {phase === PHASES.RESULT && (
            <BattleResult winner={winner} onPlayAgain={handlePlayAgain} />
          )}

          {phase === PHASES.BATTLE && (
            <>
              <h3 style={{ color: "#ccc", marginBottom: "0.5em" }}>
                Your Moves:
              </h3>
              <MovePanel
                creature={playerCreature}
                onMoveSelect={handleMoveSelect}
                disabled={thinking}
              />
              {thinking && (
                <div style={styles.aiIndicator}>
                  🤖 {aiSource || "Copilot AI is thinking..."}
                </div>
              )}
            </>
          )}

          <BattleLog log={battleLog} />
          {aiSource && !thinking && (
            <div style={styles.aiIndicator}>{aiSource}</div>
          )}
        </>
      )}

      <a href="/" style={styles.backLink}>
        ← Back to Home
      </a>
    </div>
  )
}
