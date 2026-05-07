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

app.post("/api/execute", (req, res) => {
  try {
    const { query } = req.body

    let result

    const stmt = db.prepare(query)

    if (stmt.reader) {
      result = stmt.all()
    } else {
      result = stmt.run()
    }

    console.log("query executed successfully,given are results")
    console.log("RESULT:", result)

    res.status(200).json({
      success: true,
      message: "Query exected, find result in data.result",
      data: {
        result: result,
      },
    })
  } catch (err) {
    console.error(
      "error while executing query from /api/execute, ERROR:",
      err.message
    )
    res.status(500).json({
      success: false,
      message: "error while executing query",
      error: err.message,
    })
  }
})

app.listen(5000, "0.0.0.0", () => {
  console.log("server started successfully and listening at port 5000")
})
