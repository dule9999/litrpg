import { loadGameState, getUnlockedChapters } from '@utils';
import './Diary.css';

export default function DiaryPage() {
  const gameState = loadGameState();
  const chapters = getUnlockedChapters(gameState);

  return (
    <div className="diary">
      <h2 className="diary-title">Diary</h2>

      {chapters.length === 0 ? (
        <p className="diary-empty">
          Your diary is empty. Continue your journey to record your experiences.
        </p>
      ) : (
        <div className="diary-chapters">
          {chapters.map((chapter, index) => (
            <details
              key={chapter.chapter}
              className="diary-chapter"
              open={index === chapters.length - 1}
            >
              <summary className="diary-chapter-title">{chapter.title}</summary>
              <div className="diary-chapter-content">
                {chapter.entries.map((entry) => (
                  <p key={entry.id} className="diary-entry">{entry.text}</p>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
