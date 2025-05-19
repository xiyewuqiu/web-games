// 游戏数据缓存
let gamesCache = null;

/**
 * 获取所有游戏列表
 * @returns {Promise<Array>} 游戏列表
 */
export const getGames = async () => {
  try {
    // 如果有缓存，直接返回缓存
    if (gamesCache) {
      return gamesCache;
    }

    // 从API获取游戏列表
    const response = await fetch('/api/games');

    if (!response.ok) {
      throw new Error('获取游戏列表失败');
    }

    const games = await response.json();
    gamesCache = games; // 缓存结果
    return games;
  } catch (error) {
    console.error('获取游戏列表错误:', error);

    // 如果API请求失败，返回默认游戏数据
    return [
      {
        id: 'example-game',
        title: '示例游戏',
        description: '这是一个简单的示例游戏，展示了如何在平台上集成游戏。',
        thumbnail: '/images/example-game.jpg',
        category: '休闲',
        path: 'example-game'
      }
    ];
  }
}

/**
 * 根据ID获取游戏详情
 * @param {string} id 游戏ID
 * @returns {Promise<Object|null>} 游戏详情或null
 */
export const getGameById = async (id) => {
  try {
    // 获取所有游戏
    const games = await getGames();

    // 查找指定ID的游戏
    const game = games.find(game => game.id === id);

    if (!game) {
      throw new Error('游戏不存在');
    }

    return game;
  } catch (error) {
    console.error('获取游戏详情错误:', error);
    throw error;
  }
}
