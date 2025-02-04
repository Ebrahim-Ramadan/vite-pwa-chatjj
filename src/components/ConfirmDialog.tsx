import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  
  interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
  }
  export function ConfirmDialog({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description 
  }: ConfirmDialogProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-zinc-900 border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-red-500 font-bold">{title}</DialogTitle>
            <DialogDescription className="text-zinc-400">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row-reverse gap-2">
          <Button 
            tabIndex={0} 
              variant="destructive" 
              onClick={onConfirm} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
            <Button 
            tabIndex={1} 
              variant="outline" 
              onClick={onClose} 
              className="text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }