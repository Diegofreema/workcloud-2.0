import { StreamChat } from 'stream-chat';

const apiKey = process.env.STREAM_API_KEY as string;
const apiSecret = process.env.STREAM_API_SECRET;
const serverClient = new StreamChat(apiKey, apiSecret);

export async function Post(request: Request) {
  console.log('called');
  const { id } = await request.json();
  if (!id) {
    return new Response('Id not found', {
      status: 400,
      headers: {
        contentType: 'text/plain',
      },
    });
  }
  const streamToken = serverClient.createToken(id);
  return Response.json({ streamToken });
}



