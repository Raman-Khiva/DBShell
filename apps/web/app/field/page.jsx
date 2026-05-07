"use client"
import { LoginForm } from "@workspace/ui/components/login-form"

import { Terminal } from "@workspace/ui/components/terminal"
import { TerminalDemo } from "@workspace/ui/components/terminal-demo"
import { PortfolioTerminal } from "@workspace/ui/components/portfolio-terminal"
import { MainTerminal } from "@workspace/ui/components/main-terminal"

import axios from "axios"

const page = () => {
  const handleSubmit = async (query) => {
    try {
      const res = await axios.post("http://34.131.111.242:5000/api/execute", {
        query,
      })
      if (res.success) {
        console.log(res.message)
        console.log(res.data.result)
      } else {
        console.error("Unexpected error while exectuing query")
      }
    } catch (err) {
      console.error("query execution failed, Error:", err)
    }
  }

  return (
    <div>
      <p>This is feild page</p>
      <MainTerminal onSubmit={handleSubmit} />
    </div>
  )
}

export default page
