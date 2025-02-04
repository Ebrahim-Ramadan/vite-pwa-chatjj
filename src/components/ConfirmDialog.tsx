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
        <DialogContent className="bg-neutral-900 border-neutral-800">
          <DialogHeader>
            <DialogTitle className="text-red-500 font-bold">{title}</DialogTitle>
            <DialogDescription className="text-neutral-400">
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
              className="text-neutral-300 hover:bg-neutral-800"
            >
              Cancel
            </Button>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }