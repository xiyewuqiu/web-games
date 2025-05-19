import { Link } from 'react-router-dom'
import './style.css'

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container header-container">
          <Link to="/" className="logo">
            小游戏聚合平台
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">首页</Link>
            <Link to="/about" className="nav-link">关于</Link>
          </nav>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} 小游戏聚合平台 - 休闲游戏尽在掌握</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
