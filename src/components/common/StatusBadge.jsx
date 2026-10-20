const MAP = {
  online: ['ออนไลน์', 'green'], offline: ['ออฟไลน์', 'gray'],
  waiting: ['รอผู้เชี่ยวชาญ', 'amber'], answered: ['ตอบแล้ว', 'green'], closed: ['ปิดแล้ว', 'gray'],
};
export default function StatusBadge({ type }) {
  const [label, color] = MAP[type] || [type, 'gray'];
  return <span className={`badge badge-${color}`}>{label}</span>;
}
