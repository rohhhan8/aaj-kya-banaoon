import { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface FamilySizeSelectorProps {
  familySize: number;
  onChange: (size: number) => void;
}

const FamilySizeSelector = ({ familySize, onChange }: FamilySizeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([familySize]);

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue);
  };

  const handleApply = () => {
    onChange(value[0]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div 
          className="inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="outline" 
            className="bg-white/80 dark:bg-slate-800 backdrop-blur-sm border-none hover:bg-white dark:hover:bg-slate-700 shadow-md rounded-full px-4"
          >
            <i className="fas fa-user-friends text-saffron dark:text-marigold mr-2"></i>
            <span className="font-quicksand font-medium text-charcoal dark:text-white">Family of {familySize}</span>
          </Button>
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6">
        <div className="space-y-4">
          <h3 className="font-quicksand font-bold text-lg text-charcoal dark:text-white">Family Size</h3>
          <p className="text-spice-brown dark:text-slate-300 text-sm font-nunito">Adjust the number of people you're cooking for</p>
          
          <div className="py-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-spice-brown dark:text-slate-400">1</span>
              <span className="text-xs font-medium text-spice-brown dark:text-slate-400">8+</span>
            </div>
            <Slider
              value={value}
              min={1}
              max={8}
              step={1}
              onValueChange={handleValueChange}
              className="my-4"
            />
            <div className="flex items-center justify-center">
              <span className="text-4xl font-bold text-saffron dark:text-marigold">{value[0]}</span>
              <span className="ml-2 text-lg text-charcoal dark:text-white font-quicksand">
                {value[0] === 1 ? 'Person' : 'People'}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleApply} className="bg-saffron hover:bg-deep-saffron text-white">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FamilySizeSelector;