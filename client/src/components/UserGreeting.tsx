import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface UserGreetingProps {
  timeOfDay: string;
  day: string;
}

const UserGreeting = ({ timeOfDay, day }: UserGreetingProps) => {
  const [greeting, setGreeting] = useState("");
  
  useEffect(() => {
    // Set greeting based on time of day
    if (timeOfDay === "Morning") {
      setGreeting("Good Morning");
    } else if (timeOfDay === "Afternoon") {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
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

  return (
    <motion.div
      className="container mx-auto px-4 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="bg-cream/60 dark:bg-slate-800 backdrop-blur-sm border-none shadow-md">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 mb-2">
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
              {greeting}, <span className="text-deep-saffron dark:text-marigold">Foodie!</span>
            </h2>
          </div>
          
          <p className="text-spice-brown dark:text-cream/80 font-nunito ml-12">
            It's {day} {timeOfDay}. {getSuggestionText()}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserGreeting;