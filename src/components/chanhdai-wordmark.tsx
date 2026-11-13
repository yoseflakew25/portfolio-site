import { cn } from "@/lib/utils"

export function ChanhDaiWordmark(props: React.ComponentProps<"svg">) {
  const { className, ...rest } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 256"
      aria-hidden
      className={cn("h-8 w-auto", className)}
      {...rest}
    >
      <path fill="currentColor" d={JC_WORDMARK_PATH} />
    </svg>
  )
}

export function getWordmarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 256"><path fill="currentColor" d="${JC_WORDMARK_PATH}"/></svg>`
}

const JC_WORDMARK_PATH =
  "M192 0H96V160H192V0ZM192 160H0V256H192V160ZM64 128H0V160H64V128ZM448 0H224V96H448V0ZM320 96H224V160H320V96ZM448 160H224V256H448V160Z"
