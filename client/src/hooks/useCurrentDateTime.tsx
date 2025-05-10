import { useState, useEffect } from "react";
import { mealTimeByHour } from "@/lib/utils";

const useCurrentDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState({
    day: "",
    timeOfDay: "",
  });

  useEffect(() => {
    const updateDateTime = () => {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const now = new Date();
      const day = days[now.getDay()];
      const hour = now.getHours();
      const timeOfDay = mealTimeByHour(hour);
      
      setCurrentDateTime({
        day,
        timeOfDay,
      });
    };
    
    // Initialize
    updateDateTime();
    
    // Update every minute
    const interval = setInterval(updateDateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return currentDateTime;
};

export default useCurrentDateTime;
