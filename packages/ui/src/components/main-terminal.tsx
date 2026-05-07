"use client"
import { Terminal, TerminalInput } from "@workspace/ui/components/terminal"

export const MainTerminal = () => {
  return (
    <Terminal className="min-h-40">
      <TerminalInput
        user="raman"
        host="iitpatna"
        path="~/project"
        onSubmit={(cmd) => console.log("ran:", cmd)}
        autoFocus
      />
    </Terminal>
  )
}
