import './style.css'

function About() {
  return (
    <div className="about-page">
      <h1 className="page-title">关于我们</h1>
      
      <div className="about-content">
        <section className="about-section">
          <h2 className="section-title">小游戏聚合平台</h2>
          <p>
            小游戏聚合平台是一个专注于提供各种有趣、休闲的网页小游戏的平台。
            我们致力于为用户提供简单易上手、富有趣味性的游戏体验。
          </p>
        </section>
        
        <section className="about-section">
          <h2 className="section-title">我们的使命</h2>
          <p>
            我们的使命是让每个人都能在繁忙的生活中找到片刻的放松和乐趣。
            通过精心挑选和开发各种类型的小游戏，我们希望能够满足不同用户的需求和喜好。
          </p>
        </section>
        
        <section className="about-section">
          <h2 className="section-title">技术支持</h2>
          <p>
            本平台使用现代Web技术构建，包括React、Vite等前端技术，并部署在Cloudflare上，
            确保快速、稳定的访问体验。
          </p>
        </section>
        
        <section className="about-section">
          <h2 className="section-title">联系我们</h2>
          <p>
            如果您有任何问题、建议或合作意向，欢迎联系我们。
          </p>
          <p>
            邮箱：contact@example.com
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
