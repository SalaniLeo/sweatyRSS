import { env } from '$env/dynamic/private';

export async function POST({ request, cookies }) {
    let backendUrl = env.BACKEND;
    const { feed_id, guid } = await request.json();

    let response = await fetch(`${backendUrl}/api/feed/add_read`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${cookies.get('session')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            feed_id: feed_id,
            guid: guid
        })
    });

    const jsonResponse = await response.json();

    return new Response(JSON.stringify(jsonResponse), {
        status: response.status,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}