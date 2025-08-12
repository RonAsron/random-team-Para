import * as React from "react"

export const Button = React.forwardRef(
  (
    { className = "", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        type={type}
        className={
          "inline-flex items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-700 px-6 py-2 font-semibold text-white shadow hover:bg-blue-700 dark:hover:bg-blue-800 transition disabled:opacity-50 disabled:pointer-events-none " +
          className
        }
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
