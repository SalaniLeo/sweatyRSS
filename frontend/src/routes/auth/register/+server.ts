import { serialize } from 'cookie';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
    let backendUrl = env.BACKEND;

    try {
        const { username, email, password } = await request.json();

        const response = await fetch(backendUrl + '/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        if (!response.ok) {
            return new Response(JSON.stringify(await response.json()), { status: response.status });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data));
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500
        });
    }
}