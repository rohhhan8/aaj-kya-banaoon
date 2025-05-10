import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  festivals, 
  getUpcomingFestival, 
  isTodayFestival, 
  Festival 
} from "@/lib/festivalData";

interface DailyContextProps {
  title: string;
  description: string;
}

interface SpecialContextProps {
  onOccasionSelect: (occasion: string) => void;
}

interface ModernContextualHeaderProps {
  mode: "daily" | "special";
  dailyContext: DailyContextProps;
  specialContext: SpecialContextProps;
  day: string;
  timeOfDay: string;
}

const ModernContextualHeader = ({ mode, dailyContext, specialContext, day, timeOfDay }: ModernContextualHeaderProps) => {
  const [upcomingFestival, setUpcomingFestival] = useState<Festival | undefined>();
  const [todayFestival, setTodayFestival] = useState<Festival | undefined>();
  
  // Get upcoming and today's festivals (if any)
  useEffect(() => {
    setUpcomingFestival(getUpcomingFestival());
    setTodayFestival(isTodayFestival());
  }, []);
  
  // Map icons to festival IDs
  const getFestivalIcon = (id: string): string => {
    const iconMap: Record<string, string> = {
      'diwali': 'fas fa-lightbulb',
      'holi': 'fas fa-palette',
      'navratri': 'fas fa-fan',
      'eid': 'fas fa-star-and-crescent',
      'lohri': 'fas fa-fire',
      'pongal': 'fas fa-sun',
      'ganesh-chaturthi': 'fas fa-om',
      'onam': 'fas fa-leaf',
      'durga-puja': 'fas fa-om',
      'janmashtami': 'fas fa-baby',
      'baisakhi': 'fas fa-wheat',
      'raksha-bandhan': 'fas fa-link',
      'family': 'fas fa-users',
      'puja': 'fas fa-pray',
      'party': 'fas fa-glass-cheers'
    };
    
    return iconMap[id] || 'fas fa-calendar-day';
  };
  
  // Define explicit types for our occasion items
  type RegularOccasion = {
    id: string;
    name: string;
    icon: string;
    isSpecial?: false;
  };
  
  type FestivalOccasion = {
    id: string;
    name: string;
    icon: string;
    isSpecial: true;
    festival: Festival;
  };
  
  // Combine our festivals with other occasions
  const regularOccasions: RegularOccasion[] = [
    { id: "family", name: "Family Gathering", icon: "fas fa-users", isSpecial: false },
    { id: "puja", name: "Puja Ceremony", icon: "fas fa-pray", isSpecial: false },
    { id: "party", name: "Party", icon: "fas fa-glass-cheers", isSpecial: false },
  ];
  
  const festivalOccasions: FestivalOccasion[] = festivals.map(festival => ({
    id: festival.id,
    name: festival.name,
    icon: getFestivalIcon(festival.id),
    isSpecial: true,
    festival
  }));
  
  // Combined occasions
  const occasions: (RegularOccasion | FestivalOccasion)[] = [
    ...regularOccasions,
    ...festivalOccasions
  ];

  return (
    <div className="container mx-auto px-4 py-4">
      <AnimatePresence mode="wait">
        {mode === "daily" ? (
          <motion.div
            key="daily-context"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="fade-in"
          >
            <Card className="bg-white dark:bg-slate-800 shadow-lg border-none">
              <CardContent className="p-6">
                {/* Context indicator - simplified header */}
                <div className="mb-6 flex items-center justify-end">
                  <div className="flex items-center space-x-2 bg-white/10 dark:bg-slate-700/30 px-4 py-1.5 rounded-full">
                    <i className="fas fa-utensils text-sm text-saffron dark:text-marigold"></i>
                    <span className="text-sm font-medium text-charcoal/80 dark:text-white/80">Daily Menu Suggestions</span>
                  </div>
                </div>
                
                {/* Show festival context if today is a festival */}
                {todayFestival ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-deep-saffron/20 dark:bg-deep-saffron/30 p-3 rounded-full">
                        <i className={`${getFestivalIcon(todayFestival.id)} text-xl text-deep-saffron`}></i>
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white mr-2">
                            Happy {todayFestival.name}!
                          </h2>
                          <Badge className="bg-deep-saffron text-white">Today</Badge>
                        </div>
                        <p className="text-spice-brown dark:text-slate-300 font-nunito mb-3">
                          {todayFestival.description}
                        </p>
                        <div className="mt-3">
                          <h3 className="text-sm font-medium text-charcoal dark:text-white mb-2">Traditional dishes:</h3>
                          <div className="flex flex-wrap gap-1">
                            {todayFestival.dishes.slice(0, 5).map((dish, i) => (
                              <Badge key={i} variant="outline" className="border-saffron/30 text-saffron dark:border-marigold/30 dark:text-marigold">
                                {dish}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : upcomingFestival ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-saffron/20 dark:bg-marigold/20 p-3 rounded-full">
                        <i className="fas fa-utensils text-xl text-saffron dark:text-marigold"></i>
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white mb-2">
                          {dailyContext.title}
                        </h2>
                        <p className="text-spice-brown dark:text-slate-300 font-nunito mb-3">
                          {dailyContext.description}
                        </p>
                        
                        {/* Upcoming festival notice */}
                        <div className="mt-4 p-3 bg-cream/30 dark:bg-slate-700/30 rounded-lg">
                          <div className="flex items-center">
                            <i className={`${getFestivalIcon(upcomingFestival.id)} text-lg text-saffron dark:text-marigold mr-2`}></i>
                            <p className="text-sm font-medium text-charcoal dark:text-white">
                              <span className="font-semibold">{upcomingFestival.name}</span> is coming up soon!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="bg-saffron/20 dark:bg-marigold/20 p-3 rounded-full">
                      <i className="fas fa-utensils text-xl text-saffron dark:text-marigold"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white mb-2">{dailyContext.title}</h2>
                      <p className="text-spice-brown dark:text-slate-300 font-nunito">{dailyContext.description}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="special-context"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="fade-in"
          >
            <Card className="bg-white dark:bg-slate-800 shadow-lg border-none overflow-hidden">
              <CardContent className="p-6">
                {/* Context indicator for special occasions */}
                <div className="mb-6 flex items-center justify-end">
                  <div className="flex items-center space-x-2 bg-white/10 dark:bg-slate-700/30 px-4 py-1.5 rounded-full">
                    <i className="fas fa-star text-sm text-saffron dark:text-marigold"></i>
                    <span className="text-sm font-medium text-charcoal/80 dark:text-white/80">Special Occasion Meals</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white mb-6">Choose an Occasion</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {occasions.map((occasion, index) => (
                    <motion.div
                      key={occasion.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 * (index % 10) }} // Limit delay for better performance
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className={`w-full h-24 flex flex-col items-center justify-center gap-2 
                          ${occasion.isSpecial 
                            ? 'bg-gradient-to-br from-white/70 to-saffron/20 dark:from-slate-700/70 dark:to-marigold/20' 
                            : 'bg-white/50 dark:bg-slate-700/50'} 
                          border-none hover:bg-saffron/20 dark:hover:bg-marigold/20 shadow-sm rounded-lg`}
                        onClick={() => specialContext.onOccasionSelect(
                          'id' in occasion && 'festival' in occasion ? occasion.id : occasion.name
                        )}
                      >
                        {/* Add a special indicator for festivals */}
                        {occasion.isSpecial && (
                          <div className="absolute top-1 right-1">
                            <div className="w-2 h-2 rounded-full bg-deep-saffron dark:bg-marigold animate-pulse"></div>
                          </div>
                        )}
                        
                        <i className={`${occasion.icon} text-xl text-saffron dark:text-marigold`}></i>
                        <span className="font-quicksand text-sm text-center text-charcoal dark:text-white">{occasion.name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernContextualHeader;