import { motion } from "framer-motion";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

const LoadingSpinner = ({ 
  size = "md", 
  color = "text-saffron dark:text-marigold" 
}: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const dotVariants = {
    initial: { scale: 0 },
    animate: (i: number) => ({
      scale: [0, 1, 0],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut",
      }
    })
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`flex items-center justify-center space-x-2 ${sizeClasses[size]}`}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`w-2 h-2 rounded-full ${color}`}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            custom={i}
          />
        ))}
      </div>
      
      <motion.div
        className="ml-3 font-quicksand text-charcoal dark:text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        Loading delicious suggestions...
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;