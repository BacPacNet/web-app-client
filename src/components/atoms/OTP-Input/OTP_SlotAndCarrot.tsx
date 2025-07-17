import { cn } from '@/lib/utils'
import { SlotProps } from 'input-otp'

export function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative w-10 h-10 ',

        'flex items-center justify-center',
        'transition-all duration-300',
        'border-border border rounded-md',
        'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20 ',
        'outline outline-0 outline-accent-foreground/20',
        { 'outline-1  outline-accent-foreground/20': props.isActive }
      )}
    >
      <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20 ">{props.char ?? props.placeholderChar}</div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

export function FakeCaret() {
  return (
    <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
      <div className="w-px h-8 bg-neutral-600" />
    </div>
  )
}
