import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { TooltipProvider } from "@/components/ui/tooltip"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TooltipProvider>
      <Component {...pageProps} />
    </TooltipProvider>
  )
}

export default MyApp
