import { cn } from "@/lib/utils"

export default function RainbowText({ text, className }: { text: string, className?: string }) {
    return (
        <span className={cn("animate-pulse-rainbow bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 bg-[length:200%_auto]", className)}>
            {text}
        </span>
    )
}