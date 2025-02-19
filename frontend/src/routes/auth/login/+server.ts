import { serialize } from 'cookie';
import { env } from '$env/dynamic/private';

export async function POST({ request }) {
    let backendUrl = env.BACKEND;

    try {
        const { username, password } = await request.json();

        const response = await fetch(backendUrl + '/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: 'Login failed' }), {
                status: response.status
            });
        }

        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Set-Cookie': serialize('session', data.token, {
                    path: '/',
                    httpOnly: false,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 7 * 2
                })
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500
        });
    }
}