import { env } from '$env/dynamic/private';

export async function GET({ fetch }) {
    let backendUrl = env.BACKEND;
    let response = await fetch(`${backendUrl}/api/createdefault`);

    return new Response(JSON.stringify(await response.json()), { status: response.status });
}