
import { ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface MobileChatDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
}

export function MobileChatDialog({ isOpen, setIsOpen, children }: MobileChatDialogProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="h-[85%]">
        <DrawerHeader className="border-b pb-2">
          <div className="flex items-center">
            <div className="p-1 rounded-full bg-procurpal-primary/10 text-procurpal-primary mr-2">
              <Sparkles size={18} />
            </div>
            <DrawerTitle>ProcurPal AI Assistant</DrawerTitle>
          </div>
        </DrawerHeader>
        <div className="flex flex-col h-[calc(100%-64px)]">
          {children}
        </div>
        <DrawerFooter className="pt-2 border-t">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
