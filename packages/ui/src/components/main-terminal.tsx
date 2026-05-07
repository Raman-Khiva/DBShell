//"use client"
//import { Terminal, TerminalInput } from "@workspace/ui/components/terminal"
//
//interface MainTerminalProps {
//  onSubmit?: (query: string) => void
//}
//
//export const MainTerminal = ({ onSubmit }: MainTerminalProps) => {
//  return (
//    <Terminal className="min-h-40">
//      <TerminalInput
//        user="raman"
//        host="iitpatna"
//        path="~/project"
//        onSubmit={(cmd) => {
//          console.log("ran:", cmd)
//          onSubmit?.(cmd)
//        }}
//        autoFocus
//      />
//    </Terminal>
//  )
//}
//
//"use client"

import { useState } from "react"
import {
  Terminal,
  TerminalInput,
  QueryEcho,
  SelectResult,
  WriteResult,
  QueryError,
} from "@workspace/ui/components/terminal"

// ─── Types ────────────────────────────────────────────────────────────────────

type HistoryEntry =
  | { type: "select"; query: string; rows: Record<string, unknown>[] }
  | { type: "insert"; query: string; changes: number; lastInsertRowid: number }
  | { type: "update"; query: string; changes: number; lastInsertRowid?: number }
  | { type: "delete"; query: string; changes: number; lastInsertRowid?: number }
  | {
      type: "create"
      query: string
      changes?: number
      lastInsertRowid?: number
    }
  | { type: "error"; query: string; message: string }

// ─── Dummy history ────────────────────────────────────────────────────────────

const DUMMY_HISTORY: HistoryEntry[] = [
  {
    type: "create",
    query:
      "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT, role TEXT)",
  },
  {
    type: "insert",
    query:
      "INSERT INTO users (name, email, role) VALUES ('Raman', 'raman@iitpatna.ac.in', 'admin')",
    changes: 1,
    lastInsertRowid: 1,
  },
  {
    type: "insert",
    query:
      "INSERT INTO users (name, email, role) VALUES ('Ankit', 'ankit@iitpatna.ac.in', 'user')",
    changes: 1,
    lastInsertRowid: 2,
  },
  {
    type: "select",
    query: "SELECT * FROM users",
    rows: [
      { id: 1, name: "Raman", email: "raman@iitpatna.ac.in", role: "admin" },
      { id: 2, name: "Ankit", email: "ankit@iitpatna.ac.in", role: "user" },
    ],
  },
  {
    type: "update",
    query: "UPDATE users SET role = 'moderator' WHERE id = 2",
    changes: 1,
  },
  {
    type: "select",
    query: "SELECT id, name, role FROM users WHERE role != 'admin'",
    rows: [{ id: 2, name: "Ankit", role: "moderator" }],
  },
  {
    type: "error",
    query: "SELECT * FROM orders",
    message: "no such table: orders",
  },
  {
    type: "delete",
    query: "DELETE FROM users WHERE id = 2",
    changes: 1,
  },
  {
    type: "select",
    query: "SELECT * FROM users",
    rows: [
      { id: 1, name: "Raman", email: "raman@iitpatna.ac.in", role: "admin" },
    ],
  },
]

// ─── Helper to render a single history entry's output ─────────────────────────

const EntryOutput = ({ entry }: { entry: HistoryEntry }) => {
  switch (entry.type) {
    case "select":
      return <SelectResult rows={entry.rows} />
    case "insert":
      return (
        <WriteResult
          operation="INSERT"
          changes={entry.changes}
          lastInsertRowid={entry.lastInsertRowid}
        />
      )
    case "update":
      return <WriteResult operation="UPDATE" changes={entry.changes} />
    case "delete":
      return <WriteResult operation="DELETE" changes={entry.changes} />
    case "create":
      return <WriteResult operation="CREATE" changes={0} />
    case "error":
      return <QueryError message={entry.message} />
  }
}

// ─── MainTerminal ─────────────────────────────────────────────────────────────

interface MainTerminalProps {
  onSubmit?: (cmd: string) => void
  history: HistoryEntry[]
}

export const MainTerminal = ({ onSubmit, history }: MainTerminalProps) => {
  console.warn("MainTerminal rendered successfully")
  console.log("history recived to MainTerminal", history)
  const handleSubmit = (cmd: string) => {
    onSubmit?.(cmd)
  }

  return (
    <Terminal className="min-w-3xl flex-1" sequence={false}>
      {history?.map((entry, i) => (
        <div key={i} className="mb-2 grid gap-y-0.5">
          <QueryEcho
            query={entry.query}
            user="raman"
            host="iitpatna"
            path="~/project"
          />
          <EntryOutput entry={entry} />
        </div>
      ))}
      <TerminalInput
        user="raman"
        host="iitpatna"
        path="~/project"
        onSubmit={handleSubmit}
        autoFocus
      />
    </Terminal>
  )
}
