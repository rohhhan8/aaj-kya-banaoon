import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
}

const ModernContextualHeader = ({ mode, dailyContext, specialContext }: ModernContextualHeaderProps) => {
  const occasions = [
    { id: "family", name: "Family Gathering", icon: "fas fa-users" },
    { id: "puja", name: "Puja Ceremony", icon: "fas fa-om" },
    { id: "diwali", name: "Diwali", icon: "fas fa-lightbulb" },
    { id: "holi", name: "Holi", icon: "fas fa-palette" },
    { id: "navratri", name: "Navratri", icon: "fas fa-fan" },
    { id: "eid", name: "Eid", icon: "fas fa-star-and-crescent" },
    { id: "raksha", name: "Raksha Bandhan", icon: "fas fa-link" },
    { id: "ganesh", name: "Ganesh Chaturthi", icon: "fas fa-om" },
    { id: "onam", name: "Onam", icon: "fas fa-leaf" },
    { id: "lohri", name: "Lohri", icon: "fas fa-fire" },
    { id: "party", name: "Party", icon: "fas fa-glass-cheers" },
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
                <div className="flex items-start gap-4">
                  <div className="bg-saffron/20 dark:bg-marigold/20 p-3 rounded-full">
                    <i className="fas fa-utensils text-xl text-saffron dark:text-marigold"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white mb-2">{dailyContext.title}</h2>
                    <p className="text-spice-brown dark:text-slate-300 font-nunito">{dailyContext.description}</p>
                  </div>
                </div>
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
                <h2 className="text-2xl font-playfair font-bold text-charcoal dark:text-white mb-6">Choose an Occasion</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {occasions.map((occasion, index) => (
                    <motion.div
                      key={occasion.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-cream/30 dark:bg-slate-700/50 border-none hover:bg-saffron/20 dark:hover:bg-marigold/20"
                        onClick={() => specialContext.onOccasionSelect(occasion.name)}
                      >
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