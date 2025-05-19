import { Link } from 'react-router-dom'
import './style.css'

function GameCard({ game }) {
  return (
    <div className="game-card">
      <div className="game-card-image">
        <img src={game.thumbnail} alt={game.title} />
      </div>
      <div className="game-card-content">
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-description">{game.description}</p>
        <div className="game-card-footer">
          <Link to={`/game/${game.id}`} className="game-card-button">
            开始游戏
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GameCard
