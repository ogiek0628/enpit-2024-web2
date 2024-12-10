"use client";
import React, { useEffect, useState } from "react";
import styles from "./searchpage.module.css";

type SearchPageProps = {
  selectedTags: string[];
  triggerSearch: boolean;
  onSearchComplete: () => void;
};

const SearchPage: React.FC<SearchPageProps> = ({
  selectedTags,
  triggerSearch,
  onSearchComplete,
}) => {
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    if (triggerSearch) {
      handleSearch();
      onSearchComplete(); // 検索完了後にトリガーをリセットする
    }
  }, [triggerSearch]);

  const handleSearch = () => {
    console.log("検索が実行されました:", selectedTags);
    setQuestions(["検索結果1", "検索結果2", "検索結果3"]); // 仮の結果
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>検索ページ</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="キーワードを入力してください"
          className={styles.input}
        />
        <input
          type="text"
          placeholder="選択されたタグ"
          className={styles.input}
          value={selectedTags.join(", ")}
          readOnly
        />
        <button className={styles.button} onClick={handleSearch}>
          検索する
        </button>
      </div>
      <div className={styles.results}>
        {questions.map((q, i) => (
          <p key={i}>{q}</p>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;