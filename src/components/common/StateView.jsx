// แสดงสถานะ กำลังโหลด / ผิดพลาด / ไม่พบข้อมูล
export default function StateView({ loading, error, empty, emptyText = 'ไม่พบข้อมูล', children }) {
  if (loading) return <div className="state" role="status">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="state state-error" role="alert">โหลดข้อมูลไม่สำเร็จ: {error.message || 'โปรดลองใหม่อีกครั้ง'}</div>;
  if (empty) return <div className="state">{emptyText}</div>;
  return children;
}
