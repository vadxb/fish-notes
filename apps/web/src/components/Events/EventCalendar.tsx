"use client";
import { useState } from "react";
import { Event } from "@store/useEventStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventCalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onEventEdit?: (eventId: string) => void;
  onEventDelete?: (eventId: string) => void;
}

export default function EventCalendar({
  events,
  onEventClick,
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Function to determine event color based on catches or other criteria
  const getEventColor = (event: Event) => {
    if (event.catches && event.catches.length > 0) {
      return "bg-green-500"; // Green for events with catches
    }
    return "bg-blue-500"; // Blue for events without catches
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startAt);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 bg-gray-700/50 border-b border-gray-600/50">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-300" />
        </button>

        <h2 className="text-xl font-semibold text-white">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {getCalendarDays().map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);

            return (
              <div
                key={index}
                className={`
                  min-h-[100px] p-2 border border-gray-600/30 rounded-lg
                  ${isCurrentMonthDay ? "bg-gray-800/30" : "bg-gray-900/30"}
                  ${isTodayDate ? "ring-2 ring-blue-500/50 bg-blue-500/10" : ""}
                  ${!isCurrentMonthDay ? "opacity-50" : ""}
                `}
              >
                {/* Date Number */}
                <div
                  className={`
                  text-sm font-medium mb-1
                  ${isCurrentMonthDay ? "text-white" : "text-gray-500"}
                  ${isTodayDate ? "text-blue-300 font-bold" : ""}
                `}
                >
                  {date.getDate()}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={`
                        ${getEventColor(event)} text-white text-xs p-1 rounded cursor-pointer
                        hover:opacity-80 transition-opacity
                      `}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {event.locationText && (
                        <div className="text-xs opacity-80 truncate">
                          📍 {event.locationText}
                        </div>
                      )}
                      {event.catches && event.catches.length > 0 && (
                        <div className="text-xs opacity-80">
                          🎣 {event.catches.length} catch
                          {event.catches.length !== 1 ? "es" : ""}
                        </div>
                      )}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-400">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
