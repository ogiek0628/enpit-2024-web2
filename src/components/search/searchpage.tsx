import React, { useState, useEffect } from 'react';
import { useTagContext } from './TagContext'; // コンテキストをインポート
import styles from './searchpage.module.css';

const SearchPage: React.FC = () => {
    const { selectedTags, triggerSearch, setTriggerSearch } = useTagContext();
    const [status, setStatus] = useState<string | null>(null);
    const [questions, setQuestions] = useState<string[]>([]);

    useEffect(() => {
        if (triggerSearch) {
            handleSearch();
            setTriggerSearch(false); // トリガーをリセット
        }
    }, [triggerSearch]);

    const handleSearch = () => {
        console.log('検索が実行されました:', { status, selectedTags });
        // 実際の検索処理をここに実装
        setQuestions([
            '検索結果の質問1',
            '検索結果の質問2',
            '検索結果の質問3',
        ]);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>OS課題相談広場</h1>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="キーワードを入力してください（任意）"
                    className={styles.input}
                />
                <input
                    type="text"
                    placeholder="タグを選択してください（任意）"
                    className={styles.input}
                    value={selectedTags.join(', ')} // コンテキストからタグを取得
                    readOnly
                />
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
                <button className={styles.button} onClick={handleSearch}>検索する</button>
            </div>
            <div className={styles.questionList}>
                {questions.map((question, index) => (
                    <div key={index} className={styles.questionItem}>
                        {question}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchPage;