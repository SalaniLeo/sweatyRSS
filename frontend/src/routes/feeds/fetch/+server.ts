import { env } from '$env/dynamic/private';

export async function POST({ request, cookies }) {
    let backendUrl = env.BACKEND;
    const { feed_url } = await request.json();

    let response = await fetch(`${backendUrl}/api/feed/fetch`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${cookies.get('session')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            feed_url: feed_url
        })
    });

    const xmlContent = await response.text();

    return new Response(xmlContent, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml'
        }
    });
}