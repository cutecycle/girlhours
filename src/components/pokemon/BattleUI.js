import React from "react"

const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  normal: "#A8A878",
}

const styles = {
  container: {
    fontFamily: "'Cabin', monospace",
    maxWidth: "640px",
    margin: "0 auto",
    padding: "1em",
    backgroundColor: "#1a1a2e",
    color: "#e0e0e0",
    minHeight: "100vh",
  },
  title: {
    textAlign: "center",
    color: "#FFD700",
    fontSize: "1.5em",
    marginBottom: "0.5em",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  },
  subtitle: {
    textAlign: "center",
    color: "#aaa",
    fontSize: "0.8em",
    marginBottom: "1.5em",
  },
  battleField: {
    backgroundColor: "#16213e",
    borderRadius: "12px",
    padding: "1em",
    marginBottom: "1em",
    border: "2px solid #0f3460",
  },
  creatureRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5em",
  },
  creatureCard: {
    flex: "1",
    padding: "0.75em",
    borderRadius: "8px",
    textAlign: "center",
  },
  sprite: {
    fontSize: "3em",
    display: "block",
    marginBottom: "0.25em",
  },
  creatureName: {
    fontWeight: "bold",
    fontSize: "1.1em",
  },
  hpBar: {
    width: "100%",
    height: "12px",
    backgroundColor: "#333",
    borderRadius: "6px",
    overflow: "hidden",
    marginTop: "0.25em",
  },
  hpFill: (ratio) => ({
    width: `${Math.max(0, ratio * 100)}%`,
    height: "100%",
    backgroundColor: ratio > 0.5 ? "#4CAF50" : ratio > 0.2 ? "#FFC107" : "#f44336",
    transition: "width 0.5s ease",
    borderRadius: "6px",
  }),
  hpText: {
    fontSize: "0.8em",
    color: "#ccc",
    marginTop: "0.15em",
  },
  typeBadge: (type) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "4px",
    backgroundColor: typeColors[type] || "#888",
    color: "#fff",
    fontSize: "0.75em",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: "0.25em",
  }),
  vs: {
    fontSize: "1.5em",
    fontWeight: "bold",
    color: "#FFD700",
    padding: "0 0.5em",
  },
  moveGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.5em",
    marginBottom: "1em",
  },
  moveButton: (type, disabled) => ({
    padding: "0.75em",
    borderRadius: "8px",
    border: "2px solid " + (typeColors[type] || "#888"),
    backgroundColor: disabled ? "#333" : "#16213e",
    color: disabled ? "#666" : "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    textAlign: "left",
    fontSize: "0.9em",
    transition: "background-color 0.2s",
  }),
  moveName: {
    fontWeight: "bold",
    display: "block",
  },
  moveMeta: {
    fontSize: "0.75em",
    color: "#aaa",
  },
  logBox: {
    backgroundColor: "#0a0a23",
    borderRadius: "8px",
    padding: "0.75em",
    maxHeight: "200px",
    overflowY: "auto",
    fontFamily: "monospace",
    fontSize: "0.85em",
    lineHeight: "1.6",
    border: "1px solid #333",
    marginBottom: "1em",
  },
  logEntry: (isSpecial) => ({
    color: isSpecial ? "#FFD700" : "#b0b0b0",
    margin: "0.1em 0",
  }),
  aiIndicator: {
    textAlign: "center",
    padding: "0.5em",
    color: "#7B68EE",
    fontSize: "0.85em",
    fontStyle: "italic",
  },
  selectScreen: {
    textAlign: "center",
    padding: "2em 1em",
  },
  creatureSelectGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1em",
    marginTop: "1em",
  },
  creatureSelectButton: (type) => ({
    padding: "1em",
    borderRadius: "12px",
    border: "3px solid " + (typeColors[type] || "#888"),
    backgroundColor: "#16213e",
    color: "#fff",
    cursor: "pointer",
    textAlign: "center",
    transition: "transform 0.2s, box-shadow 0.2s",
  }),
  resultOverlay: {
    textAlign: "center",
    padding: "2em",
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: "12px",
    marginBottom: "1em",
  },
  resultText: (won) => ({
    fontSize: "1.5em",
    fontWeight: "bold",
    color: won ? "#4CAF50" : "#f44336",
    marginBottom: "0.5em",
  }),
  button: {
    padding: "0.75em 1.5em",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#7B68EE",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1em",
    fontWeight: "bold",
    marginTop: "0.5em",
  },
  backLink: {
    display: "block",
    textAlign: "center",
    color: "#7B68EE",
    textDecoration: "none",
    marginTop: "1em",
    fontSize: "0.9em",
  },
  copilotBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    backgroundColor: "#7B68EE",
    color: "#fff",
    fontSize: "0.7em",
    fontWeight: "bold",
    marginLeft: "0.5em",
    verticalAlign: "middle",
  },
}

