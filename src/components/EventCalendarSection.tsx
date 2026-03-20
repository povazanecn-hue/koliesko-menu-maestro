import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { Calendar, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, isToday, isBefore, startOfDay } from 'date-fns';
import { sk } from 'date-fns/locale';
import ReservationDialog from './ReservationDialog';
import type { Tables } from '@/integrations/supabase/types';

type Event = Tables<'events'>;

const DAY_NAMES = ['Po', 'Ut', 'St', 'Št', 'Pi', 'So', 'Ne'];

export default function EventCalendarSection() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { ref, isVisible } = useScrollReveal(0.1);

  useEffect(() => {
    const fetchEvents = async () => {
      const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
      const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd');
      const { data } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', start)
        .lte('event_date', end)
        .neq('status', 'cancelled');
      if (data) setEvents(data);
    };
    fetchEvents();
  }, [currentMonth]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Monday=0, so adjust getDay (0=Sun) → (Mon=0..Sun=6)
  const startDayIdx = (getDay(monthStart) + 6) % 7;
  const paddingDays = Array.from({ length: startDayIdx }, (_, i) => i);

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.event_date), date));

  const getDayStatus = (date: Date) => {
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length === 0) return 'free';
    if (dayEvents.some((e) => e.status === 'confirmed')) return 'booked';
    return 'tentative';
  };

  const handleDayClick = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return;
    setSelectedDate(date);
    setDialogOpen(true);
  };

  return (
    <section id="kalendar" ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className={`text-center mb-12 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <p className="text-gold uppercase tracking-[0.25em] text-xs font-medium mb-3">Kalendár</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-[1.1]">
            Obsadenosť podniku
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Kliknite na voľný deň a rezervujte si termín pre vašu akciu.
          </p>
        </div>

        <div className={`bg-card rounded-2xl border border-border p-4 sm:p-8 shadow-2xl shadow-black/20 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-secondary transition-colors active:scale-95"
            >
              <ChevronLeft size={20} className="text-muted-foreground" />
            </button>
            <h3 className="font-display text-xl font-semibold text-foreground capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: sk })}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 rounded-lg hover:bg-secondary transition-colors active:scale-95"
            >
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {paddingDays.map((i) => (
              <div key={`pad-${i}`} className="aspect-square" />
            ))}
            {days.map((day) => {
              const status = getDayStatus(day);
              const past = isBefore(day, startOfDay(new Date()));
              const today = isToday(day);
              const dayEvents = getEventsForDay(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  disabled={past}
                  className={`
                    aspect-square rounded-lg flex flex-col items-center justify-center relative
                    text-sm font-medium transition-all duration-200
                    ${past ? 'text-muted-foreground/40 cursor-not-allowed' : 'cursor-pointer hover:bg-secondary active:scale-95'}
                    ${today ? 'ring-2 ring-gold/50 ring-inset' : ''}
                    ${status === 'booked' && !past ? 'bg-destructive/15 text-destructive' : ''}
                    ${status === 'tentative' && !past ? 'bg-gold/10 text-gold' : ''}
                    ${status === 'free' && !past ? 'text-foreground' : ''}
                  `}
                >
                  <span className="tabular-nums">{format(day, 'd')}</span>
                  {dayEvents.length > 0 && !past && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            e.status === 'confirmed' ? 'bg-destructive' : 'bg-gold'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-secondary border border-border" />
              Voľný
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-gold/30" />
              Predbežne
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-3 h-3 rounded-full bg-destructive/30" />
              Obsadené
            </div>
          </div>
        </div>
      </div>

      <ReservationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
      />
    </section>
  );
}
