"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // クエリパラメータ取得用
import { marked } from "marked";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import styles from "./page.module.css";
import TagSelector from "@/components/TagSelector";
import Header from "@/components/header/header";

type Tag = {
  id: number;
  name: string;
};

type IsResolved = boolean;

type Question = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  isResolved: boolean;
  tags: Tag[];
};

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return format(dateObj, "yyyy年MM月dd日 HH:mm", { locale: ja });
};

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams(); // クエリパラメータを取得
  const [status, setStatus] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedIsResolved, setSelectedIsResolved] = useState<IsResolved>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 初期クエリパラメータの読み込みと検索実行
  useEffect(() => {
    const tagParam = searchParams.get("tag");
    if (tagParam) {
      const initialTag = { id: Date.now(), name: tagParam }; // タグ名をオブジェクトに変換
      setSelectedTags([initialTag]);
      fetchQuestions([initialTag]); // 初期検索を実行
    }
  }, [searchParams]);

  const fetchQuestions = async (tags: Tag[]) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (tags.length > 0) {
        queryParams.set(
          "tag",
          tags.map((tag) => tag.name).join(",")
        );
      }

      if (selectedIsResolved !== null) {
        queryParams.set("isResolved", selectedIsResolved.toString());
      }

      const res = await fetch(`/api/get-questions?${queryParams.toString()}`);
      if (!res.ok) throw new Error("データの取得に失敗しました。");

      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

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
              value="true"
              checked={selectedIsResolved === true}
              onChange={() => setSelectedIsResolved(true)}
              disabled={loading}
            />
            解決済
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="false"
              checked={selectedIsResolved === false}
              onChange={() => setSelectedIsResolved(false)}
              disabled={loading}
            />
            未解決
          </label>
        </div>

        <button onClick={() => fetchQuestions(selectedTags)} disabled={loading}>
          {loading ? "検索中..." : "検索する"}
        </button>
      </div>

      <div className={styles.questionList}>
        {isInitialLoad ? (
          <p>キーワードやタグを入力してください。</p>
        ) : questions.length > 0 ? (
          questions.map((question) => (
            <div key={question.id} className={styles.questionItem}>
              <h3>
                <Link href={`/question/${question.id}`}>{question.title}</Link>
              </h3>
              <div className={styles.dateAndTags}>
                <div>
                  {question.tags.map((tag) => (
                    <span key={tag.id} className={styles.tag}>
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div>{formatDate(question.createdAt)}</div>
              </div>
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