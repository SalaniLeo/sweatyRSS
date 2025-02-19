import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
    const backendUrl = env.BACKEND;

    // Correct way to get the token from headers
    const token = request.headers.get('Authorization');

    if (!token) {
        return json({ valid: false, error: 'Missing token' }, { status: 400 });
    }

    const response = await fetch(`${backendUrl}/api/validate`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    return json(await response.json());

}
