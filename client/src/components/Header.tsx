import { motion } from "framer-motion";
import useCurrentDateTime from "@/hooks/useCurrentDateTime";

interface HeaderProps {
  familySize?: number;
}

const Header = ({ familySize = 4 }: HeaderProps) => {
  const { day, timeOfDay } = useCurrentDateTime();

  return (
    <header className="relative">
      <div className="bg-gradient-to-r from-tomato-red to-warm-orange h-96 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <motion.div 
          className="container mx-auto px-4 py-8 relative z-10 flex flex-col h-full justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-playfair mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Contextual Cooking Guide
            </motion.h1>
            <motion.p 
              className="text-xl text-cream font-nunito mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Perfect dishes for every occasion in Indian households
            </motion.p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
              <motion.div 
                className="bg-white/90 rounded-full px-6 py-3 flex items-center space-x-2 shadow-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <i className="fas fa-calendar-day text-tomato-red"></i>
                <span className="font-quicksand font-medium text-charcoal">{day} {timeOfDay}</span>
              </motion.div>
              <motion.div 
                className="bg-white/90 rounded-full px-6 py-3 flex items-center space-x-2 shadow-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <i className="fas fa-user-friends text-tomato-red"></i>
                <span className="font-quicksand font-medium text-charcoal">Family of {familySize}</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
