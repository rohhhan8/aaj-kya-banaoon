import { useState } from "react";
import { motion } from "framer-motion";
import { DishTag } from "@/lib/utils";

interface FilterBarProps {
  onFilterChange: (activeFilters: DishTag[]) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
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
    { tag: "Healthy", icon: "fas fa-apple-alt" },
    { tag: "Light", icon: "fas fa-feather" },
    { tag: "Spicy", icon: "fas fa-fire" },
    { tag: "Quick", icon: "fas fa-bolt" },
    { tag: "Festive", icon: "fas fa-birthday-cake" },
  ];

  const staggerDelay = 0.05;

  return (
    <motion.div 
      className="container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        <span className="font-quicksand font-semibold text-charcoal mr-2 my-1">Preferences:</span>
        {filterOptions.map((option, index) => (
          <motion.button
            key={option.tag}
            onClick={() => toggleFilter(option.tag)}
            className={`px-4 py-2 rounded-full ${
              activeFilters.includes(option.tag) 
                ? "bg-mint-green text-charcoal" 
                : "bg-white border border-gray-200 text-charcoal"
            } font-quicksand text-sm hover:bg-mint-green hover:text-charcoal transition-colors duration-200 my-1`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 + (index * staggerDelay) }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={`${option.icon} mr-1`}></i> {option.tag}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default FilterBar;
