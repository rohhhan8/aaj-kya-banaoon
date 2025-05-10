import { useState } from "react";
import { motion } from "framer-motion";
import { DishTag } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ModernFilterBarProps {
  onFilterChange: (activeFilters: DishTag[]) => void;
}

const ModernFilterBar = ({ onFilterChange }: ModernFilterBarProps) => {
  const [activeFilters, setActiveFilters] = useState<DishTag[]>([]);

  const toggleFilter = (filter: DishTag) => {
    if (activeFilters.includes(filter)) {
      const newFilters = activeFilters.filter(f => f !== filter);
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      const newFilters = [...activeFilters, filter];
      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    }
  };

  const filterOptions: { tag: DishTag; icon: string }[] = [
    { tag: "Healthy", icon: "fas fa-heart" },
    { tag: "Light", icon: "fas fa-feather" },
    { tag: "Spicy", icon: "fas fa-pepper-hot" },
    { tag: "Quick", icon: "fas fa-bolt" },
    { tag: "Festive", icon: "fas fa-birthday-cake" },
    { tag: "Protein", icon: "fas fa-drumstick-bite" },
    { tag: "Probiotic", icon: "fas fa-bacteria" },
    { tag: "One-pot", icon: "fas fa-utensil-spoon" },
    { tag: "Balanced", icon: "fas fa-balance-scale" },
  ];

  const staggerDelay = 0.05;

  return (
    <motion.div 
      className="container mx-auto px-4 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-6">
        <h3 className="font-quicksand font-semibold text-lg mb-4 text-charcoal dark:text-white">
          Filter by Preference
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option, index) => (
            <motion.div
              key={option.tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + (index * staggerDelay) }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge 
                onClick={() => toggleFilter(option.tag)}
                variant={activeFilters.includes(option.tag) ? "default" : "outline"}
                className={`cursor-pointer text-sm py-2 px-3 ${
                  activeFilters.includes(option.tag) 
                    ? "bg-saffron hover:bg-deep-saffron text-white dark:bg-marigold dark:hover:bg-deep-saffron" 
                    : "bg-white dark:bg-slate-700 hover:bg-saffron/10 dark:hover:bg-marigold/10 text-charcoal dark:text-white"
                }`}
              >
                <i className={`${option.icon} mr-1`}></i> {option.tag}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ModernFilterBar;