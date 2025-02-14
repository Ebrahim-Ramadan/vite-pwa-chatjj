import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface QuickHintModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickHintModal({ isOpen, onOpenChange }: QuickHintModalProps) {

  const handleViewInstructions = () => {
    onOpenChange(false)
    localStorage.setItem('hasSeenQuickHint', true)
    window.open('https://github.com/Ebrahim-Ramadan/vite-pwa-chatjj?tab=readme-ov-file#how-to-use-chatjj', '_blank');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-[425px] bg-black border-neutral-800 ">
        <DialogHeader>
          <DialogTitle className='text-lg'>Welcome to ChatJJ!</DialogTitle>
          <DialogDescription className='text-neutral-400'>
            This app allows you to talk to your <span className='text-neutral-300'>already installed model on your machine</span>, offline and fast. <span className='text-neutral-300'>And you have got to know the setup instructions</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
         
          <Button onClick={handleViewInstructions} className="bg-neutral-200 text-black hover:bg-neutral-300 font-bold">
            View Instructions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default QuickHintModal