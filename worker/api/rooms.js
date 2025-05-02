export async function onRequestGet(context) {
  const { DB } = context.env;
  const { results } = await DB.prepare('SELECT * FROM rooms').all();
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
} 