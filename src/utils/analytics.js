/**
 * 游戏分析工具
 */

// 记录游戏开始
export const trackGameStart = (gameId) => {
  try {
    // 记录游戏开始时间
    sessionStorage.setItem(`game_start_${gameId}`, Date.now().toString());
    
    // 记录游戏启动次数
    const startCount = localStorage.getItem(`game_starts_${gameId}`) || '0';
    localStorage.setItem(`game_starts_${gameId}`, (parseInt(startCount, 10) + 1).toString());
    
    console.log(`游戏 ${gameId} 已开始`);
    
    // 这里可以添加实际的分析代码，例如发送到服务器
  } catch (error) {
    console.error('记录游戏开始失败:', error);
  }
};

// 记录游戏结束
export const trackGameEnd = (gameId, score, duration) => {
  try {
    // 计算游戏时长
    const startTime = sessionStorage.getItem(`game_start_${gameId}`);
    const gameTime = startTime ? Math.floor((Date.now() - parseInt(startTime, 10)) / 1000) : duration;
    
    console.log(`游戏 ${gameId} 已结束，得分: ${score}，时长: ${gameTime}秒`);
    
    // 记录最高分
    const highScore = localStorage.getItem(`highscore_${gameId}`) || '0';
    if (score > parseInt(highScore, 10)) {
      localStorage.setItem(`highscore_${gameId}`, score.toString());
    }
    
    // 这里可以添加实际的分析代码，例如发送到服务器
  } catch (error) {
    console.error('记录游戏结束失败:', error);
  }
};

// 记录游戏事件
export const trackGameEvent = (gameId, eventName, eventData = {}) => {
  try {
    console.log(`游戏事件: ${gameId} - ${eventName}`, eventData);
    
    // 这里可以添加实际的分析代码，例如发送到服务器
  } catch (error) {
    console.error('记录游戏事件失败:', error);
  }
};
