import { getAssetFromKV, serveSinglePageApp } from '@cloudflare/kv-asset-handler'

/**
 * 处理程序主函数
 */
export default {
  async fetch(request, env, ctx) {
    try {
      // 获取请求的URL
      const url = new URL(request.url)
      
      // 配置KV资产处理选项
      const options = {
        // 对于SPA应用，使用以下配置
        mapRequestToAsset: serveSinglePageApp
      }

      // 特殊路径处理
      if (url.pathname.startsWith('/api/')) {
        // 如果需要处理API请求，可以在这里添加逻辑
        return new Response('API接口尚未实现', { status: 501 })
      }

      // 从KV获取静态资产
      return await getAssetFromKV({
        request,
        waitUntil: ctx.waitUntil.bind(ctx),
        ASSET_NAMESPACE: env.ASSETS
      }, options)
      
    } catch (e) {
      // 处理错误
      console.error(e)
      return new Response('服务器错误: ' + (e.message || '未知错误'), { 
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    }
  }
} 