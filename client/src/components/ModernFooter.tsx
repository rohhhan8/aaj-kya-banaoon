import { motion } from "framer-motion";
import { Link } from "wouter";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <motion.div 
            className="max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-playfair font-bold mb-4">
              Rasa<span className="text-mint-green">Roots</span>
            </h2>
            <p className="text-slate-300 font-nunito mb-6">
              Your AI-driven cooking companion for Indian households. Discover the perfect dishes based on time, day, and special occasions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-mint-green/20 transition-colors">
                <i className="fab fa-instagram text-mint-green"></i>
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-mint-green/20 transition-colors">
                <i className="fab fa-facebook-f text-mint-green"></i>
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-mint-green/20 transition-colors">
                <i className="fab fa-twitter text-mint-green"></i>
              </a>
              <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-mint-green/20 transition-colors">
                <i className="fab fa-pinterest text-mint-green"></i>
              </a>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-quicksand font-semibold text-lg mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-slate-300 hover:text-mint-green transition-colors">Home</Link></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Daily Recipes</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Festival Foods</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Seasonal Specials</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-quicksand font-semibold text-lg mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Our Story</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Team</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Careers</a></li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="col-span-2 md:col-span-1"
            >
              <h3 className="font-quicksand font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-slate-300 hover:text-mint-green transition-colors">Contact Us</a></li>
              </ul>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400 font-nunito text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>&copy; {currentYear} RasaRoots. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default ModernFooter;