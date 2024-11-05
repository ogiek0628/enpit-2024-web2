"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/app/page.module.css';
import { marked } from 'marked';

type Question = {
  id: number;
  title: string;
  content: string;
  isResolved: boolean;
};

type QuestionsTabProps = {
  questions: Question[];
};

const QuestionsTab: React.FC<QuestionsTabProps> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState('tab1'); // タブの状態を管理
  const [unresolvedQuestions, setUnresolvedQuestions] = useState<Question[]>([]);
  const [resolvedQuestions, setResolvedQuestions] = useState<Question[]>([]);

  useEffect(() => {
    // 初期の質問データを未解決・解決済みで分けて設定
    const resolved = questions.filter((q) => q.isResolved);
    const unresolved = questions.filter((q) => !q.isResolved);

    setResolvedQuestions(resolved);
    setUnresolvedQuestions(unresolved);
  }, [questions]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // 質問を解決済みにする関数
  const handleResolve = async (id: number) => {
    try {
      // 解決済みAPIを呼び出してデータベースを更新
      const response = await fetch(`/api/questions/${id}/resolve`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        const updatedQuestion = await response.json();

        // 未解決から削除して解決済みへ追加
        setUnresolvedQuestions(unresolvedQuestions.filter((q) => q.id !== id));
        setResolvedQuestions([...resolvedQuestions, updatedQuestion]);
      }
    } catch (error) {
      console.error('質問を解決済みにできませんでした', error);
    }
  };


  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <p>タグ一覧</p>
        {1.1}<br />
        {1.2}<br />
        {1.3}<br />
      </aside>

      <main className={styles.main}>
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

        <div className={styles.tabContent}>
          {/* 最新の質問（解決済み） */}
          {activeTab === 'tab1' && (
            <div className={styles.question}>
              {resolvedQuestions.map((question) => (
                <div key={question.id} className={styles.questionItem}>
                  <h2>{question.title}</h2>
                  <p>解決済み</p>
                  <div
                    className={styles.markdownContent}
                    dangerouslySetInnerHTML={{ __html: marked(question.content) }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* 未解決の質問 */}
          {activeTab === 'tab2' && (
            <div className={styles.question}>
              {unresolvedQuestions.map((question) => (
                <div key={question.id} className={styles.questionItem}>
                  <h2>{question.title}</h2>
                  <button onClick={() => handleResolve(question.id)}>解決</button>
                  <div
                    className={styles.markdownContent}
                    dangerouslySetInnerHTML={{ __html: marked(question.content) }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuestionsTab;
