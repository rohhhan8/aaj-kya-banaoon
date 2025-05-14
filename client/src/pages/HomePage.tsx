import React from 'react';
import { useNavigate } from 'react-router-dom';
import ModernHome from './ModernHome';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div>
      <ModernHome />
      
      <motion.div
        className="fixed bottom-6 right-6 z-50 group"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      >
        <Button 
          onClick={() => navigate('/ml-explorer')} 
          className="bg-gradient-to-tr from-saffron to-haldi dark:from-marigold dark:to-deep-saffron \
                     text-charcoal dark:text-white \
                     px-6 py-3 rounded-full shadow-xl hover:shadow-2xl \
                     flex items-center space-x-2 transform hover:scale-105 transition-all duration-300 ease-out"
          aria-label="Try ML Explorer"
        >
          <i className="fas fa-wand-magic-sparkles"></i>
          <span className="font-semibold">Try ML Explorer</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default HomePage; 