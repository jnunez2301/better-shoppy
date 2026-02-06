import { Menu as ChakraMenu, Portal } from "@chakra-ui/react"
import * as React from "react"

export const Menu = ChakraMenu

export const MenuContent = React.forwardRef<
  HTMLDivElement,
  ChakraMenu.ContentProps
>(function MenuContent(props, ref) {
  return (
    <Portal>
      <ChakraMenu.Content ref={ref} {...props} />
    </Portal>
  )
})

export const MenuItem = ChakraMenu.Item
export const MenuRoot = ChakraMenu.Root
export const MenuTrigger = ChakraMenu.Trigger
