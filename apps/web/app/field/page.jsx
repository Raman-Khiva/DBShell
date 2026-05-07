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
  const [users, setUsers] = useState([{ id: 1, name: "raman" }])

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
      console.error("Error while fetch users data from DB")
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
        console.log(res.data.result)
        fetchUsersFromDB()
      } else {
        console.error("Unexpected error while exectuing query")
      }
    } catch (err) {
      console.error("query execution failed, Error:", err)
    }
  }

  useEffect(() => {
    fetchUsersFromDB()
  }, [])

  return (
    <div className="w-screen">
      <p>This is feild page</p>
      <div className="flex justify-around">
        <MainTerminal className="flex-1" onSubmit={handleSubmit} />
        <TableDemo className="flex-1" users={users} />
      </div>
    </div>
  )
}

export default page
