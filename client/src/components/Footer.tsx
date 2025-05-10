import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-charcoal text-off-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <motion.div 
            className="mb-6 md:mb-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair text-2xl font-bold mb-4">Contextual Cooking Guide</h2>
            <p className="font-nunito text-cream/80 max-w-md">Your AI-powered assistant for deciding what to cook for every situation in Indian households.</p>
          </motion.div>
          <div className="grid grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-quicksand font-semibold text-lg mb-3">Features</h3>
              <ul className="font-nunito space-y-2">
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">Daily Suggestions</a></li>
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">Special Occasions</a></li>
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">Cultural Context</a></li>
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">Personalization</a></li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-quicksand font-semibold text-lg mb-3">Connect</h3>
              <ul className="font-nunito space-y-2">
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">About Us</a></li>
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">Feedback</a></li>
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-cream/70 hover:text-mint-green transition-colors">Contact</a></li>
              </ul>
            </motion.div>
          </div>
        </div>
        <motion.div 
          className="border-t border-gray-700 mt-8 pt-8 text-center font-nunito text-cream/60 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p>&copy; {new Date().getFullYear()} Contextual Cooking Guide. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
