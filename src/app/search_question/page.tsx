"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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
  const router = useRouter(); // ルーターを使ってクエリパラメータを取得
  const [status, setStatus] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // URL クエリパラメータから初期状態をセット
  useEffect(() => {
    if (!router.isReady) return; // ルーターが準備できていない場合は何もしない

    const queryTag = router.query.tag as string;

    if (queryTag) {
      // クエリからタグ情報を取得し、選択状態に反映
      const tagNames = queryTag.split(",");
      const tags = tagNames.map((name, index) => ({ id: index, name }));
      setSelectedTags(tags);
    }

    fetchQuestions(queryTag);
  }, [router.isReady, router.query]);

  // 質問データを取得する関数
  const fetchQuestions = async (queryTag: string = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      // タグをクエリパラメータに追加
      if (queryTag || selectedTags.length > 0) {
        const tags = queryTag || selectedTags.map((tag) => tag.name).join(",");
        queryParams.set("tag", tags);
      }

      // 解決状態をクエリパラメータに追加
      if (status) {
        queryParams.set("status", status);
      }

      const res = await fetch(`/api/get-questions?${queryParams.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await res.json();
      setQuestions(data); // 取得した質問データをセット
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.searchContainer}>
        <textarea
          placeholder="キーワードを入力してください（任意）"
          className={styles.textarea}
          disabled={loading}
        />

        <TagSelector
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          isProcessing={loading}
          allowTagCreation={false} // タグ作成を無効化
        />

        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
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
          <label className={styles.radioLabel}>
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

        <button className={styles.button} onClick={() => fetchQuestions()} disabled={loading}>
          {loading ? "質問検索中..." : "検索する"}
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
              <p>
                <strong>タグ:</strong>{" "}
                {question.tags.map((tag) => tag.name).join(", ")}
              </p>
              <p>
                <strong>ステータス:</strong>{" "}
                {question.isResolved ? "解決済" : "未解決"}
              </p>
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