// 中间件函数，用于处理请求
export async function onRequest(context) {
  const { request } = context;
  
  // 添加安全相关的响应头
  const response = await context.next();
  const newResponse = new Response(response.body, response);
  
  // 设置安全相关的响应头
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('X-Frame-Options', 'DENY');
  newResponse.headers.set('X-XSS-Protection', '1; mode=block');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newResponse.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;");
  
  return newResponse;
}
