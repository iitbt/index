export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    ADMIN_USER: context.env.ADMIN_USER || '',
    ADMIN_PASS: context.env.ADMIN_PASS || ''
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
