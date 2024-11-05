
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Prisma Clientをインポート

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PATCH') {
    try {
      // 質問の解決状態を更新
      const updatedQuestion = await prisma.question.update({
        where: { id: Number(id) },
        data: { isResolved: true },
      });
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ error: '質問を解決済みにできませんでした' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
