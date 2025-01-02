import { Button } from "@/components/ui/button"

interface ErrorMessageProps {
  message: string
  reset?: () => void
}

export default function ErrorMessage({ message, reset }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
      <p className="text-muted-foreground mb-6">{message}</p>
      {reset && (
        <Button onClick={reset}>Try again</Button>
      )}
    </div>
  )
}

