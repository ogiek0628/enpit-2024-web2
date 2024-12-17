"use client";
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  
  // タグを取得し配列として格納
  const tagNames = url.searchParams.get('tag')?.split(',') || [];

  // status クエリパラメータ (resolved / unresolved) の処理
  const statusParam = url.searchParams.get('status');
  const resolvedStatus = statusParam === 'resolved' ? true : statusParam === 'unresolved' ? false : undefined;

  try {
    // データベースから質問データを取得
    const questions = await prisma.question.findMany({
      where: {
        // タグフィルタリング
        tags: tagNames.length > 0
          ? {
              some: {
                name: { in: tagNames }, // タグがいずれか一致する
              },
            }
          : {},

        // 解決状態フィルタリング
        isResolved: resolvedStatus,
      },
      orderBy: { createdAt: 'desc' }, // 作成日時の降順でソート
      include: { tags: true }, // 関連するタグデータも含める
    });

    // 検索結果を返す
    return NextResponse.json(questions, { status: 200 });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}