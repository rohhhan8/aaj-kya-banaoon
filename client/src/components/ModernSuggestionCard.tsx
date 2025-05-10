import { motion } from "framer-motion";
import { DishTag } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModernSuggestionCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  tags: DishTag[];
  index: number;
  onSeeMore: () => void;
}

const ModernSuggestionCard = ({ 
  id, 
  name, 
  description, 
  imageUrl, 
  tags, 
  index, 
  onSeeMore 
}: ModernSuggestionCardProps) => {
  
  // Map tag to its corresponding icon
  const getTagIcon = (tag: DishTag): string => {
    const tagIcons: Record<DishTag, string> = {
      "Healthy": "fas fa-heart",
      "Light": "fas fa-feather",
      "Spicy": "fas fa-pepper-hot",
      "Quick": "fas fa-bolt",
      "Festive": "fas fa-birthday-cake",
      "Protein": "fas fa-drumstick-bite",
      "Probiotic": "fas fa-bacteria",
      "One-pot": "fas fa-utensil-spoon",
      "Balanced": "fas fa-balance-scale"
    };
    
    return tagIcons[tag] || "fas fa-tag";
  };

  return (
    <motion.div 
      className="h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden h-full bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 border-none flex flex-col">
        <div className="aspect-video relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={`${name} dish`} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <motion.div 
                className="flex flex-wrap gap-1" 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {tags.map((tag, i) => (
                  <Badge 
                    key={`${id}-tag-${i}`} 
                    variant="outline" 
                    className="bg-white/20 text-white backdrop-blur-sm border-none text-xs"
                  >
                    <i className={`${getTagIcon(tag)} mr-1`}></i> {tag}
                  </Badge>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-5 flex-grow">
          <h3 className="font-playfair font-bold text-xl text-charcoal dark:text-white mb-3">{name}</h3>
          <p className="text-sm text-spice-brown dark:text-slate-300 font-nunito line-clamp-3">{description}</p>
        </CardContent>
        
        <CardFooter className="p-5 pt-0">
          <Button 
            variant="ghost" 
            className="p-0 hover:bg-transparent text-saffron dark:text-marigold hover:text-deep-saffron dark:hover:text-deep-saffron font-medium flex items-center w-full justify-start"
            onClick={onSeeMore}
          >
            <span>See similar dishes</span>
            <i className="fas fa-arrow-right ml-2 text-xs"></i>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ModernSuggestionCard;