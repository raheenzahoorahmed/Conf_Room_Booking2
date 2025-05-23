export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const { db } = env;
  const room_id = url.searchParams.get('room_id');
  let results;
  if (!room_id || room_id === 'all') {
    // Return all bookings
    results = (await db.prepare('SELECT * FROM bookings').all()).results;
  } else {
    // Return bookings for a specific room
    results = (await db.prepare('SELECT * FROM bookings WHERE room_id = ? ORDER BY start_time').bind(room_id).all()).results;
  }
  return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const { db } = env;
  const data = await request.json();
  const { room_id, user_name, start_time, end_time } = data;
  if (!room_id || !user_name || !start_time || !end_time) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }
  // Check for booking conflicts
  const conflict = await db.prepare(`SELECT 1 FROM bookings WHERE room_id = ? AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?) OR (start_time >= ? AND end_time <= ?)) LIMIT 1`)
    .bind(room_id, end_time, end_time, start_time, start_time, start_time, end_time).first();
  if (conflict) {
    return new Response(JSON.stringify({ error: 'Time slot already booked.' }), { status: 409 });
  }
  await db.prepare('INSERT INTO bookings (room_id, user_name, start_time, end_time) VALUES (?, ?, ?, ?)')
    .bind(room_id, user_name, start_time, end_time).run();
  return new Response(JSON.stringify({ message: 'Booking successful!' }), { headers: { 'Content-Type': 'application/json' } });
} 