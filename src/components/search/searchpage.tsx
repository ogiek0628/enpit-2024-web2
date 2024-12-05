import React, { useState } from 'react';
import { useRouter } from 'next/router'; // ページ遷移用
import styles from './searchpage.module.css';

const SearchPage: React.FC = () => {
    const router = useRouter();
    const [tag, setTag] = useState<string>(''); // 入力されたタグ
    const [status, setStatus] = useState<string | null>(null); // 解決状態
    const [questions, setQuestions] = useState<string[]>([]);

    // ページロード時にクエリパラメータから状態を復元
    React.useEffect(() => {
        const queryTag = router.query.tag as string;
        const queryStatus = router.query.status as string;

        if (queryTag) setTag(queryTag);
        if (queryStatus) setStatus(queryStatus);

        // クエリパラメータに基づいて質問データを取得
        if (queryTag || queryStatus) {
            fetch(`/api/search-questions?tag=${queryTag || ''}&status=${queryStatus || ''}`)
                .then((response) => response.json())
                .then((data) => setQuestions(data))
                .catch((error) => console.error('Failed to fetch questions:', error));
        }
    }, [router.query]);

    const handleSearch = () => {
        // クエリパラメータを設定してページ遷移
        const query = new URLSearchParams();
        if (tag) query.append('tag', tag);
        if (status) query.append('status', status);

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

            {/* 質問リスト */}
            <div className={styles.questionList}>
                {questions.length > 0 ? (
                    questions.map((question, index) => (
                        <div key={index} className={styles.questionItem}>
                            {question}
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