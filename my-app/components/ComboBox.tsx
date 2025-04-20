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
    onChange?: (value: string) => void;
    className?: string;
}

export function ComboBox({
    items,
    placeholder = "Selecciona una opción",
    searchPlaceholder = "Buscar...",
    emptyMessage = "No se encontraron resultados.",
    defaultValue = "",
    onChange,
    className = "w-[200px]"
}: ComboBoxProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue);
    const [prerendered, setPrerendered] = useState(false)


    // Prerenderizar los elementos una vez que se intenta abrir el combobox
    useEffect(() => {
        if (open) {
            setPrerendered(true)
        }
    }, [open])

    // Usamos useMemo para optimizar la renderización de los items
    const renderedItems = useMemo(() => (
        <CommandGroup>
            {items.map((item) => (
                <CommandItem
                    key={item.code}
                    value={item.code}
                    onSelect={(currentValue: string) => {
                        setValue(currentValue === value ? "" : currentValue);
                        if (onChange) {
                            onChange(currentValue === value ? "" : currentValue);
                        }
                        setOpen(false);
                    }}
                >
                    {item.name}
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