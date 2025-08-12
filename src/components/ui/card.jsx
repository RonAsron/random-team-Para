import * as React from "react"

export function Card({ className = "", ...props }) {
  return (
    <div
      className={
        "rounded-2xl border bg-white dark:bg-gray-950 text-black dark:text-white shadow-sm " +
        className
      }
      {...props}
    />
  )
}

export function CardHeader({ className = "", ...props }) {
  return <div className={"p-4 pb-0 " + className} {...props} />
}

export function CardTitle({ className = "", ...props }) {
  return <h3 className={"text-2xl font-bold leading-none tracking-tight " + className} {...props} />
}

export function CardContent({ className = "", ...props }) {
  return <div className={"p-4 pt-2 " + className} {...props} />
}
