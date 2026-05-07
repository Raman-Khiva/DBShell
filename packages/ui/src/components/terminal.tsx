"use client"

import {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type RefAttributes,
} from "react"
import {
  motion,
  useInView,
  type DOMMotionComponents,
  type HTMLMotionProps,
  type MotionProps,
} from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

interface SequenceContextValue {
  completeItem: (index: number) => void
  activeIndex: number
  sequenceStarted: boolean
}

const SequenceContext = createContext<SequenceContextValue | null>(null)

const useSequence = () => useContext(SequenceContext)

const ItemIndexContext = createContext<number | null>(null)
const useItemIndex = () => useContext(ItemIndexContext)

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>
type TerminalTypingMotionComponent = ComponentType<
  Omit<HTMLMotionProps<"span">, "ref"> & RefAttributes<HTMLElement>
>

interface AnimatedSpanProps extends MotionProps {
  children: React.ReactNode
  delay?: number
  className?: string
  startOnView?: boolean
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectResultProps {
  rows: Record<string, unknown>[]
  className?: string
}

interface WriteResultProps {
  changes: number
  lastInsertRowid?: number | bigint
  operation?: "INSERT" | "UPDATE" | "DELETE" | "CREATE" | "DROP" | string
  className?: string
}

interface QueryErrorProps {
  message: string
  className?: string
}

interface QueryEchoProps {
  db_name: string
  query: string
  user?: string
  host?: string
  path?: string
  className?: string
}

// ─── QueryEcho — repeats the entered command like a real shell ────────────────

export const QueryEcho = ({
  db_name = "dbshell",
  query,
  user = "user",
  host = "host",
  path = "~",
  className,
}: QueryEchoProps) => (
  <div
    className={cn(
      "flex items-center gap-x-1.5 text-sm font-normal tracking-tight",
      className
    )}
  >
    <span className="shrink-0 select-none">
      <span className="text-green-500">{`${db_name}=#`}</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-blue-400">{path}</span>
      <span className="text-muted-foreground">$</span>
    </span>
    <span className="text-foreground">{query}</span>
  </div>
)

// ─── SelectResult — tabular output like psql / sqlite3 ───────────────────────

export const SelectResult = ({ rows, className }: SelectResultProps) => {
  if (!rows || rows.length === 0) {
    return (
      <div className={cn("pl-1 text-sm text-muted-foreground", className)}>
        (0 rows)
      </div>
    )
  }

  const cols = Object.keys(rows[0])

  // Calculate column widths (max of header and all values)
  const colWidths = cols.map((col) =>
    Math.max(col.length, ...rows.map((r) => String(r[col] ?? "").length))
  )

  const pad = (str: string, len: number) => str.padEnd(len)
  const separator = colWidths.map((w) => "─".repeat(w + 2)).join("┼")
  const header = cols.map((col, i) => ` ${pad(col, colWidths[i])} `).join("│")
  const divider = `─${colWidths.map((w) => "─".repeat(w)).join("─┬─")}─`

  return (
    <div className={cn("overflow-x-auto font-mono text-sm", className)}>
      {/* Header */}
      <div className="text-blue-400">{header}</div>
      {/* Divider */}
      <div className="text-muted-foreground">{"─" + separator + "─"}</div>
      {/* Rows */}
      {rows.map((row, ri) => (
        <div key={ri} className="text-foreground">
          {cols
            .map((col, ci) => ` ${pad(String(row[col] ?? ""), colWidths[ci])} `)
            .join("│")}
        </div>
      ))}
      {/* Row count */}
      <div className="mt-1 text-muted-foreground">
        ({rows.length} {rows.length === 1 ? "row" : "rows"})
      </div>
    </div>
  )
}

// ─── WriteResult — for INSERT / UPDATE / DELETE / CREATE / DROP ───────────────

export const WriteResult = ({
  changes,
  lastInsertRowid,
  operation = "QUERY",
  className,
}: WriteResultProps) => {
  const op = operation.toUpperCase()

  return (
    <div className={cn("space-y-0.5 font-mono text-sm", className)}>
      {op === "INSERT" && (
        <div className="text-green-400">
          INSERT 0 {lastInsertRowid ?? changes}
        </div>
      )}
      {op === "UPDATE" && (
        <div className="text-yellow-400">UPDATE {changes}</div>
      )}
      {op === "DELETE" && <div className="text-red-400">DELETE {changes}</div>}
      {(op === "CREATE" || op === "DROP") && (
        <div className="text-green-400">{op} TABLE</div>
      )}
      {!["INSERT", "UPDATE", "DELETE", "CREATE", "DROP"].includes(op) && (
        <div className="text-green-400">
          {op} OK — {changes} {changes === 1 ? "row" : "rows"} affected
        </div>
      )}
    </div>
  )
}

// ─── QueryError — red error block like sqlite3 / psql errors ─────────────────

export const QueryError = ({ message, className }: QueryErrorProps) => (
  <div className={cn("font-mono text-sm", className)}>
    <span className="text-red-500">ERROR: </span>
    <span className="text-red-400">{message}</span>
  </div>
)

export const AnimatedSpan = ({
  children,
  delay = 0,
  className,
  startOnView = false,
  ...props
}: AnimatedSpanProps) => {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const sequence = useSequence()
  const itemIndex = useItemIndex()
  const [hasStarted, setHasStarted] = useState(false)
  useEffect(() => {
    if (!sequence || itemIndex === null) return
    if (!sequence.sequenceStarted) return
    if (hasStarted) return
    if (sequence.activeIndex === itemIndex) {
      setHasStarted(true)
    }
  }, [sequence, hasStarted, itemIndex])

  const shouldAnimate = sequence ? hasStarted : startOnView ? isInView : true

  return (
    <motion.div
      ref={elementRef}
      initial={{ opacity: 0, y: -5 }}
      animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: 0.3, delay: sequence ? 0 : delay / 1000 }}
      className={cn("grid text-sm font-normal tracking-tight", className)}
      onAnimationComplete={() => {
        if (!sequence) return
        if (itemIndex === null) return
        sequence.completeItem(itemIndex)
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface TypingAnimationProps extends Omit<MotionProps, "children"> {
  children: string
  className?: string
  duration?: number
  delay?: number
  as?: MotionElementType
  startOnView?: boolean
}

export const TypingAnimation = ({
  children,
  className,
  duration = 60,
  delay = 0,
  as: Component = "span",
  startOnView = true,
  ...props
}: TypingAnimationProps) => {
  if (typeof children !== "string") {
    throw new Error("TypingAnimation: children must be a string. Received:")
  }

  const MotionComponent = motionElements[
    Component
  ] as TerminalTypingMotionComponent

  const [displayedText, setDisplayedText] = useState<string>("")
  const [started, setStarted] = useState(false)
  const elementRef = useRef<HTMLElement | null>(null)
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const sequence = useSequence()
  const itemIndex = useItemIndex()
  const hasSequence = sequence !== null
  const sequenceStarted = sequence?.sequenceStarted ?? false
  const sequenceActiveIndex = sequence?.activeIndex ?? null
  const sequenceCompleteItemRef = useRef<
    SequenceContextValue["completeItem"] | null
  >(null)
  const sequenceItemIndexRef = useRef<number | null>(null)

  useEffect(() => {
    sequenceCompleteItemRef.current = sequence?.completeItem ?? null
    sequenceItemIndexRef.current = itemIndex
  }, [sequence?.completeItem, itemIndex])

  useEffect(() => {
    let startTimeout: ReturnType<typeof setTimeout> | null = null

    if (hasSequence && itemIndex !== null) {
      if (sequenceStarted && !started && sequenceActiveIndex === itemIndex) {
        setStarted(true)
      }
    } else if (!startOnView || isInView) {
      startTimeout = setTimeout(() => setStarted(true), delay)
    }

    return () => {
      if (startTimeout !== null) {
        clearTimeout(startTimeout)
      }
    }
  }, [
    delay,
    startOnView,
    isInView,
    started,
    hasSequence,
    sequenceActiveIndex,
    sequenceStarted,
    itemIndex,
  ])

  useEffect(() => {
    let typingEffect: ReturnType<typeof setInterval> | null = null

    if (started) {
      let i = 0
      typingEffect = setInterval(() => {
        if (i < children.length) {
          setDisplayedText(children.substring(0, i + 1))
          i++
        } else {
          if (typingEffect !== null) {
            clearInterval(typingEffect)
          }
          const completeItem = sequenceCompleteItemRef.current
          const currentItemIndex = sequenceItemIndexRef.current
          if (completeItem && currentItemIndex !== null) {
            completeItem(currentItemIndex)
          }
        }
      }, duration)
    }

    return () => {
      if (typingEffect !== null) {
        clearInterval(typingEffect)
      }
    }
  }, [children, duration, started])

  return (
    <MotionComponent
      ref={elementRef}
      className={cn("text-sm font-normal tracking-tight", className)}
      {...props}
    >
      {displayedText}
    </MotionComponent>
  )
}

interface TerminalProps {
  children: React.ReactNode
  className?: string
  sequence?: boolean
  startOnView?: boolean
}

interface TerminalInputProps {
  db_name: string
  user?: string
  host?: string
  path?: string
  onSubmit?: (value: string) => void
  className?: string
  autoFocus?: boolean
  disabled?: boolean
}

export const TerminalInput = ({
  db_name = "dbshell",
  user = "user",
  host = "host",
  path = "~",
  onSubmit,
  className,
  autoFocus = false,
  disabled = false,
}: TerminalInputProps) => {
  const [value, setValue] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSubmit?.(value.trim())
      setValue("")
    }
  }
  const elementRef = useRef<HTMLElement | null>(null)

  return (
    <motion.div
      ref={elementRef}
      className={cn(
        "flex items-center gap-x-1.5 text-sm font-normal tracking-tight",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Prompt label */}
      <span className="shrink-0 select-none">
        <span className="text-green-500">{`${db_name}=#`}</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-blue-400">{path}</span>
        <span className="text-muted-foreground">$</span>
      </span>

      {/* Input area */}
      <div className="relative flex flex-1 items-center">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className={cn(
            "w-full bg-transparent caret-transparent outline-none",
            "text-sm font-normal tracking-tight",
            disabled && "cursor-not-allowed opacity-50"
          )}
        />

        {/* Custom blinking cursor — replaces native caret */}
        <motion.span
          animate={{ opacity: isFocused ? [1, 0, 1] : 0 }}
          transition={
            isFocused ? { duration: 1, repeat: Infinity } : { duration: 0 }
          }
          className="pointer-events-none absolute select-none"
          style={{
            // Position cursor after the typed text
            left: `${value.length}ch`,
          }}
          aria-hidden
        >
          ▌
        </motion.span>
      </div>
    </motion.div>
  )
}

export const Terminal = ({
  children,
  className,
  sequence = true,
  startOnView = true,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(containerRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  })

  const [activeIndex, setActiveIndex] = useState(0)
  const sequenceHasStarted = sequence ? !startOnView || isInView : false

  const contextValue = useMemo<SequenceContextValue | null>(() => {
    if (!sequence) return null
    return {
      completeItem: (index: number) => {
        setActiveIndex((current) => (index === current ? current + 1 : current))
      },
      activeIndex,
      sequenceStarted: sequenceHasStarted,
    }
  }, [sequence, activeIndex, sequenceHasStarted])

  const wrappedChildren = useMemo(() => {
    if (!sequence) return children
    const array = Children.toArray(children)
    return array.map((child, index) => (
      <ItemIndexContext.Provider key={index} value={index}>
        {child as React.ReactNode}
      </ItemIndexContext.Provider>
    ))
  }, [children, sequence])

  const content = (
    <div
      ref={containerRef}
      className={cn(
        "z-0 w-full max-w-3xl rounded-xl border border-border bg-background pb-3",
        className
      )}
    >
      <div className="flex flex-col gap-y-2 border-b border-border p-4">
        <div className="flex flex-row gap-x-2">
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <pre className="hide-scrollbar max-h-[60vh] min-h-[40vh] overflow-auto p-4">
        <code className="grid gap-y-1">{wrappedChildren}</code>
      </pre>
    </div>
  )

  if (!sequence) return content

  return (
    <SequenceContext.Provider value={contextValue}>
      {content}
    </SequenceContext.Provider>
  )
}
