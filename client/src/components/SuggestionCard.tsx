import { motion } from "framer-motion";
import { DishTag } from "@/lib/utils";

interface SuggestionCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: DishTag[];
  index: number;
  onSeeMore: () => void;
}

const SuggestionCard = ({ id, name, description, imageUrl, tags, index, onSeeMore }: SuggestionCardProps) => {
  // Map tag to its corresponding icon
  const getTagIcon = (tag: DishTag): string => {
    const tagIcons: Record<DishTag, string> = {
      "Healthy": "fas fa-apple-alt",
      "Light": "fas fa-feather",
      "Spicy": "fas fa-fire",
      "Quick": "fas fa-bolt",
      "Festive": "fas fa-birthday-cake",
      "Protein": "fas fa-fire",
      "Probiotic": "fas fa-apple-alt",
      "One-pot": "fas fa-bolt",
      "Balanced": "fas fa-feather"
    };
    
    return tagIcons[tag] || "fas fa-tag";
  };

  return (
    <motion.div 
      className="card bg-white rounded-xl overflow-hidden shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      <img src={imageUrl} alt={`${name} dish`} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="font-playfair font-bold text-xl text-charcoal mb-2">{name}</h3>
        <div className="flex flex-wrap items-center mb-4 gap-2">
          {tags.slice(0, 2).map((tag, i) => (
            <span key={`${id}-tag-${i}`} className="bg-mint-green/30 text-charcoal text-xs font-quicksand px-2 py-1 rounded-full">
              <i className={`${getTagIcon(tag)} mr-1`}></i> {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-spice-brown font-nunito mb-3">{description}</p>
        <button 
          onClick={onSeeMore}
          className="text-tomato-red hover:text-warm-orange font-quicksand font-medium transition-colors flex items-center"
        >
          <span>See more like this</span>
          <i className="fas fa-chevron-right ml-1 text-xs"></i>
        </button>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
