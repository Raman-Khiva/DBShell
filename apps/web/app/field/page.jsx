"use client"
import { LoginForm } from "@workspace/ui/components/login-form"

import { Terminal } from "@workspace/ui/components/terminal"
import { TableDemo } from "@workspace/ui/components/table-demo"
import { TerminalDemo } from "@workspace/ui/components/terminal-demo"
import { PortfolioTerminal } from "@workspace/ui/components/portfolio-terminal"
import { MainTerminal } from "@workspace/ui/components/main-terminal"

import axios from "axios"

import { useState, useEffect } from "react"

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
    <div className="w-screen px-10 py-8">
      <div className="flex justify-around gap-10">
        <MainTerminal
          className="flex-1"
          onSubmit={handleSubmit}
          history={history}
        />
        <TableDemo className="flex-1" users={users} />
      </div>
    </div>
  )
}

export default page
