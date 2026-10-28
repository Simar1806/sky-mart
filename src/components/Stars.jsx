import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function Stars({ value = 0 }) {
  return (
    <span className="stars" title={value.toFixed(1)}>
      {[1, 2, 3, 4, 5].map((n) =>
        value >= n ? <FaStar key={n} /> : value >= n - 0.5 ? <FaStarHalfAlt key={n} /> : <FaRegStar key={n} />
      )}
      <small>{value.toFixed(1)}</small>
    </span>
  );
}
