"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const models = [
  { value: "1.5", label: "Deepseek-r1:1.5b" },
  { value: "7", label: "Deepseek-r1:7b" },
  { value: "8", label: "Deepseek-r1:8b" },
  { value: "14", label: "Deepseek-r1:14b" },
  { value: "32", label: "Deepseek-r1:32b" },
  { value: "70", label: "Deepseek-r1:70b" },
]

interface DeepseekModelSelectorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function DeepseekModelSelector({ value, onChange, disabled }: DeepseekModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between bg-[#1a1a1a] text-white border-neutral-800 hover:bg-neutral-800 hover:text-white"
          disabled={disabled}
        >
          {value ? models.find((model) => model.value === value)?.label : "Select Deepseek model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0 bg-[#1a1a1a] border-neutral-800">
        <Command className="bg-[#1a1a1a]">
          <CommandInput
            placeholder="Search Ollama models..."
            className="bg-[#1a1a1a] text-white placeholder:text-neutral-400"
          />
          <CommandList className="bg-[#1a1a1a] text-white">
            <CommandEmpty className="text-neutral-400">No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.label} // Changed from model.value to model.label for filtering
                  onSelect={() => {
                    onChange(model.value) // Still pass the value to onChange
                    setOpen(false)
                  }}
                  className="text-white hover:bg-neutral-800"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === model.value ? "opacity-100" : "opacity-0")} />
                  {model.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

