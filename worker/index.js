export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { DB } = env;

    if (url.pathname === '/api/rooms' && request.method === 'GET') {
      // Fetch all rooms from D1
      const { results } = await DB.prepare('SELECT * FROM rooms').all();
      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/bookings' && request.method === 'GET') {
      // Fetch bookings for a room
      const room_id = url.searchParams.get('room_id');
      if (!room_id) {
        return new Response(JSON.stringify({ error: 'room_id required' }), { status: 400 });
      }
      const { results } = await DB.prepare('SELECT * FROM bookings WHERE room_id = ? ORDER BY start_time').bind(room_id).all();
      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/bookings' && request.method === 'POST') {
      // Create a new booking with conflict check
      const data = await request.json();
      const { room_id, user_name, start_time, end_time } = data;
      if (!room_id || !user_name || !start_time || !end_time) {
        return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
      }
      // Check for booking conflicts
      const conflict = await DB.prepare(`SELECT 1 FROM bookings WHERE room_id = ? AND ((start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?) OR (start_time >= ? AND end_time <= ?)) LIMIT 1`)
        .bind(room_id, end_time, end_time, start_time, start_time, start_time, end_time).first();
      if (conflict) {
        return new Response(JSON.stringify({ error: 'Time slot already booked.' }), { status: 409 });
      }
      await DB.prepare('INSERT INTO bookings (room_id, user_name, start_time, end_time) VALUES (?, ?, ?, ?)')
        .bind(room_id, user_name, start_time, end_time).run();
      return new Response(JSON.stringify({ message: 'Booking successful!' }), { headers: { 'Content-Type': 'application/json' } });
    }

    return new Response('Not found', { status: 404 });
  }
} 