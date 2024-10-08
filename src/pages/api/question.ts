import { Client } from 'pg';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL, // .envファイルから接続情報を取得
  });

  await client.connect();

  const { content } = req.body;  // リクエストから質問の内容を取得

  try {
    // 'questions' テーブルにデータを挿入
    await client.query('INSERT INTO questions (content) VALUES ($1)', [content]);
    res.status(200).json({ message: '質問が保存されました。' });
  } catch (error) {
    res.status(500).json({ error: 'データベースエラーが発生しました。' });
  } finally {
    client.end();
  }
}
