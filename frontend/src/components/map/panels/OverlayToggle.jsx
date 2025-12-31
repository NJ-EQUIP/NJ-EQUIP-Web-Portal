export default function OverlayToggle({ checked, onChange }) {
  return (
    <div className="obc-toggle">
      <label>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        Overburdened Communities
      </label>
    </div>
  );
}
