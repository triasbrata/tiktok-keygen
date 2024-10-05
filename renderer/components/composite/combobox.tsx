"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo } from "react";
import { debounce } from "lodash";

type ComboBoxProp<T extends React.ReactNode> = {
  initialSelected?: string;
  options: Array<{ key: string; render: T; value: string }>;
  onSelected: (key: string, value: string) => void;
  placeHolder?: T;
  onSearch: (
    key: string
  ) => Promise<Array<{ key: string; value: string; render: T }>>;
};

export function Combobox<T extends React.ReactNode>({
  options: opt,
  placeHolder,
  onSelected,
  initialSelected,
  onSearch,
}: ComboBoxProp<T>) {
  const [options, setOptions] = React.useState(opt ?? []);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [valueQuery, setValueQuery] = React.useState("");
  const renderValue = useMemo(() => {
    let selected = options.find((it) => it.key === value);
    if (selected) {
      return selected.render;
    }
    if (initialSelected) {
      selected = options.find((it) => it.key === initialSelected);
      if (selected) {
        return selected.render;
      }
    }
    return placeHolder ?? "Select...";
  }, [value]);
  const debounceSearch = React.useCallback(
    debounce((key: string) => {
      if (key.length > 3) {
        onSearch(key).then((res) => setOptions(res));
      }
    }, 500),
    []
  );
  React.useEffect(() => {
    console.log({ valueQuery });
    debounceSearch(valueQuery);
  }, [valueQuery]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {renderValue}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandInput
            onValueChange={(val) => setValueQuery(val)}
            value={valueQuery}
            placeholder="Search..."
          />
          <CommandList>
            <CommandEmpty>No option match...</CommandEmpty>
            {options.map((o, i) => (
              <CommandItem
                key={i}
                value={o.value}
                onSelect={() => {
                  onSelected(o.key, o.value);
                  setValue(o.key);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === o.key ? "opacity-100" : "opacity-0"
                  )}
                />
                {o.render}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
