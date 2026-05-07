import express from "express"

import cors from "cors"
import Database from "better-sqlite3"

const app = express()

app.use(express.json())

app.use(cors({ alloworigin: "*" }))

const db = new Database(":memory:")

app.get("/api/health", (req, res) =>
  res.status(200).json({
    success: true,
    message: "server is healthy",
    health: "100%",
  })
)

const getQueryType = (query) => {
  const keyword = query.trim().split(/\s+/)[0].toUpperCase()
  return keyword
}
app.post("/api/execute", (req, res) => {
  try {
    const { query } = req.body

    const type = getQueryType(query)

    let result,
      meta = null

    const stmt = db.prepare(query)

    if (stmt.reader) {
      result = stmt.all()
    } else {
      meta = stmt.run()
    }

    console.log(`query "${type}" executed successfully,given are results`)
    console.log("RESULT:", result)

    res.status(200).json({
      success: true,
      message: "Query executed successfully, find result in data.result",
      data: {
        type: type,
        result: result,
        changes: meta?.changes | null,
        lastInsertRowid: meta?.lastInsertRowid | null,
      },
    })
  } catch (err) {
    if (err.code?.startsWith("SQLITE")) {
      console.error("SQLITE ERROR : ", err.message)
      res.status(400).json({
        success: false,
        message: "Database error while executing query",
        error: err.message,
      })
    } else {
      console.error("Internal Server Error while executing query")
      res.status(500).json({
        success: false,
        message: "Internal server error while executing query",
        error: err.message,
      })
    }
  }
})

app.listen(5000, "0.0.0.0", () => {
  console.log("server started successfully and listening at port 5000")
})
