"use client"
import { LoginForm } from "@workspace/ui/components/login-form"

import { Terminal } from "@workspace/ui/components/terminal"
import { TableDemo } from "@workspace/ui/components/table-demo"
import { TerminalDemo } from "@workspace/ui/components/terminal-demo"
import { PortfolioTerminal } from "@workspace/ui/components/portfolio-terminal"
import { MainTerminal } from "@workspace/ui/components/main-terminal"
import { QuestionCard } from "@workspace/ui/components/question-card"

import axios from "axios"

import { useState, useEffect } from "react"

const QUESTION = {
  number: 1,
  title: "Fetch All Users",
  difficulty: "easy",
  description:
    "The database has a table called users with columns: id, name, email, and role. Write a SQL query to retrieve all records from the users table.",
  expectedOutput: ` id │ name  │ email                  │ role
────┼───────┼────────────────────────┼───────
  1 │ Raman │ raman@iitpatna.ac.in   │ admin
(1 row)`,
  hints: [
    { text: "Use the SELECT statement to fetch data." },
    { text: "The * wildcard selects all columns." },
  ],
}

const page = () => {
  const [users, setUsers] = useState()

  const [history, setHistory] = useState([])

  const fetchUsersFromDB = async () => {
    try {
      let res = await axios.post("http://34.131.111.242:5000/api/execute", {
        query: "SELECT * FROM users",
      })
      res = res.data

      console.log("Data fetched successfully")
      console.log("Users", res.data.result)
      setUsers(res.data.result)
    } catch (err) {
      console.error(
        err.response.data.message,
        " ERROR: ",
        err.response.data.error
      )
    }
  }
  const handleSubmit = async (query) => {
    try {
      let res = await axios.post("http://34.131.111.242:5000/api/execute", {
        query,
      })

      res = res.data
      if (res.success) {
        console.log(res.message)
        console.log("RES.DATA", res.data)
        fetchUsersFromDB()

        setHistory((prv) => [
          ...prv,
          {
            type: res.data.type.toLowerCase(),
            query: query,
            rows: res.data.result,
            changes: res.data.changes,
            lastInsertRowid: res.data.lastInsertRowid,
          },
        ])
      } else {
        console.error("Unexpected error while exectuing query")
      }
    } catch (err) {
      console.error(
        err.response.data.message,
        " ERROR: ",
        err.response.data.error
      )
      if (err.response.status < 5000) {
        setHistory((prv) => [
          ...prv,
          { type: "error", query, message: err.response.data.error },
        ])
      }
    }
  }

  useEffect(() => {
    fetchUsersFromDB()
  }, [])

  return (
    <main className="fixed w-screen px-10 py-8">
      <div className="grid w-full flex-1 grid-cols-2 gap-10">
        <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll bg-blue-200 p-1">
          <QuestionCard {...QUESTION} />
          <MainTerminal onSubmit={handleSubmit} history={history} />
        </div>
        <TableDemo className="flex-1" users={users} />
      </div>
    </main>
  )
}

export default page
