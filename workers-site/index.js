import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

/**
 * 处理程序主函数
 */
export default {
  async fetch(request, env, ctx) {
    try {
      // 获取请求的URL
      const url = new URL(request.url)
      let options = {}

      // 特殊路径处理
      if (url.pathname.startsWith('/api/')) {
        // 如果需要处理API请求，可以在这里添加逻辑
        return new Response('API接口尚未实现', { status: 501 })
      }

      // 尝试从KV中获取静态资产
      const page = await getAssetFromKV({
        request,
        waitUntil: ctx.waitUntil.bind(ctx)
      }, options)

      // 返回静态资产
      return page
    } catch (e) {
      // 处理错误，如404等
      if (e.status === 404) {
        // 对于SPA应用，我们需要返回index.html
        // 获取index.html内容
        const url = new URL(request.url)
        url.pathname = '/'
        
        try {
          const indexRequest = new Request(url.toString(), request)
          const indexPage = await getAssetFromKV({
            request: indexRequest,
            waitUntil: ctx.waitUntil.bind(ctx)
          })
          
          return indexPage
        } catch (indexError) {
          return new Response('找不到页面', { status: 404 })
        }
      }

      return new Response(e.message || '服务器错误', { status: 500 })
    }
  }
} 