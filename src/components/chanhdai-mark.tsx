import { cn } from "@/lib/utils"

/**
 * Flat JC mark — same 64px slab construction as the original CD mark.
 */
export function ChanhDaiMark(props: React.ComponentProps<"svg">) {
  const { className, ...rest } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 512 256"
      aria-hidden
      className={cn(className)}
      {...rest}
    >
      <path fill="currentColor" d={JC_MARK_PATH} />
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 512 256"><path fill="currentColor" d="${JC_MARK_PATH}"/></svg>`
}

const JC_MARK_PATH =
  "M192 0H96V160H192V0ZM192 160H0V256H192V160ZM64 128H0V160H64V128ZM448 0H224V96H448V0ZM320 96H224V160H320V96ZM448 160H224V256H448V160Z"
