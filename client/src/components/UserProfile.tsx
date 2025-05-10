import { useAuth } from "@/lib/authContext";
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Get first letter of display name or email for fallback avatar
  const getFallbackInitial = () => {
    if (user.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="bg-transparent border-none cursor-pointer p-0 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Avatar className="h-9 w-9 border-2 border-mint-green dark:border-teal-400">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
            ) : (
              <AvatarFallback className="bg-mint-green/20 text-mint-green dark:bg-teal-700/20 dark:text-teal-400">
                {getFallbackInitial()}
              </AvatarFallback>
            )}
          </Avatar>
        </motion.button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium">{user.displayName || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={() => window.location.href="/dashboard"}>
          Dashboard
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className="cursor-pointer" 
          onClick={() => window.location.href="/dashboard?tab=favorites"}>
          Saved Recipes
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:text-destructive" 
          onClick={logout}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;