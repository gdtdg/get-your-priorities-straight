import { tv } from "tailwind-variants";
import Root from "./button.svelte";
const buttonVariants = tv({
  base: "ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_12px_20px_rgba(13,148,136,0.22)]",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border-input bg-background/90 hover:bg-accent hover:text-accent-foreground border shadow-[0_8px_16px_rgba(8,51,68,0.08)]",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
export {
  Root,
  //
  Root as Button,
  buttonVariants,
};
