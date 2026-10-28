export default function SkeletonCard() {
  return (
    <div className="card glass skeleton">
      <div className="sk sk-img" />
      <div className="card-body">
        <div className="sk sk-line w40" />
        <div className="sk sk-line w80" />
        <div className="sk sk-line w60" />
      </div>
    </div>
  );
}
