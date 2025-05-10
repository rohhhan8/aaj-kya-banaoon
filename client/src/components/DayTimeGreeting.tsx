import { motion } from "framer-motion";

interface DayTimeGreetingProps {
  day: string;
  timeOfDay: string;
}

const DayTimeGreeting = ({ day, timeOfDay }: DayTimeGreetingProps) => {
  return (
    <motion.div 
      className="container mx-auto px-4 py-2 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-3 md:mb-0">
            <div className="flex items-center mr-4">
              <i className="fas fa-calendar-day text-lg text-saffron dark:text-marigold mr-2"></i>
              <span className="font-medium text-charcoal/90 dark:text-white/90">{day}</span>
            </div>
            
            <div className="flex items-center">
              <i className={`fas ${
                timeOfDay === 'Morning' ? 'fa-sun' : 
                timeOfDay === 'Afternoon' ? 'fa-sun' : 
                timeOfDay === 'Evening' ? 'fa-moon' : 'fa-moon'
              } text-lg text-saffron dark:text-marigold mr-2`}></i>
              <span className="font-medium text-charcoal/90 dark:text-white/90">{timeOfDay}</span>
            </div>
          </div>
          
          <div className="text-lg font-medium text-charcoal/80 dark:text-white/80 font-quicksand">
            {timeOfDay === "Morning" && "Good morning! Start your day with these delicious options."}
            {timeOfDay === "Afternoon" && "Good afternoon! Time for a satisfying midday meal."}
            {timeOfDay === "Evening" && "Good evening! Enjoy these dinner recommendations."}
            {timeOfDay === "Night" && "Still up? These light options are perfect for a late meal."}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DayTimeGreeting;