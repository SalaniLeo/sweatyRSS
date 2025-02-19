import { env } from '$env/dynamic/private';

export async function GET({ cookies }) {
    let backendUrl = env.BACKEND;
    let response = await fetch(`${backendUrl}/api/feed/get`, {
        headers: {
            'Authorization': `Bearer ${cookies.get('session')}`,
        }
    })

    return new Response(JSON.stringify(await response.json()), { status: response.status });
}