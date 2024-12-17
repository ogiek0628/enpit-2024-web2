"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import TagSelector from "@/components/TagSelector";
import Header from "@/components/header/header";

type Tag = {
  id: number;
  name: string;
};

type Question = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isResolved: boolean;
  tags: Tag[];
};

const SearchPage: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (selectedTags.length > 0) {
        queryParams.set(
          "tag",
          selectedTags.map((tag) => tag.name).join(",")
        );
      }

      if (status) {
        queryParams.set("status", status);
      }

      // get_question APIエンドポイントにリクエストを送信
      const res = await fetch(`/api/get_question?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch questions");

      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(); // 初回読み込み時にデータ取得
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.searchContainer}>
        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          isProcessing={loading}
          allowTagCreation={false}
        />

        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              name="status"
              value="resolved"
              checked={status === "resolved"}
              onChange={() => setStatus("resolved")}
              disabled={loading}
            />
            解決済
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="unresolved"
              checked={status === "unresolved"}
              onChange={() => setStatus("unresolved")}
              disabled={loading}
            />
            未解決
          </label>
        </div>

        <button onClick={fetchQuestions} disabled={loading}>
          {loading ? "検索中..." : "検索する"}
        </button>
      </div>

      <div className={styles.questionList}>
        {loading ? (
          <p>検索中...</p>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className={styles.questionItem}>
              <h3>
                <Link href={`/question/${question.id}`}>{question.title}</Link>
              </h3>
              <p>{question.content}</p>
              <p>ステータス: {question.isResolved ? "解決済" : "未解決"}</p>
              <p>タグ: {question.tags.map((tag) => tag.name).join(", ")}</p>
            </div>
          ))
        ) : (
          <p>条件に一致する質問が見つかりませんでした。</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;