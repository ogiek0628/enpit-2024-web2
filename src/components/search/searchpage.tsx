import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './searchpage.module.css';

const SearchPage: React.FC = () => {
    const router = useRouter();
    const [tag, setTag] = useState<string>(''); // タグ
    const [status, setStatus] = useState<string | null>(null); // 解決状態
    const [questions, setQuestions] = useState<any[]>([]); // 質問データ

    // URLクエリパラメータから状態を復元
    useEffect(() => {
        const queryTag = router.query.tag as string;
        const queryStatus = router.query.status as string;

        if (queryTag) setTag(queryTag);
        if (queryStatus) setStatus(queryStatus);

        // データ取得
        if (queryTag || queryStatus) {
            fetch(`/api/search-questions?tag=${queryTag || ''}&status=${queryStatus || ''}`)
                .then((response) => response.json())
                .then((data) => setQuestions(data))
                .catch((error) => console.error('Failed to fetch questions:', error));
        }
    }, [router.query]); // クエリが変更されるたびに再取得

    // 検索ボタンを押したときにURLを更新
    const handleSearch = () => {
        const query = new URLSearchParams();
        if (tag) query.append('tag', tag);
        if (status) query.append('status', status);

        // URLを更新して状態を反映
        router.push(`/search_question?${query.toString()}`, undefined, { shallow: true });
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
                            checked={status === 'resolved'}
                            onChange={() => setStatus('resolved')}
                        /> 解決済
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="status"
                            value="unresolved"
                            checked={status === 'unresolved'}
                            onChange={() => setStatus('unresolved')}
                        /> 未解決
                    </label>
                </div>

                {/* 検索ボタン */}
                <button className={styles.button} onClick={handleSearch}>
                    検索する
                </button>
            </div>

            {/* 検索結果表示 */}
            <div className={styles.questionList}>
                {questions.length > 0 ? (
                    questions.map((question) => (
                        <div key={question.id} className={styles.questionItem}>
                            <h2>{question.title}</h2>
                            <p>{question.content}</p>
                            <div>
                                {question.tags.map((tag: any) => (
                                    <span key={tag.id} className={styles.tag}>{tag.name}</span>
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