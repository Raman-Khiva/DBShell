"use client"
import { Terminal, TerminalInput } from "@workspace/ui/components/terminal"

interface MainTerminalProps {
  onSubmit?: (query: string) => void
}

export const MainTerminal = ({ onSubmit }: MainTerminalProps) => {
  return (
    <Terminal className="min-h-40">
      <TerminalInput
        user="raman"
        host="iitpatna"
        path="~/project"
        onSubmit={(cmd) => {
          console.log("ran:", cmd)
          onSubmit?.(cmd)
        }}
        autoFocus
      />
    </Terminal>
  )
}