export function CreatureCard({ creature, isEnemy }) {
  const hpRatio = creature.currentHp / creature.maxHp
  return (
    <div style={styles.creatureCard}>
      <span style={styles.sprite}>{creature.sprite}</span>
      <span style={styles.creatureName}>
        {isEnemy ? "Enemy " : ""}
        {creature.name}
        {isEnemy && <span style={styles.copilotBadge}>Copilot AI</span>}
      </span>
      <span style={styles.typeBadge(creature.type)}>{creature.type}</span>
      <div style={styles.hpBar}>
        <div style={styles.hpFill(hpRatio)} />
      </div>
      <div style={styles.hpText}>
        {creature.currentHp}/{creature.maxHp} HP
      </div>
    </div>
  )
}

export function MovePanel({ creature, onMoveSelect, disabled }) {
  return (
    <div style={styles.moveGrid}>
      {creature.moves.map((move, i) => {
        const noPP = creature.movePP[i] <= 0
        return (
          <button
            key={i}
            style={styles.moveButton(move.type, disabled || noPP)}
            disabled={disabled || noPP}
            onClick={() => onMoveSelect(i)}
          >
            <span style={styles.moveName}>{move.name}</span>
            <span style={styles.moveMeta}>
              {move.type.toUpperCase()} | PWR {move.power} | ACC{" "}
              {move.accuracy}% | PP {creature.movePP[i]}/{move.pp}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function BattleLog({ log }) {
  return (
    <div style={styles.logBox}>
      {log.map((entry, i) => {
        const isSpecial =
          entry.includes("super effective") ||
          entry.includes("fainted") ||
          entry.includes("not very effective")
        return (
          <div key={i} style={styles.logEntry(isSpecial)}>
            {entry}
          </div>
        )
      })}
    </div>
  )
}

export function CreatureSelect({ creatures, onSelect }) {
  return (
    <div style={styles.selectScreen}>
      <h2 style={{ color: "#FFD700" }}>Choose Your Creature</h2>
      <p style={{ color: "#aaa" }}>
        Select a creature to battle with. Your opponent will be chosen by
        Copilot AI.
      </p>
      <div style={styles.creatureSelectGrid}>
        {Object.entries(creatures).map(([key, creature]) => (
          <button
            key={key}
            style={styles.creatureSelectButton(creature.type)}
            onClick={() => onSelect(key)}
          >
            <span style={{ fontSize: "2.5em", display: "block" }}>
              {creature.sprite}
            </span>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "1.1em",
                display: "block",
                marginTop: "0.25em",
              }}
            >
              {creature.name}
            </span>
            <span style={styles.typeBadge(creature.type)}>{creature.type}</span>
            <div style={{ fontSize: "0.75em", color: "#aaa", marginTop: "0.5em" }}>
              HP {creature.baseHp} | ATK {creature.attack} | DEF{" "}
              {creature.defense} | SPD {creature.speed}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function BattleResult({ winner, onPlayAgain }) {
  const won = winner === "player"
  return (
    <div style={styles.resultOverlay}>
      <div style={styles.resultText(won)}>
        {won ? "🎉 You Won!" : "💀 You Lost!"}
      </div>
      <p style={{ color: "#ccc" }}>
        {won
          ? "You defeated the Copilot AI!"
          : "The Copilot AI outsmarted you!"}
      </p>
      <button style={styles.button} onClick={onPlayAgain}>
        Play Again
      </button>
    </div>
  )
}

export { styles }
