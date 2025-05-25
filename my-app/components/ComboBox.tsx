'use client'

import { useEffect, useMemo, useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
    name: string;
    code: string;
}

interface ComboBoxProps {
    items: Item[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
}

export function ComboBox({
    items,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    emptyMessage = "No results found.",
    defaultValue = "",
    value: controlledValue,
    onChange,
    className = "w-[200px]"
}: ComboBoxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(controlledValue ?? defaultValue);
    const [prerendered, setPrerendered] = useState(false)

    // Sync with controlled value from parent
    useEffect(() => {
        if (controlledValue !== undefined) {
            setValue(controlledValue);
        }
    }, [controlledValue]);


    // Prerender elements once the combobox is attempted to open
    useEffect(() => {
        if (open) {
            setPrerendered(true)
        }
    }, [open])

    // Use useMemo to optimize items rendering
    const renderedItems = useMemo(() => (
        <CommandGroup>
            {items.map((item) => (
                <CommandItem
                    key={item.code}
                    value={`${item.name} ${item.code}`}
                    onSelect={() => {
                        // Extract only the code from the selected value
                        const code = item.code;
                        setValue(code === value ? "" : code);
                        if (onChange) {
                            onChange(code === value ? "" : code);
                        }
                        setOpen(false);
                    }}
                >
                    <div className="flex items-center justify-between w-full">
                        <span>{item.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{item.code}</span>
                    </div>
                    <Check
                        className={cn(
                            "ml-auto h-4 w-4",
                            value === item.code ? "opacity-100" : "opacity-0"
                        )}
                    />
                </CommandItem>
            ))}
        </CommandGroup>

    ), [items, value, onChange])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("justify-between", className)}
                >
                    {value
                        ? items.find((item) => item.code === value)?.name || placeholder
                        : placeholder}
                    <ChevronsUpDown className="opacity-50 h-4 w-4 ml-2 shrink-0" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={className + " p-0"}>
                <Command>
                    <CommandInput placeholder={searchPlaceholder} className="h-9" />
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandList>
                        {(prerendered || open) && renderedItems}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}