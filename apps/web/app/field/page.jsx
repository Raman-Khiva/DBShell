import { LoginForm } from "@workspace/ui/components/login-form"
import { Terminal } from "@workspace/ui/components/terminal"
import { TerminalDemo } from "@workspace/ui/components/terminal-demo"
import { PortfolioTerminal } from "@workspace/ui/components/portfolio-terminal"
import { MainTerminal } from "@workspace/ui/components/main-terminal"

const page = () => {
  return (
    <div>
      <p>This is feild page</p>
      <MainTerminal />
    </div>
  )
}

export default page
