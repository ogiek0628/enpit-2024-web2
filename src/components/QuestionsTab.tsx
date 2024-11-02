"use client";
import React, { useState } from 'react';
import styles from '@/app/page.module.css';
import { marked } from 'marked'; // markedライブラリをインポート

type Question = {
  id: number;
  title: string;
  content: string;
};

type QuestionsTabProps = {
  questions: Question[];
};

const QuestionsTab: React.FC<QuestionsTabProps> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState('tab1'); // タブの状態を管理

  // タブを切り替える関数
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <p>タグ一覧</p>
        {/* タグのリスト（ダミー表示のまま） */}
        {1.1}<br />
        {1.2}<br />
        {1.3}<br />
      </aside>

      <main className={styles.main}>
        {/* タブナビゲーション */}
        <div className={styles.tabs}>
          <button
            className={`${activeTab === 'tab1' ? styles.activeTab1 : styles.inactiveTab}`}
            onClick={() => handleTabClick('tab1')}
          >
            最新の質問
          </button>
          <button
            className={`${activeTab === 'tab2' ? styles.activeTab2 : styles.inactiveTab}`}
            onClick={() => handleTabClick('tab2')}
          >
            未解決の質問
          </button>
        </div>

        {/* タブのコンテンツ */}
        <div className={styles.tabContent}>
          {activeTab === 'tab1' && (
            <div className={styles.question}>
              {questions.map((question) => (
                <div key={question.id} className={styles.questionItem}>
                  <h2>{question.title}</h2>
                  <button>解決</button>
                  <button>未解決</button>
                  <div
                    className={styles.markdownContent} // 追加したスタイルを適用
                    dangerouslySetInnerHTML={{ __html: marked(question.content) }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tab2' && (
            <div className={styles.question}>
              {/* 未解決の質問をここに表示する */}
              <div className={styles.questionItem}>
                <h2>未解決の問題1: データベース接続エラーの解決策</h2>
                <p>
                  あるデータベースに接続する際に「接続タイムアウト」のエラーが発生しました。この問題を解決するための手順を教えていただけますか？
                </p>
              </div>
              {/* 他の未解決の問題も同様に追加 */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionsTab;
