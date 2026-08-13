// In-memory session store, keyed by the user's WhatsApp number.
// Fine for an MVP / low volume. For production, swap this for a real DB
// (e.g. Supabase/Postgres or even a JSON file with periodic flush) so
// conversations survive a server restart. The interface below is small
// on purpose so swapping the storage later is a one-file change.

const sessions = new Map();

const MAX_HISTORY_TURNS = 12; // keep last N messages to control token cost

function getSession(userId) {
  if (!sessions.has(userId)) {
    sessions.set(userId, {
      userId,
      history: [], // [{role: 'user'|'assistant', content: '...'}]
      leadCaptured: false,
      createdAt: Date.now(),
    });
  }
  return sessions.get(userId);
}

function appendMessage(userId, role, content) {
  const session = getSession(userId);
  session.history.push({ role, content });
  if (session.history.length > MAX_HISTORY_TURNS) {
    session.history = session.history.slice(-MAX_HISTORY_TURNS);
  }
  return session;
}

module.exports = { getSession, appendMessage };
