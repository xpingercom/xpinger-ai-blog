import type { Trend } from '@/lib/types';

export function TrendList({ trends }: { trends: Trend[] }) {
  return (
    <div className="card card-pad">
      {trends.map((trend) => (
        <div className="trend" key={trend.keyword}>
          <div>
            <div className="meta"><span className="tag">{trend.category}</span><span>{trend.velocity}</span></div>
            <h3 className="post-title" style={{ fontSize: 22 }}>{trend.keyword}</h3>
            <p className="subtle" style={{ margin: 0 }}>{trend.reason}</p>
          </div>
          <div className="score">{trend.score}</div>
        </div>
      ))}
    </div>
  );
}
