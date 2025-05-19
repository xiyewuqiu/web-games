import { useState, useEffect, useCallback } from 'react';

/**
 * 游戏状态管理钩子
 * @param {string} gameId 游戏ID
 * @param {Object} initialState 初始状态
 * @returns {Object} 游戏状态和方法
 */
export function useGameState(gameId, initialState = {}) {
  // 尝试从本地存储加载游戏状态
  const loadSavedState = () => {
    try {
      const savedState = localStorage.getItem(`game_${gameId}`);
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('加载游戏状态失败:', error);
      return initialState;
    }
  };

  const [gameState, setGameState] = useState(loadSavedState);
  const [highScore, setHighScore] = useState(() => {
    try {
      const savedHighScore = localStorage.getItem(`highscore_${gameId}`);
      return savedHighScore ? parseInt(savedHighScore, 10) : 0;
    } catch (error) {
      return 0;
    }
  });

  // 更新游戏状态
  const updateGameState = useCallback((newState) => {
    if (typeof newState === 'function') {
      setGameState(prevState => {
        const updatedState = newState(prevState);
        return updatedState;
      });
    } else {
      setGameState(prevState => ({
        ...prevState,
        ...newState
      }));
    }
  }, []);

  // 更新高分
  const updateHighScore = useCallback((score) => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem(`highscore_${gameId}`, score.toString());
      } catch (error) {
        console.error('保存高分失败:', error);
      }
    }
  }, [gameId, highScore]);

  // 重置游戏状态
  const resetGameState = useCallback(() => {
    setGameState(initialState);
  }, [initialState]);

  // 保存游戏状态到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(`game_${gameId}`, JSON.stringify(gameState));
    } catch (error) {
      console.error('保存游戏状态失败:', error);
    }
  }, [gameId, gameState]);

  return {
    gameState,
    updateGameState,
    resetGameState,
    highScore,
    updateHighScore
  };
}
