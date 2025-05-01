import { create } from 'ipfs-http-client';
import { NextRequest, NextResponse } from 'next/server';

type CoinMetadata = {
  name: string;
  description: string;
  symbol: string;
  image: string;
  animation_url: string;
  content: {
    uri: string;
    mime: 'image/png';
  };
};

export async function POST(request: NextRequest): Promise<NextResponse<{ cid: string }>> {
  const { oneLiner, description, image } = (await request.json()) as {
    oneLiner: string;
    description: string;
    image: Buffer;
  };

  const infuraAuth =
    'Basic ' + Buffer.from(process.env.INFURA_API_KEY + ':' + process.env.INFURA_API_SECRET).toString('base64');

  const ipfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: infuraAuth,
    },
  });

  const { cid: imageCid } = await ipfsClient.add(image);

  const metadata: CoinMetadata = {
    name: oneLiner,
    description,
    symbol: oneLiner,
    image: `https://api.devfolio.co/api/ipfs/${imageCid}`,
    animation_url: `https://api.devfolio.co/api/ipfs/${imageCid}`,
    content: {
      uri: `https://api.devfolio.co/api/ipfs/${imageCid}`,
      mime: 'image/png',
    },
  };

  const { cid } = await ipfsClient.add(JSON.stringify(metadata));

  return NextResponse.json({
    cid: cid.toString(),
  });
}
