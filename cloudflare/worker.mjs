const portable = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook/i;
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if ((request.method === 'GET' || request.method === 'HEAD') &&
        ['/', '/m', '/m/'].includes(url.pathname) &&
        !request.headers.has('rsc') && !request.headers.has('next-action')) {
      if (url.pathname === '/' && url.searchParams.get('desktop') !== '1' &&
          (url.searchParams.get('mobile') === '1' || portable.test(request.headers.get('user-agent') || ''))) {
        url.pathname = '/m';
        url.searchParams.delete('mobile');
        return new Response(null, { status: 307, headers: { location: url.href, 'cache-control': 'private, no-store' } });
      }
      const response = await env.ASSETS.fetch(request);
      const headers = new Headers(response.headers);
      headers.set('cache-control', 'no-cache');
      headers.set('x-game-shell', 'static-v1');
      return new Response(response.body, { status: response.status, headers });
    }
    const { default: app } = await import('../.open-next/worker.js');
    return app.fetch(request, env, ctx);
  },
};
