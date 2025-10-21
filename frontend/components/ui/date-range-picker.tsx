"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps {
  className?: string
  date?: {
    from: Date | undefined
    to: Date | undefined
  }
  onDateChange?: (date: { from: Date | undefined; to: Date | undefined }) => void
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [selectedDate, setSelectedDate] = React.useState<{
    from: Date | undefined
    to: Date | undefined
  }>(date || { from: undefined, to: undefined })

  const handleDateChange = (newDate: { from: Date | undefined; to: Date | undefined }) => {
    setSelectedDate(newDate)
    onDateChange?.(newDate)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate?.from ? (
              selectedDate.to ? (
                <>
                  {selectedDate.from.toLocaleDateString()} -{" "}
                  {selectedDate.to.toLocaleDateString()}
                </>
              ) : (
                selectedDate.from.toLocaleDateString()
              )
            ) : (
              <span>Seleccionar rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedDate?.from}
            selected={selectedDate}
            onSelect={(range) => {
              if (range) {
                handleDateChange(range)
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}