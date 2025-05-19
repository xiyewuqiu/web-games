import { useState, useEffect, useCallback } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { trackGameStart, trackGameEnd, trackGameEvent } from '../../utils/analytics'
import './style.css'

// 颜色配置
const COLORS = [
  '#FF5252', // 红色
  '#4CAF50', // 绿色
  '#2196F3', // 蓝色
  '#FFEB3B', // 黄色
  '#9C27B0', // 紫色
  '#FF9800'  // 橙色
]

// 难度配置
const DIFFICULTY_LEVELS = [
  { gridSize: 3, targetPatterns: 1, timeBonus: 10 },
  { gridSize: 4, targetPatterns: 2, timeBonus: 8 },
  { gridSize: 5, targetPatterns: 3, timeBonus: 6 }
]

function ColorHarmony() {
  console.log('Color Harmony component loaded')

  // 使用自定义钩子管理游戏状态
  const { gameState, updateGameState, resetGameState, highScore, updateHighScore } = useGameState('color-harmony', {
    score: 0,
    timeLeft: 60,
    level: 0,
    isGameActive: false,
    grid: [],
    targetPattern: [],
    selectedTiles: []
  })

  const { score, timeLeft, level, isGameActive, grid, targetPattern, selectedTiles } = gameState
  const [showLevelUp, setShowLevelUp] = useState(false)

  // 创建网格 - 简化版本
  const createGrid = useCallback((size) => {
    console.log(`Creating grid of size ${size}`)
    const newGrid = []
    for (let i = 0; i < size; i++) {
      const row = []
      for (let j = 0; j < size; j++) {
        row.push({
          id: `${i}-${j}`,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          row: i,
          col: j
        })
      }
      newGrid.push(row)
    }
    return newGrid
  }, [])

  // 创建目标模式 - 简化版本
  const createTargetPattern = useCallback((size, count) => {
    console.log(`Creating ${count} target patterns for grid size ${size}`)
    const patterns = []
    for (let p = 0; p < count; p++) {
      const pattern = []
      // 简化：只使用2x2的模式
      const startRow = Math.floor(Math.random() * (size - 1))
      const startCol = Math.floor(Math.random() * (size - 1))

      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          if (startRow + i < size && startCol + j < size) {
            pattern.push({
              row: startRow + i,
              col: startCol + j,
              color: COLORS[Math.floor(Math.random() * COLORS.length)]
            })
          }
        }
      }
      patterns.push(pattern)
    }
    return patterns
  }, [])

  // 开始游戏
  const startGame = () => {
    const initialLevel = 0
    const { gridSize } = DIFFICULTY_LEVELS[initialLevel]
    const newGrid = createGrid(gridSize)
    const newTargetPattern = createTargetPattern(gridSize, DIFFICULTY_LEVELS[initialLevel].targetPatterns)

    console.log('Starting Color Harmony game', { gridSize, newGrid, newTargetPattern })

    resetGameState()
    updateGameState({
      score: 0,
      timeLeft: 60,
      level: initialLevel,
      isGameActive: true,
      grid: newGrid,
      targetPattern: newTargetPattern,
      selectedTiles: []
    })

    trackGameStart('color-harmony')
  }

  // 选择瓦片
  const handleTileClick = (row, col) => {
    if (!isGameActive) return

    updateGameState(prevState => {
      const tileId = `${row}-${col}`
      const isTileSelected = prevState.selectedTiles.some(tile => tile.id === tileId)

      let newSelectedTiles
      if (isTileSelected) {
        // 如果已选中，则取消选中
        newSelectedTiles = prevState.selectedTiles.filter(tile => tile.id !== tileId)
      } else {
        // 如果未选中，则添加到选中列表
        if (prevState.selectedTiles.length < 2) {
          newSelectedTiles = [...prevState.selectedTiles, { id: tileId, row, col }]
        } else {
          // 最多选中两个瓦片
          return prevState
        }
      }

      // 如果选中了两个瓦片，交换它们
      if (newSelectedTiles.length === 2) {
        const [tile1, tile2] = newSelectedTiles

        // 检查是否相邻
        const isAdjacent = (
          (Math.abs(tile1.row - tile2.row) === 1 && tile1.col === tile2.col) ||
          (Math.abs(tile1.col - tile2.col) === 1 && tile1.row === tile2.row)
        )

        if (isAdjacent) {
          // 交换瓦片
          const newGrid = [...prevState.grid]
          const temp = newGrid[tile1.row][tile1.col].color
          newGrid[tile1.row][tile1.col].color = newGrid[tile2.row][tile2.col].color
          newGrid[tile2.row][tile2.col].color = temp

          // 检查是否匹配目标模式
          const matchResult = checkPatternMatch(newGrid, prevState.targetPattern)

          if (matchResult.matched) {
            // 匹配成功，加分并生成新的目标模式
            const currentLevel = prevState.level
            const { timeBonus } = DIFFICULTY_LEVELS[currentLevel]
            const newScore = prevState.score + (matchResult.matchCount * 10)

            // 检查是否升级
            let newLevel = currentLevel
            let shouldLevelUp = false
            if (newScore >= (currentLevel + 1) * 50 && currentLevel < DIFFICULTY_LEVELS.length - 1) {
              newLevel = currentLevel + 1
              shouldLevelUp = true
            }

            const { gridSize } = DIFFICULTY_LEVELS[newLevel]
            const newTargetPattern = createTargetPattern(gridSize, DIFFICULTY_LEVELS[newLevel].targetPatterns)

            // 如果升级，创建新的网格
            const updatedGrid = shouldLevelUp ? createGrid(gridSize) : newGrid

            // 记录匹配事件
            trackGameEvent('color-harmony', 'pattern_match', { score: newScore, level: newLevel })

            // 显示升级提示
            if (shouldLevelUp) {
              setShowLevelUp(true)
              setTimeout(() => setShowLevelUp(false), 2000)
            }

            return {
              ...prevState,
              score: newScore,
              timeLeft: prevState.timeLeft + timeBonus,
              level: newLevel,
              grid: updatedGrid,
              targetPattern: newTargetPattern,
              selectedTiles: []
            }
          }

          return {
            ...prevState,
            grid: newGrid,
            selectedTiles: []
          }
        }
      }

      return {
        ...prevState,
        selectedTiles: newSelectedTiles
      }
    })
  }

  // 检查模式匹配 - 简化版本
  const checkPatternMatch = (grid, targetPatterns) => {
    console.log('Checking pattern match', { grid, targetPatterns })
    let matchCount = 0

    for (const pattern of targetPatterns) {
      let isPatternMatched = true

      for (const tile of pattern) {
        if (tile.row >= grid.length || tile.col >= grid[0].length ||
            grid[tile.row][tile.col].color !== tile.color) {
          isPatternMatched = false
          break
        }
      }

      if (isPatternMatched) {
        console.log('Pattern matched!', pattern)
        matchCount++
      }
    }

    const result = {
      matched: matchCount > 0,
      matchCount
    }
    console.log('Match result:', result)
    return result
  }

  // 游戏计时器
  useEffect(() => {
    if (!isGameActive) return

    const timer = setInterval(() => {
      updateGameState(prevState => {
        if (prevState.timeLeft <= 1) {
          clearInterval(timer)

          // 游戏结束，记录分数
          trackGameEnd('color-harmony', prevState.score, 60)
          updateHighScore(prevState.score)

          return {
            ...prevState,
            timeLeft: 0,
            isGameActive: false
          }
        }

        return {
          ...prevState,
          timeLeft: prevState.timeLeft - 1
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isGameActive, updateGameState, updateHighScore])

  return (
    <div className="color-harmony">
      <div className="game-header">
        <div className="score">得分: {score}</div>
        <div className="level">等级: {level + 1}</div>
        <div className="timer">时间: {timeLeft}秒</div>
        <div className="high-score">最高分: {highScore}</div>
      </div>

      {!isGameActive ? (
        <div className="game-start">
          <h2>色彩和谐</h2>
          <p>交换相邻的色块，使其匹配目标模式，获得高分！</p>
          <button onClick={startGame}>开始游戏</button>
          {score > 0 && (
            <div className="game-results">
              <p className="final-score">最终得分: {score}</p>
              {score >= highScore && score > 0 && (
                <p className="new-record">新纪录！</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="game-area">
          <div className="game-container">
            <div className="target-area">
              <h3>目标模式</h3>
              <div className="target-patterns">
                {targetPattern.map((pattern, patternIndex) => (
                  <div key={patternIndex} className="target-pattern">
                    {Array.from({ length: DIFFICULTY_LEVELS[level].gridSize }).map((_, row) => (
                      <div key={row} className="pattern-row">
                        {Array.from({ length: DIFFICULTY_LEVELS[level].gridSize }).map((_, col) => {
                          const patternTile = pattern.find(t => t.row === row && t.col === col)
                          return (
                            <div
                              key={col}
                              className="pattern-tile"
                              style={{
                                backgroundColor: patternTile ? patternTile.color : 'transparent',
                                opacity: patternTile ? 1 : 0.2
                              }}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid-area">
              {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row">
                  {row.map((tile, colIndex) => {
                    const isSelected = selectedTiles.some(t => t.id === tile.id)
                    return (
                      <div
                        key={colIndex}
                        className={`grid-tile ${isSelected ? 'selected' : ''}`}
                        style={{ backgroundColor: tile.color }}
                        onClick={() => handleTileClick(rowIndex, colIndex)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {showLevelUp && (
            <div className="level-up">
              <span>升级！</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ColorHarmony
