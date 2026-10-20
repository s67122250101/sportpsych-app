import { ref, push, set, update } from 'firebase/database';
import { db } from './firebaseConfig';

export function notify(userId, type, message) {
  return push(ref(db, `notifications/${userId}`), { type, message, is_read: false, created_at: Date.now() });
}

export function sendMessage(sessionId, senderId, content) {
  return push(ref(db, `chat_messages/${sessionId}`), {
    sender_id: senderId, content, sent_at: Date.now(), is_read: false,
  });
}

// สร้างคำถามใหม่ + ห้องแชท แล้วคืนค่า sessionId
export async function createQuestion({ athleteId, categoryId, subTopic, content }) {
  const sessionId = push(ref(db, 'chat_messages')).key;
  await set(push(ref(db, 'questions')), {
    athlete_id: athleteId, category_id: categoryId, sub_topic: subTopic || '',
    content, status: 'waiting', created_at: Date.now(), assigned_expert_id: '', session_id: sessionId,
  });
  await sendMessage(sessionId, athleteId, content);
  return sessionId;
}

export async function acceptQuestion(questionId, question, expertId) {
  await update(ref(db, `questions/${questionId}`), { assigned_expert_id: expertId });
  await notify(question.athlete_id, 'accepted', 'ผู้เชี่ยวชาญรับคำถามของคุณแล้ว');
}

// บันทึกคำตอบสรุปและปิดคำถาม
export async function answerQuestion(questionId, question, expertId, content) {
  await set(push(ref(db, 'answers')), {
    question_id: questionId, expert_id: expertId, content, answered_at: Date.now(),
  });
  await update(ref(db, `questions/${questionId}`), { status: 'answered' });
  await notify(question.athlete_id, 'new_answer', 'ผู้เชี่ยวชาญตอบคำถามของคุณแล้ว');
}

export function submitRating({ answerId, athleteId, expertId, score, comment }) {
  return set(push(ref(db, 'ratings')), {
    answer_id: answerId, athlete_id: athleteId, expert_id: expertId, score, comment: comment || '',
  });
}

export function markAllRead(userId, notifications) {
  const updates = {};
  Object.keys(notifications || {}).forEach((k) => { updates[`${k}/is_read`] = true; });
  return update(ref(db, `notifications/${userId}`), updates);
}
