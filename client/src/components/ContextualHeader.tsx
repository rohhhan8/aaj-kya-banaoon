import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DailyContextProps {
  title: string;
  description: string;
}

interface SpecialContextProps {
  onOccasionSelect: (occasion: string) => void;
}

interface ContextualHeaderProps {
  mode: "daily" | "special";
  dailyContext: DailyContextProps;
  specialContext: SpecialContextProps;
}

const ContextualHeader = ({ mode, dailyContext, specialContext }: ContextualHeaderProps) => {
  const occasions = [
    { id: "family", name: "Family Gathering", icon: "fas fa-users" },
    { id: "puja", name: "Puja Ceremony", icon: "fas fa-praying-hands" },
    { id: "diwali", name: "Diwali", icon: "fas fa-moon" },
    { id: "party", name: "Party", icon: "fas fa-glass-cheers" },
  ];

  return (
    <div className="container mx-auto px-4 mb-6">
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
            <div className="bg-cream rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-playfair font-bold text-charcoal mb-2">{dailyContext.title}</h2>
              <p className="text-spice-brown font-nunito">{dailyContext.description}</p>
            </div>
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
            <div className="bg-cream rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-playfair font-bold text-charcoal mb-4">Choose an Occasion</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {occasions.map((occasion, index) => (
                  <motion.button
                    key={occasion.id}
                    className="bg-white rounded-lg shadow p-4 hover:bg-mint-green/20 transition-colors"
                    onClick={() => specialContext.onOccasionSelect(occasion.name)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className={`${occasion.icon} text-2xl text-tomato-red mb-2`}></i>
                    <p className="font-quicksand">{occasion.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextualHeader;
