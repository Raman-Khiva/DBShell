import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import logger from "./utils/logger.js"
const app = express()

app.use(cors({ origins: "*" }))
app.use(express.json())

app.get("/api/health", (req, res) => {
  logger.enter("health")
  res.status(200).json({
    success: true,
    health: 100,
    message: "Server health tested successfully ",
  })
})

app.use((res, req) => {
  logger.warn("User called route that doesn't exist")
  re.status(404).json({
    success: false,
    message: "Requested route doesn't exist",
    error: "NOT FOUND",
  })
})

const port = process.env.PORT || 4000

app.listen(port, "0.0.0.0", () => {
  logger.success(`Server started successfully at http://0.0.0.0:${port}`)
})
