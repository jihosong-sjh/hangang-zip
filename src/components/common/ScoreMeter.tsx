type ScoreMeterProps = {
  label: string;
  score: number;
};

export function ScoreMeter({ label, score }: ScoreMeterProps) {
  const normalizedScore = Math.max(0, Math.min(5, score));
  const width = `${(normalizedScore / 5) * 100}%`;

  return (
    <li className="score-meter">
      <div className="score-meter__header">
        <span>{label}</span>
        <strong>{normalizedScore}/5</strong>
      </div>
      <div className="score-meter__track" aria-hidden="true">
        <div className="score-meter__fill" style={{ width }} />
      </div>
    </li>
  );
}
