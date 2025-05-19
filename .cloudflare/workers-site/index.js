import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

/**
 * 处理静态资产请求的事件处理程序
 */
async function handleEvent(event) {
  try {
    // 从KV存储获取资产
    return await getAssetFromKV(event);
  } catch (e) {
    // 如果资产未找到
    let notFoundResponse = new Response('404 资源未找到', {
      status: 404
    });
    return notFoundResponse;
  }
}

// 监听fetch事件
addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    // 处理错误
    event.respondWith(new Response('发生错误', { status: 500 }));
  }
}); 