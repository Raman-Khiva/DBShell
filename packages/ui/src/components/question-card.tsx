import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

interface Hint {
  text: string
}

interface QuestionCardProps {
  number?: number
  title: string
  description: string
  difficulty?: "easy" | "medium" | "hard"
  hints?: Hint[]
  expectedOutput?: string
  className?: string
}

const difficultyColor = {
  easy: "text-green-400 border-green-400/30 bg-green-400/10",
  medium: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  hard: "text-red-400 border-red-400/30 bg-red-400/10",
}

export const QuestionCard = ({
  number,
  title,
  description,
  difficulty = "easy",
  hints = [],
  expectedOutput,
  className,
}: QuestionCardProps) => {
  return (
    <Card className={`overflow-y-auto border-border ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold text-foreground">
            {number && (
              <span className="mr-2 text-muted-foreground">#{number}</span>
            )}
            {title}
          </CardTitle>
          <Badge
            variant="outline"
            className={`shrink-0 text-xs capitalize ${difficultyColor[difficulty]}`}
          >
            {difficulty}
          </Badge>
        </div>
        <CardDescription className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Expected output */}
        {expectedOutput && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Expected Output
            </p>
            <pre className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs text-foreground">
              {expectedOutput}
            </pre>
          </div>
        )}

        {/* Hints */}
        {hints.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Hints
            </p>
            <ul className="space-y-1">
              {hints.map((hint, i) => (
                <li key={i} className="flex gap-2 text-muted-foreground">
                  <span className="shrink-0 text-blue-400">→</span>
                  <span>{hint.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
