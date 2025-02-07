"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const models = [
  { label: "Deepseek-r1:1.5b" },
  { label: "Deepseek-r1:7b" },
  { label: "Deepseek-r1:8b" },
  { label: "Deepseek-r1:14b" },
  { label: "Deepseek-r1:32b" },
  { label: "Deepseek-r1:70b" },

  { label: "mistral:7b" },
  { label: "phi4:14b" },

  { label: "llama2:7b" },
  { label: "llama2:13b" },
  { label: "llama2:70b" },

  { label: "llama3:8b" },
  { label: "llama3:70b" },
  { label: "llama3.1:8b" },
  { label: "llama3.1:70b" },
  { label: "llama3.1:405b" },
  { label: "llama3.2:1b" },
  { label: "llama3.2:3b" },
  { label: "llama3.3:70b" },

  { label: "qwen:0.5b" },
  { label: "qwen:1.8b" },
  { label: "qwen:4b" },
  { label: "qwen:7b" },
  { label: "qwen:14b" },
  { label: "qwen:32b" },
  { label: "qwen:72b" },
  { label: "qwen:110b" },

  { label: "qwen2:0.5b" },
  { label: "qwen2:1.5b" },
  { label: "qwen2:7b" },
  { label: "qwen2:72b" },
  { label: "qwen2.5:0.5b" },
  { label: "qwen2.5:1.5b" },
  { label: "qwen2.5:3b" },
  { label: "qwen2.5:7b" },
  { label: "qwen2.5:14b" },
  { label: "qwen2.5:32b" },
  { label: "qwen2.5:72b" },
  
  { label: "qwen2.5-coder:0.5b" },
  { label: "qwen2.5-coder:1.5b" },
  { label: "qwen2.5-coder:3b" },
  { label: "qwen2.5-coder:7b" },
  { label: "qwen2.5-coder:14b" },
  { label: "qwen2.5-coder:32b" },
]

interface DeepseekModelSelectorProps {
  value: string | null
  onChange: (value: string) => void
  disabled?: boolean
}

export function DeepseekModelSelector({ value, onChange, disabled }: DeepseekModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  // Fetch the selected model from local storage when the component mounts
  React.useEffect(() => {
    const storedModel = localStorage.getItem("selectedDeepseekModel")
    if (storedModel) {
      onChange(storedModel) // Update the parent state if a model is stored
    } else {
      onChange("Deepseek-r1:1.5b") // Set default if no model is stored
    }
  }, [onChange])

  const handleModelChange = (value: string) => {
    onChange(value)
    localStorage.setItem("selectedDeepseekModel", value) // Store in local storage
    setOpen(false)
  }

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
          {value ? models.find((model) => model.label === value)?.label : "Select Deepseek model..."}
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
                  key={model.label}
                  value={model.label}
                  onSelect={() => handleModelChange(model.label)} // Use the new handler
                  className="text-white hover:bg-neutral-800"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === model.label ? "opacity-100" : "opacity-0")} />
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
