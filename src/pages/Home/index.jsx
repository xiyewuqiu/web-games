import { useState, useEffect } from 'react'
import GameCard from '../../components/GameCard'
import { getGames } from '../../utils/gameUtils'
import './style.css'

function Home() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取游戏列表
    const fetchGames = async () => {
      try {
        const gamesData = await getGames()
        setGames(gamesData)
      } catch (error) {
        console.error('获取游戏列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  if (loading) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="home-page">
      <h1 className="page-title">热门游戏</h1>
      
      {games.length === 0 ? (
        <div className="empty-state">
          <p>暂无游戏，敬请期待！</p>
        </div>
      ) : (
        <div className="games-grid">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
