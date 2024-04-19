import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const username = cookieStore.get('username')?.value;

  return Response.json({ username });
}
