import { motion } from "framer-motion";
import useCurrentDateTime from "@/hooks/useCurrentDateTime";
import ThemeToggle from "./ThemeToggle";
import FamilySizeSelector from "./FamilySizeSelector";

interface HeaderProps {
  familySize: number;
  onFamilySizeChange: (size: number) => void;
}

const Header = ({ familySize, onFamilySizeChange }: HeaderProps) => {
  const { day, timeOfDay } = useCurrentDateTime();

  return (
    <header className="relative bg-gradient-to-b from-haldi to-deep-saffron dark:from-slate-900 dark:to-slate-800 min-h-screen flex flex-col">
      {/* Background overlay pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-saffron/20 rounded-full blur-3xl"></div>
      <div className="absolute top-32 right-10 w-40 h-40 bg-mint-green/10 rounded-full blur-3xl"></div>
      
      {/* Navigation area */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <motion.div 
          className="text-white dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-quicksand font-bold text-lg">RasaRoots</h3>
        </motion.div>
        
        <div className="flex items-center space-x-2">
          <FamilySizeSelector 
            familySize={familySize} 
            onChange={onFamilySizeChange} 
          />
          <ThemeToggle />
        </div>
      </div>
      
      {/* Main hero content */}
      <div className="flex-grow flex flex-col justify-center items-center text-center relative z-10 px-4 pb-24">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-playfair">
            Rasa<span className="text-mint-green dark:text-teal-400">Roots</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-nunito mb-8 max-w-2xl mx-auto">
            Discover the perfect dishes for your Indian kitchen, tailored to your day, time, and special occasions
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
            <motion.div 
              className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-calendar-day text-mint-green dark:text-teal-400"></i>
              <span className="font-quicksand font-medium">{day}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-clock text-mint-green dark:text-teal-400"></i>
              <span className="font-quicksand font-medium">{timeOfDay}</span>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/70"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 0.2
          }}
        >
          <i className="fas fa-chevron-down"></i>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;