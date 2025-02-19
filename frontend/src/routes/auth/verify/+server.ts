import { serialize } from 'cookie';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
    let backendUrl = env.BACKEND;

    const { username, password } = await request.json();

    const response = await fetch(backendUrl + '/api/user/verifypassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    return new Response(JSON.stringify(await response.json()), {status: response.status});
}