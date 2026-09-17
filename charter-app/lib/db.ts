/**
 * Charter App — SQLite user + session store.
 * Uses better-sqlite3 (same runtime as Next.js).
 */

import Database from "better-sqlite3";
import path from "path";
import { cookies } from "next/headers";

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "..", "charter.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db || !_db.open) {
    if (_db && !_db.open) {
      try { _db.close(); } catch { /* ignore — already closed */ }
    }
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("busy_timeout = 10000");
    _db.pragma("foreign_keys = ON");
    _db.pragma("synchronous = NORMAL");
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'free',
      role TEXT NOT NULL DEFAULT 'user',
      status TEXT NOT NULL DEFAULT 'active',
      company TEXT,
      created_by_invite_token TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS extractions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      project_name TEXT NOT NULL DEFAULT 'Nuevo proyecto',
      status TEXT NOT NULL DEFAULT 'pending',
      offer_text TEXT NOT NULL,
      offer_summary TEXT,
      start_date TEXT,
      end_date TEXT,
      milestones TEXT,
      tasks TEXT,
      specs TEXT,
      deliverables TEXT,
      stakeholders TEXT,
      total_budget TEXT,
      risks TEXT,
      assumptions TEXT,
      constraints TEXT,
      technical_specs TEXT,
      wbs_output TEXT,
      field_confidence TEXT,
      pdf_metadata TEXT,
      stage TEXT,
      confidence_section TEXT,
      confidence_overall REAL,
      improvement_tips TEXT,
      improvement_reasoning TEXT,
      improvement_generated_at TEXT,
      job_id TEXT,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );

    CREATE TABLE IF NOT EXISTS invites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      invited_by_user_id INTEGER REFERENCES users(id),
      expires_at TEXT NOT NULL,
      used_at TEXT,
      used_by_user_id INTEGER REFERENCES users(id),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_invites_token ON invites(token);
    CREATE INDEX IF NOT EXISTS idx_extractions_user ON extractions(user_id);
  `);

  // Bootstrap: auto-promote INITIAL_ADMIN_EMAIL user to admin role on first deploy
  const initialAdmin = process.env.INITIAL_ADMIN_EMAIL;
  if (initialAdmin) {
    try {
      db.prepare("UPDATE users SET role = 'admin' WHERE email = ? AND role = 'user'").run(initialAdmin);
    } catch {
      // ignore — user may not exist yet
    }
  }
}

export type User = {
  id: number;
  email: string;
  password_hash: string;
  plan: string;
  role: string;
  status: string;
  company: string | null;
  created_by_invite_token: string | null;
  created_at: string;
};
export type Session = { id: string; user_id: number; expires_at: string };
export type Extraction = {
  id: number; user_id: number; project_name: string; status: string;
  offer_text: string; offer_summary: string | null; start_date: string | null;
  end_date: string | null; milestones: string | null; tasks: string | null;
  specs: string | null; deliverables: string | null; stakeholders: string | null;
  total_budget: string | null; risks: string | null; assumptions: string | null;
  constraints: string | null; technical_specs: string | null;
  wbs_output: string | null;
  field_confidence: string | null;
  pdf_metadata: string | null;
  stage: string | null;
  confidence_section: string | null;
  confidence_overall: number | null;
  improvement_tips: string | null;
  improvement_reasoning: string | null;
  improvement_generated_at: string | null;
  error: string | null;
  job_id: string | null;
  created_at: string;
  updated_at: string | null;
};
export type Invite = {
  id: number;
  token: string;
  email: string;
  role: string;
  invited_by_user_id: number | null;
  expires_at: string;
  used_at: string | null;
  used_by_user_id: number | null;
  created_at: string;
};

// ── Auth helpers ──────────────────────────────────────────────────────────────

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;
  if (!sessionId) return null;

  const db = getDb();
  const session = db.prepare(
    "SELECT * FROM sessions WHERE id = ? AND expires_at > datetime('now')"
  ).get(sessionId) as Session | undefined;
  if (!session) return null;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(session.user_id) as User | undefined;
  return user ?? null;
}

export function createSession(userId: number): string {
  const db = getDb();
  const id = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  db.prepare(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)"
  ).run(id, userId, expiresAt);
  return id;
}

export function deleteSession(sessionId: string) {
  getDb().prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);
}
