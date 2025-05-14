import { motion } from "framer-motion";
import useCurrentDateTime from "@/hooks/useCurrentDateTime";
import ThemeToggle from "./ThemeToggle";
import LoginButton from "./LoginButton";
import UserProfile from "./UserProfile";
import { useAuth } from "@/lib/authContext";
import { useState, useEffect } from "react";

const Header = () => {
  const { day, timeOfDay } = useCurrentDateTime();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");
  
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
    
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, [timeOfDay]);

  return (
    <header className="relative bg-gradient-to-b from-haldi to-saffron dark:from-slate-900 dark:to-slate-800 min-h-screen flex flex-col">
      {/* Background patterns and decorations */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBoLTQweiIvPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgY3g9IjIwIiBjeT0iMjAiIHI9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      {/* Decorative spice elements - Softer colors for light mode */}
      <div className="absolute top-40 -left-10 w-40 h-40 bg-spice-brown/20 dark:bg-deep-saffron/30 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-10 w-32 h-32 bg-saffron/30 dark:bg-deep-saffron/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-0 w-60 h-60 bg-marigold/20 dark:bg-deep-saffron/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-60 left-20 w-40 h-40 bg-saffron/30 dark:bg-deep-saffron/20 rounded-full blur-3xl"></div>
      
      {/* Small hanging spices illustration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl">
        <div className="relative">
          <motion.div
            className="absolute -top-4 left-10 h-16 w-px bg-charcoal/10 dark:bg-white/10"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.div 
              className="absolute -bottom-1 -left-2 h-4 w-4 rounded-full bg-spice-brown dark:bg-teal-400"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.2 }}
            />
          </motion.div>
          
          <motion.div
            className="absolute -top-8 left-1/4 h-32 w-px bg-charcoal/10 dark:bg-white/10"
            initial={{ height: 0 }}
            animate={{ height: 128 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.div 
              className="absolute -bottom-1.5 -left-3 h-6 w-6 rounded-full bg-spice-brown dark:bg-teal-400"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
          </motion.div>
          
          <motion.div
            className="absolute -top-6 right-1/4 h-24 w-px bg-charcoal/10 dark:bg-white/10" 
            initial={{ height: 0 }}
            animate={{ height: 96 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <motion.div 
              className="absolute -bottom-2 -left-3.5 h-7 w-7 rounded-full bg-spice-brown dark:bg-teal-400"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.6 }}
            />
          </motion.div>
          
          <motion.div
            className="absolute -top-4 right-12 h-16 w-px bg-charcoal/10 dark:bg-white/10"
            initial={{ height: 0 }}
            animate={{ height: 64 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.div 
              className="absolute -bottom-1 -left-2 h-4 w-4 rounded-full bg-spice-brown dark:bg-teal-400"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 1.3 }}
            />
          </motion.div>
        </div>
      </div>
      
      {/* Navigation area */}
      <div className="container mx-auto px-6 pt-12 pb-6 flex justify-between items-center relative z-10">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo with spoon and fork icon */}
          <div className="relative flex items-center">
            <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md p-2.5 rounded-lg shadow-lg">
              <i className="fas fa-utensils text-xl text-spice-brown dark:text-white"></i>
            </div>
            <h3 className="font-playfair font-bold text-2xl ml-3 text-charcoal dark:text-white">
              Aaj Kya <span className="text-spice-brown dark:text-teal-400">Banaoon?</span>
            </h3>
          </div>
        </motion.div>
        
        {/* Right side elements */}
        <div className="flex items-center space-x-4">
          {/* Time and greeting for larger screens */}
          <motion.div
            className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/10 dark:bg-slate-700/20 backdrop-blur-sm rounded-full text-charcoal dark:text-white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <i className={`fas ${timeOfDay === 'Morning' ? 'fa-sun' : timeOfDay === 'Afternoon' ? 'fa-cloud-sun' : 'fa-moon'} text-spice-brown dark:text-teal-400`}></i>
            <span className="text-sm font-medium whitespace-nowrap">
              <span className="text-spice-brown dark:text-teal-400">{currentTime}</span> • {greeting}!
            </span>
          </motion.div>
          
          {/* User related elements */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
          {user ? <UserProfile /> : <LoginButton />}
          <ThemeToggle />
          </motion.div>
        </div>
      </div>
      
      {/* Main hero content */}
      <div className="flex-grow flex flex-col justify-center items-center relative z-10 px-6 pb-24">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {/* Main greeting - only visible on mobile */}
          <motion.div
            className="md:hidden flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/10 dark:bg-slate-700/30 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-medium">
                <i className={`fas ${timeOfDay === 'Morning' ? 'fa-sun' : timeOfDay === 'Afternoon' ? 'fa-cloud-sun' : 'fa-moon'} text-spice-brown dark:text-teal-400 mr-2`}></i>
                {greeting}, <span className="text-spice-brown dark:text-teal-400">{userName}</span>!
              </span>
            </div>
          </motion.div>
          
          {/* Stylized tagline */}
          <motion.p
            className="font-nunito text-xl text-charcoal/70 dark:text-white/70 mb-4"
          initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="italic">Taste of India</span> • <span>{day} {timeOfDay}</span>
          </motion.p>
          
          {/* Main heading */}
          <motion.div
            className="relative mb-4"
            initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-charcoal dark:text-white font-playfair leading-tight">
              Aaj Kya <br />
              <span className="relative inline-block">
                Banaoon
                <motion.svg
                  className="absolute -bottom-1 left-0 w-full"
                  height="12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                  width="100%"
                  viewBox="0 0 200 8"
                >
                  <motion.path
                    d="M0,5 C50,0 150,10 200,5"
                    fill="none"
                    stroke="#E67E22"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </motion.svg>
              </span>
              <span className="text-spice-brown dark:text-teal-400">?</span>
          </h1>
          </motion.div>
          
          {/* New descriptive line - Increased size */}
          <motion.p
            className="text-xl md:text-2xl text-charcoal/80 dark:text-white/80 font-nunito mx-auto max-w-2xl mt-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Discover delightful Indian recipes tailored for your daily meals and special moments.
          </motion.p>
          
          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-charcoal/90 dark:text-white/90 font-nunito mx-auto max-w-3xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Har din ka swaad, bina <span className="italic">soch-vichaar</span>.
          </motion.p>
          
          {/* Feature badges */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, staggerChildren: 0.1 }}
          >
            <motion.div 
              className="flex items-center px-4 py-2 bg-spice-brown/20 dark:bg-teal-400/20 backdrop-blur-sm rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <i className="fas fa-clock text-spice-brown dark:text-teal-400 mr-2"></i>
              <span className="text-sm font-medium text-charcoal dark:text-white">Time-based Recipes</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center px-4 py-2 bg-spice-brown/20 dark:bg-teal-400/20 backdrop-blur-sm rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <i className="fas fa-calendar-alt text-spice-brown dark:text-teal-400 mr-2"></i>
              <span className="text-sm font-medium text-charcoal dark:text-white">Seasonal Specialties</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center px-4 py-2 bg-spice-brown/20 dark:bg-teal-400/20 backdrop-blur-sm rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <i className="fas fa-star text-spice-brown dark:text-teal-400 mr-2"></i>
              <span className="text-sm font-medium text-charcoal dark:text-white">Festive Occasions</span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-charcoal/70 dark:text-white/70"
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