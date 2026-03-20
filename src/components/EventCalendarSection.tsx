import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';
import { CalendarDays, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, getDay, isToday, isBefore, startOfDay } from 'date-fns';
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
    <section id="kalendar" ref={ref} className="py-28 bg-card relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/15 to-transparent" />

      <div className="container mx-auto px-4 max-w-3xl">
        <div className={`text-center mb-14 ${isVisible ? 'animate-reveal-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/8 border border-gold/15 mb-4">
            <CalendarDays size={13} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.2em] uppercase">Rezervácie</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.01em' }}>
            Obsadenosť podniku
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            Kliknite na voľný deň a rezervujte si termín pre vašu akciu.
          </p>
        </div>

        <div className={`bg-background rounded-2xl border border-border p-4 sm:p-8 shadow-premium-lg ${isVisible ? 'animate-reveal-scale' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2.5 rounded-xl hover:bg-secondary transition-all duration-200 active:scale-95"
            >
              <ChevronLeft size={18} className="text-muted-foreground" />
            </button>
            <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground capitalize">
              {format(currentMonth, 'LLLL yyyy', { locale: sk })}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2.5 rounded-xl hover:bg-secondary transition-all duration-200 active:scale-95"
            >
              <ChevronRight size={18} className="text-muted-foreground" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-3">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground/60 py-2 uppercase tracking-wider">
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
                    aspect-square rounded-xl flex flex-col items-center justify-center relative
                    text-sm font-medium transition-all duration-200
                    ${past ? 'text-muted-foreground/30 cursor-not-allowed' : 'cursor-pointer hover:bg-secondary active:scale-[0.96]'}
                    ${today ? 'ring-2 ring-gold/40 ring-inset bg-gold/5' : ''}
                    ${status === 'booked' && !past ? 'bg-destructive/12 text-destructive' : ''}
                    ${status === 'tentative' && !past ? 'bg-gold/8 text-gold' : ''}
                    ${status === 'free' && !past ? 'text-foreground' : ''}
                  `}
                >
                  <span className="tabular-nums">{format(day, 'd')}</span>
                  {dayEvents.length > 0 && !past && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span
                          key={e.id}
                          className={`w-1 h-1 rounded-full ${
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
          <div className="flex flex-wrap items-center justify-center gap-5 mt-8 pt-6 border-t border-border/60">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary border border-border/80" />
              Voľný
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-gold/30 border border-gold/20" />
              Predbežne
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/30 border border-destructive/20" />
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
