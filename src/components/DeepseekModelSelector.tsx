"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {DeepSeek, Ollama, MistralAI, QWEN_LOGO_COMPONENT} from "@/components/ui/SVGs"
const models = [
  { label: "Deepseek-r1:1.5b", group: "Deepseek-r1", icon: DeepSeek },
  { label: "Deepseek-r1:7b", group: "Deepseek-r1", icon: DeepSeek },
  { label: "Deepseek-r1:8b", group: "Deepseek-r1", icon: DeepSeek },
  { label: "Deepseek-r1:14b", group: "Deepseek-r1", icon: DeepSeek },
  { label: "Deepseek-r1:32b", group: "Deepseek-r1", icon: DeepSeek },
  { label: "Deepseek-r1:70b", group: "Deepseek-r1", icon: DeepSeek },

  { label: "mistral:7b", group: "mistral", icon: MistralAI },

  { label: "llama2:7b", group: "llama2", icon: Ollama },
  { label: "llama2:13b", group: "llama2", icon: Ollama },
  { label: "llama2:70b", group: "llama2", icon: Ollama },

  { label: "llama3:8b", group: "llama3", icon: Ollama },
  { label: "llama3:70b", group: "llama3", icon: Ollama },
  { label: "llama3.1:8b", group: "llama3.1", icon: Ollama },
  { label: "llama3.1:70b", group: "llama3.1", icon: Ollama },
  { label: "llama3.1:405b", group: "llama3.1", icon: Ollama },
  { label: "llama3.2:1b", group: "llama3.2", icon: Ollama },
  { label: "llama3.2:3b", group: "llama3.2", icon: Ollama },
  { label: "llama3.3:70b", group: "llama3.3", icon: Ollama },

  { label: "qwen:0.5b", group: "qwen", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen:1.8b", group: "qwen", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen:4b", group: "qwen", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen:7b", group: "qwen", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen:14b", group: "qwen", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen:32b", group: "qwen", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen:72b", group: "qwen", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen:110b", group: "qwen", icon: QWEN_LOGO_COMPONENT },

  { label: "qwen2:0.5b", group: "qwen2", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2:1.5b", group: "qwen2", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2:7b", group: "qwen2", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2:72b", group: "qwen2", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5:0.5b", group: "qwen2.5", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5:1.5b", group: "qwen2.5", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5:3b", group: "qwen2.5", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5:7b", group: "qwen2.5", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5:14b", group: "qwen2.5", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5:32b", group: "qwen2.5", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5:72b", group: "qwen2.5", icon: QWEN_LOGO_COMPONENT },

  { label: "qwen2.5-coder:0.5b", group: "qwen2.5-coder", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5-coder:1.5b", group: "qwen2.5-coder", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5-coder:3b", group: "qwen2.5-coder", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5-coder:7b", group: "qwen2.5-coder", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5-coder:14b", group: "qwen2.5-coder", icon: QWEN_LOGO_COMPONENT },
  { label: "qwen2.5-coder:32b", group: "qwen2.5-coder", icon: QWEN_LOGO_COMPONENT },
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

  // Group models by their base names
  const groupedModels = models.reduce((acc, model) => {
    if (!acc[model.group]) {
      acc[model.group] = []
    }
    acc[model.group].push(model)
    return acc
  }, {} as Record<string, typeof models>)

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
            {Object.keys(groupedModels).map((group) => {
              const IconComponent = groupedModels[group][0].icon // Get the icon for the group
              return (
                <CommandGroup key={group} heading={
                  <div className="flex items-center text-neutral-500">
                    <IconComponent className="mr-2 h-4 w-4" />
                    <span>{group}</span>
                  </div>
                }>
                  {groupedModels[group].map((model) => (
                    <CommandItem
                      key={model.label}
                      value={model.label}
                      onSelect={() => handleModelChange(model.label)}
                      className="text-white hover:bg-neutral-800"
                    >
                      <Check className={cn("mr-2 h-4 w-4", value === model.label ? "opacity-100" : "opacity-0")} />
                      {model.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
