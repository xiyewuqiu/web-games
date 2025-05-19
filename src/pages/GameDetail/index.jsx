import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGameById } from '../../utils/gameUtils'
import './style.css'

function GameDetail() {
  const { id } = useParams()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const gameData = await getGameById(id)
        setGame(gameData)
      } catch (error) {
        console.error('获取游戏详情失败:', error)
        setError('无法加载游戏，请稍后再试')
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [id])

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  if (error || !game) {
    return (
      <div className="error-state">
        <h2>出错了</h2>
        <p>{error || '找不到该游戏'}</p>
        <Link to="/" className="back-button">返回首页</Link>
      </div>
    )
  }

  // 动态导入游戏组件
  const GameComponent = React.lazy(() => import(`../../games/${game.path}`))

  return (
    <div className="game-detail-page">
      <div className="game-header">
        <Link to="/" className="back-link">返回首页</Link>
        <h1 className="game-title">{game.title}</h1>
      </div>

      <div className="game-info">
        <div className="game-description">
          <p>{game.description}</p>
        </div>

        <div className="game-meta">
          <div className="meta-item">
            <span className="meta-label">类型:</span>
            <span className="meta-value">{game.category}</span>
          </div>
        </div>
      </div>

      <div className="game-container">
        <React.Suspense fallback={<div className="loading">游戏加载中...</div>}>
          <GameComponent />
        </React.Suspense>
      </div>
    </div>
  )
}

export default GameDetail
