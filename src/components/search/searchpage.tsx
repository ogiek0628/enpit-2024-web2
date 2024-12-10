"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./searchpage.module.css";

const SearchPage: React.FC = () => {
    const router = useRouter();
    const [tag, setTag] = useState<string>(""); // タグ
    const [status, setStatus] = useState<string | null>(null); // 解決状態
    const [questions, setQuestions] = useState<any[]>([]); // 質問データ
    const [isLoading, setIsLoading] = useState<boolean>(true); // ローディング状態
    const [error, setError] = useState<string | null>(null); // エラー

    // クエリパラメータを取得して状態を更新し、検索を実行
    useEffect(() => {
        const queryTag = router.query.tag as string;
        const queryStatus = router.query.status as string;

        // タグまたは解決状態がクエリに含まれる場合、それをセット
        setTag(queryTag || ""); // タグがない場合は空文字列
        setStatus(queryStatus || null);

        // クエリパラメータに基づいて検索を実行
        if (queryTag || queryStatus) {
            fetchQuestions(queryTag || "", queryStatus || null);
        }
    }, [router.query]); // クエリが変更されるたびに実行

    // 質問データを取得する関数
    const fetchQuestions = async (queryTag: string, queryStatus: string | null) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `/api/search-questions?tag=${queryTag}&status=${queryStatus || ""}`
            );
            if (!response.ok) {
                throw new Error("データの取得に失敗しました。");
            }
            const data = await response.json();
            setQuestions(data); // 質問データをセット
        } catch (err) {
            setError(err instanceof Error ? err.message : "不明なエラーが発生しました。");
        } finally {
            setIsLoading(false);
        }
    };

    // 検索ボタンを押したときの処理
    const handleSearch = () => {
        const query = new URLSearchParams();
        if (tag) query.append("tag", tag);
        if (status) query.append("status", status);

        // URLを更新して状態を反映
        router.push(`/search_question?${query.toString()}`);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>OS課題相談広場</h1>
            <div className={styles.searchContainer}>
                {/* タグ入力 */}
                <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="タグを選択してください（任意）"
                    className={styles.input}
                />

                {/* 解決状態選択 */}
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="status"
                            value="resolved"
                            checked={status === "resolved"}
                            onChange={() => setStatus("resolved")}
                        />{" "}
                        解決済
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="status"
                            value="unresolved"
                            checked={status === "unresolved"}
                            onChange={() => setStatus("unresolved")}
                        />{" "}
                        未解決
                    </label>
                </div>

                {/* 検索ボタン */}
                <button className={styles.button} onClick={handleSearch}>
                    検索する
                </button>
            </div>

            {/* 検索結果表示 */}
            <div className={styles.resultsContainer}>
                {isLoading ? (
                    <p>検索中...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : questions.length > 0 ? (
                    questions.map((question) => (
                        <div key={question.id} className={styles.questionItem}>
                            <h2>{question.title}</h2>
                            <p>{question.content}</p>
                            <div className={styles.tagContainer}>
                                {question.tags.map((tag: any) => (
                                    <span key={tag.id} className={styles.tag}>
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>該当する質問が見つかりません。</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;