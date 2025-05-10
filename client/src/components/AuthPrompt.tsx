import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from "@/lib/authContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface AuthPromptProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'filter' | 'tiffin' | 'favorite' | 'occasion';
}

const AuthPrompt = ({ isOpen, onClose, reason }: AuthPromptProps) => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
    onClose();
  };

  const handleContinueAsGuest = () => {
    // Save in local storage that they've seen this prompt
    localStorage.setItem('guestAccess', 'true');
    onClose();
  };

  const getReasonText = () => {
    switch (reason) {
      case 'filter':
        return "to save your preferred filters";
      case 'tiffin':
        return "to save your tiffin preferences";
      case 'favorite':
        return "to save your favorite dishes";
      case 'occasion':
        return "to customize special occasion suggestions";
      default:
        return "to unlock all features";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">Sign in to RasaRoots</DialogTitle>
              <DialogDescription className="text-center">
                Join our community {getReasonText()} and get personalized recommendations based on your household preferences.
              </DialogDescription>
            </DialogHeader>
          
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex flex-col items-center gap-4">
                <Button 
                  onClick={handleSignIn} 
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <motion.div 
                        className="h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg 
                        className="w-5 h-5" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </Button>
                
                <div className="relative flex items-center w-full">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleContinueAsGuest}
                  className="w-full"
                >
                  Continue as Guest
                </Button>
              </div>
            </div>
            
            <DialogFooter className="text-xs text-center text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AuthPrompt;