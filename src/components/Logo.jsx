export default function Logo({ big }) {
  return (
    <span className={`logo ${big ? 'logo-big' : ''}`}>
      <span className="logo-cloud">☁</span>
      <span className="logo-text">Sky<b>Mart</b></span>
    </span>
  );
}
