import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/authContext";

interface UserGreetingProps {
  timeOfDay: string;
  day: string;
}

const UserGreeting = ({ timeOfDay, day }: UserGreetingProps) => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const { user } = useAuth();
  
  // Get user's name or use "Foodie" as fallback
  const userName = user?.displayName?.split(' ')[0] || "Foodie";
  
  useEffect(() => {
    // Set greeting based on time of day
    if (timeOfDay === "Morning") {
      setGreeting("Good Morning");
    } else if (timeOfDay === "Afternoon") {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
    
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [timeOfDay]);

  const getSuggestionText = () => {
    if (timeOfDay === "Morning") {
      return "Here are some breakfast ideas to kickstart your day.";
    } else if (timeOfDay === "Afternoon") {
      return "Check out these lunch options perfect for midday.";
    } else {
      return "Explore these dinner recipes to end your day on a delicious note.";
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card className="bg-gradient-to-r from-cream/80 to-cream/60 dark:from-slate-800 dark:to-slate-700/90 backdrop-blur-sm border-none shadow-lg overflow-hidden">
        <CardContent className="pt-6 relative">
          {/* Floating animated background elements */}
          <motion.div 
            className="absolute top-0 right-0 h-16 w-16 rounded-full bg-amber-200/20 dark:bg-teal-400/10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 10, 0],
              y: [0, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-2 left-20 h-8 w-8 rounded-full bg-mint-green/20 dark:bg-amber-400/10"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
              x: [0, -10, 0],
              y: [0, 8, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex flex-col">
              <motion.div 
                className="flex items-center space-x-3 mb-2"
                variants={itemVariants}
              >
            <div className="p-2 rounded-full bg-saffron/20 text-deep-saffron dark:text-marigold">
              {timeOfDay === "Morning" ? (
                <i className="fas fa-sun text-xl"></i>
              ) : timeOfDay === "Afternoon" ? (
                <i className="fas fa-cloud-sun text-xl"></i>
              ) : (
                <i className="fas fa-moon text-xl"></i>
              )}
            </div>
            <h2 className="text-xl font-bold font-quicksand text-charcoal dark:text-white">
                  {greeting}, <span className="text-deep-saffron dark:text-marigold">{userName}!</span>
            </h2>
              </motion.div>
              
              <motion.p 
                className="text-spice-brown dark:text-cream/80 font-nunito ml-12"
                variants={itemVariants}
              >
                It's {day} {timeOfDay}. {getSuggestionText()}
              </motion.p>
            </div>
            
            <motion.div 
              className="text-right font-quicksand"
              variants={itemVariants}
            >
              <motion.span 
                className="block text-2xl font-bold text-deep-saffron dark:text-marigold"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {currentTime}
              </motion.span>
              <span className="text-sm text-charcoal/60 dark:text-white/60">{day}</span>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserGreeting;