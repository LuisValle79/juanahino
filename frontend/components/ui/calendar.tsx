"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CalendarProps {
  className?: string
  initialFocus?: boolean
  mode?: "single" | "range"
  defaultMonth?: Date
  selected?: any
  onSelect?: (date: any) => void
  numberOfMonths?: number
}

export function Calendar({
  className,
  initialFocus,
  mode = "single",
  defaultMonth,
  selected,
  onSelect,
  numberOfMonths = 1,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(defaultMonth || new Date())

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (mode === "range" && selected) {
      if (!selected.from || (selected.from && selected.to)) {
        // Start new range
        onSelect?.({ from: clickedDate, to: undefined })
      } else if (selected.from && !selected.to) {
        // Complete range
        if (clickedDate >= selected.from) {
          onSelect?.({ from: selected.from, to: clickedDate })
        } else {
          onSelect?.({ from: clickedDate, to: selected.from })
        }
      }
    } else {
      onSelect?.(clickedDate)
    }
  }

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    
    if (mode === "range" && selected) {
      if (selected.from && selected.to) {
        return date >= selected.from && date <= selected.to
      } else if (selected.from) {
        return date.getTime() === selected.from.getTime()
      }
    }
    
    return false
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        {days.map((day) => (
          <Button
            key={day}
            variant={isDateSelected(day) ? "default" : "ghost"}
            size="sm"
            className="p-2 h-8 w-8"
            onClick={() => handleDateClick(day)}
          >
            {day}
          </Button>
        ))}
      </div>
    </div>
  )
}