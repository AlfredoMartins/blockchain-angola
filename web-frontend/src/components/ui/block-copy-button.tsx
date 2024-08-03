"use client"

import * as React from "react"
import { CheckIcon, ClipboardIcon } from "lucide-react"

import { Event, trackEvent } from "./events"
import { Button, ButtonProps } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"

export function BlockCopyButton({
    event,
    name,
    code,
    ...props
}: {
    event: Event["name"]
    name: string
    code: string
} & ButtonProps) {
    const [hasCopied, setHasCopied] = React.useState(false)

    React.useEffect(() => {
        setTimeout(() => {
            setHasCopied(false)
        }, 2000)
    }, [hasCopied])

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7 rounded-[5px] p-2 [&_svg]:size-3.5"
                        onClick={() => {
                            navigator.clipboard.writeText(code)
                            trackEvent({
                                name: event,
                                properties: {
                                    name,
                                },
                            })
                            setHasCopied(true)
                        }}
                        {...props}
                    >
                        <span className="sr-only">Copy</span>
                        {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Copy code</TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}