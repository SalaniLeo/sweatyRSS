import { env } from '$env/dynamic/private';

export async function POST({ request, cookies }) {
    let backendUrl = env.BACKEND;
    const { feed_url } = await request.json();

    let response = await fetch(`${backendUrl}/api/feed/delete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${cookies.get('session')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            feed_url: feed_url
        })
    })


    return new Response(JSON.stringify(await response.json()), { status: response.status });
}

