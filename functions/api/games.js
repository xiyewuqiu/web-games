// 游戏数据API
export async function onRequest(context) {
  // 模拟游戏数据
  const games = [
    {
      id: 'example-game',
      title: '示例游戏',
      description: '这是一个简单的示例游戏，展示了如何在平台上集成游戏。',
      thumbnail: '/images/example-game.jpg',
      category: '休闲',
      path: 'example-game'
    },
    {
      id: 'color-harmony',
      title: '色彩和谐',
      description: '一款考验你色彩匹配能力的益智游戏。交换相邻的色块，使其匹配目标模式，获得高分！',
      thumbnail: '/images/color-harmony.jpg',
      category: '益智',
      path: 'color-harmony'
    }
    // 后续可以添加更多游戏
  ];

  // 返回JSON格式的游戏数据
  return new Response(JSON.stringify(games), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=3600'
    }
  });
}
