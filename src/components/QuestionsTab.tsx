"use client";
import React, { useState } from 'react';
import styles from '@/app/page.module.css';
import { marked } from 'marked';

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
  const [unresolvedQuestions, setUnresolvedQuestions] = useState(questions); // 未解決の質問
  const [resolvedQuestions, setResolvedQuestions] = useState<Question[]>([]); // 解決済みの質問

  // タブを切り替える関数
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // 質問を解決済みにする関数
  const handleResolve = (id: number) => {
    const resolvedQuestion = unresolvedQuestions.find((q) => q.id === id);
    if (resolvedQuestion) {
      setUnresolvedQuestions(unresolvedQuestions.filter((q) => q.id !== id));
      setResolvedQuestions([...resolvedQuestions, resolvedQuestion]);
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
                  <button>未解決</button>
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
