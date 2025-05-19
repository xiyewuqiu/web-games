import { useState, useEffect } from 'react'
import { useGameState } from '../../hooks/useGameState'
import { trackGameStart, trackGameEnd, trackGameEvent } from '../../utils/analytics'
import './style.css'

function ExampleGame() {
  // 使用自定义钩子管理游戏状态
  const { gameState, updateGameState, resetGameState, highScore, updateHighScore } = useGameState('example-game', {
    score: 0,
    timeLeft: 30,
    isGameActive: false,
    targets: []
  })

  const { score, timeLeft, isGameActive, targets } = gameState

  // 开始游戏
  const startGame = () => {
    resetGameState()
    updateGameState({
      score: 0,
      timeLeft: 30,
      isGameActive: true,
      targets: [createTarget()]
    })
    trackGameStart('example-game')
  }

  // 创建目标
  const createTarget = () => {
    return {
      id: Date.now(),
      x: Math.floor(Math.random() * 80) + 10, // 10% - 90%
      y: Math.floor(Math.random() * 80) + 10, // 10% - 90%
      size: Math.floor(Math.random() * 30) + 20 // 20px - 50px
    }
  }

  // 点击目标
  const handleTargetClick = (targetId) => {
    updateGameState(prevState => {
      const newScore = prevState.score + 1
      const newTargets = prevState.targets.filter(target => target.id !== targetId)
      newTargets.push(createTarget())

      // 记录点击事件
      trackGameEvent('example-game', 'target_click', { score: newScore })

      return {
        ...prevState,
        score: newScore,
        targets: newTargets
      }
    })
  }

  // 游戏计时器
  useEffect(() => {
    if (!isGameActive) return

    const timer = setInterval(() => {
      updateGameState(prevState => {
        if (prevState.timeLeft <= 1) {
          clearInterval(timer)

          // 游戏结束，记录分数
          trackGameEnd('example-game', prevState.score, 30)
          updateHighScore(prevState.score)

          return {
            ...prevState,
            timeLeft: 0,
            isGameActive: false,
            targets: []
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
    <div className="example-game">
      <div className="game-header">
        <div className="score">得分: {score}</div>
        <div className="timer">时间: {timeLeft}秒</div>
        <div className="high-score">最高分: {highScore}</div>
      </div>

      {!isGameActive ? (
        <div className="game-start">
          <h2>点击目标游戏</h2>
          <p>在限定时间内点击出现的目标，获得尽可能高的分数！</p>
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
          {targets.map(target => (
            <div
              key={target.id}
              className="target"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                width: `${target.size}px`,
                height: `${target.size}px`
              }}
              onClick={() => handleTargetClick(target.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default ExampleGame
