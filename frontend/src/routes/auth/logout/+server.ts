import { serialize } from 'cookie';

export async function GET({ request }) {

    const session = serialize('session', '', {
        secure: false,
        path: '/',
        expires: new Date(0)
    });

    const headers = new Headers();
    headers.append('Set-Cookie', session);
    headers.append('Content-Type', 'application/json');

    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
        status: 200,
        headers: headers
    });
}
