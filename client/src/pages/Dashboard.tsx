import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import ThemeToggle from "@/components/ThemeToggle";
import { DishTag } from "@/lib/utils";
import {
  getUserPreferences,
  updatePreferredTags,
  updateFamilySize,
  updateRegionalPreferences,
  UserPreferences
} from "@/lib/userPreferences";

// This would ideally come from the backend
const mockFavorites = [
  {
    id: "1",
    name: "Chole Bhature",
    description: "A popular Punjabi dish consisting of spicy chickpea curry and deep-fried bread.",
    imageUrl: "https://source.unsplash.com/random/300x200/?chole",
    tags: ["Spicy", "Festive"] as DishTag[]
  },
  {
    id: "2",
    name: "Masala Dosa",
    description: "A South Indian thin crispy crepe filled with spiced potatoes.",
    imageUrl: "https://source.unsplash.com/random/300x200/?dosa",
    tags: ["Balanced", "One-pot"] as DishTag[]
  }
];

// Mock past interactions
const mockInteractions = [
  { 
    id: "1", 
    date: "2023-05-09", 
    mealType: "Breakfast", 
    dish: "Aloo Paratha",
    occasionOrDay: "Tuesday Morning" 
  },
  { 
    id: "2", 
    date: "2023-05-08", 
    mealType: "Dinner", 
    dish: "Butter Chicken",
    occasionOrDay: "Monday Evening" 
  },
  { 
    id: "3", 
    date: "2023-05-07", 
    mealType: "Lunch", 
    dish: "Rajma Chawal",
    occasionOrDay: "Sunday Afternoon" 
  }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [favorites, setFavorites] = useState(mockFavorites);
  const [interactions, setInteractions] = useState(mockInteractions);
  const [preferredTags, setPreferredTags] = useState<DishTag[]>(["Healthy", "Quick"]);
  const [familySize, setFamilySize] = useState(4);
  const [regionalPreferences, setRegionalPreferences] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<Record<string, boolean>>({
    "North Indian": false,
    "South Indian": false,
    "East Indian": false,
    "West Indian": false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    
    // Load user preferences
    const loadUserPreferences = async () => {
      if (user.uid) {
        setLoadingPreferences(true);
        try {
          const prefs = await getUserPreferences(user.uid);
          setPreferredTags(prefs.preferredTags);
          setFamilySize(prefs.familySize);
          
          // Set regional preferences
          if (prefs.regionalPreferences && prefs.regionalPreferences.length > 0) {
            setRegionalPreferences(prefs.regionalPreferences);
            
            // Update selectedRegions object
            const regions = {...selectedRegions};
            prefs.regionalPreferences.forEach(region => {
              if (region in regions) {
                regions[region] = true;
              }
            });
            setSelectedRegions(regions);
          }
        } catch (error) {
          console.error("Error loading preferences:", error);
        } finally {
          setLoadingPreferences(false);
        }
      }
    };
    
    loadUserPreferences();
    
    // Simulate API calls for favorites
    const timer = setTimeout(() => {
      setLoadingFavorites(false);
      // In a real application, these would be fetched from API
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleTagToggle = async (tag: DishTag) => {
    try {
      let newTags: DishTag[];
      
      if (preferredTags.includes(tag)) {
        newTags = preferredTags.filter(t => t !== tag);
      } else {
        newTags = [...preferredTags, tag];
      }
      
      setPreferredTags(newTags);
      
      // Save to database if user is logged in
      if (user?.uid) {
        await updatePreferredTags(user.uid, newTags);
        toast({
          title: "Success",
          description: "Preferences updated"
        });
      }
    } catch (error) {
      console.error("Error updating preferred tags:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences",
        variant: "destructive"
      });
    }
  };

  const handleFamilySizeChange = async (newSize: number) => {
    try {
      setFamilySize(newSize);
      
      // Save to database if user is logged in
      if (user?.uid) {
        await updateFamilySize(user.uid, newSize);
        toast({
          title: "Success",
          description: "Family size updated"
        });
      }
    } catch (error) {
      console.error("Error updating family size:", error);
      toast({
        title: "Error",
        description: "Failed to save family size",
        variant: "destructive"
      });
    }
  };

  const handleRegionToggle = async (region: string) => {
    try {
      const newSelectedRegions = {
        ...selectedRegions,
        [region]: !selectedRegions[region]
      };
      setSelectedRegions(newSelectedRegions);
      
      // Create array of selected regions
      const selected = Object.entries(newSelectedRegions)
        .filter(([_, isSelected]) => isSelected)
        .map(([name]) => name);
      
      setRegionalPreferences(selected);
      
      // Save to database if user is logged in
      if (user?.uid) {
        await updateRegionalPreferences(user.uid, selected);
        toast({
          title: "Success",
          description: "Regional preferences updated"
        });
      }
    } catch (error) {
      console.error("Error updating regional preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save regional preferences",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
    // In a real app, you would call an API to remove from favorites
  };

  const handleSaveAllPreferences = async () => {
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      // Save all preferences at once
      await updatePreferredTags(user.uid, preferredTags);
      await updateFamilySize(user.uid, familySize);
      await updateRegionalPreferences(user.uid, regionalPreferences);
      
      toast({
        title: "Success",
        description: "Your preferences have been saved",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-mint-green dark:border-teal-400">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || "User"} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-mint-green/20 text-mint-green dark:bg-teal-700/20 dark:text-teal-400 text-xl font-bold">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-deep-saffron dark:text-teal-400">
                {user.displayName ? `Welcome, ${user.displayName.split(' ')[0]}!` : 'Welcome!'}
              </h1>
              <p className="text-sm text-muted-foreground">Manage your cooking preferences</p>
            </div>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="border-charcoal dark:border-white/20 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Back to Home
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{user.displayName || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account created:</span>
                    <span className="font-medium">
                      {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" onClick={logout}>Sign Out</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent meal suggestions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactions.map(interaction => (
                    <div key={interaction.id} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{interaction.dish}</p>
                        <p className="text-sm text-muted-foreground">{interaction.mealType} • {interaction.occasionOrDay}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(interaction.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Activity</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            {loadingFavorites ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-mint-green border-t-transparent rounded-full"></div>
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map(favorite => (
                  <Card key={favorite.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={favorite.imageUrl} 
                        alt={favorite.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{favorite.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {favorite.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs py-1 px-2 rounded-full bg-mint-green/10 text-mint-green dark:bg-teal-700/20 dark:text-teal-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{favorite.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFavorite(favorite.id)}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Favorites Yet</CardTitle>
                  <CardDescription>You haven't saved any favorite dishes yet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Start exploring recipes and save your favorites to see them here!
                  </p>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => navigate("/")} className="w-full">
                    Explore Recipes
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            {loadingPreferences ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-mint-green border-t-transparent rounded-full"></div>
              </div>
            ) : (
            <Card>
              <CardHeader>
                <CardTitle>Dietary Preferences</CardTitle>
                <CardDescription>Select your favorite meal types</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Preferred Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Healthy", "Light", "Spicy", "Quick", "Festive", "Protein", "Probiotic", "One-pot", "Balanced"].map((tag) => (
                      <Button
                        key={tag}
                        variant={preferredTags.includes(tag as DishTag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTagToggle(tag as DishTag)}
                        className={preferredTags.includes(tag as DishTag) ? "bg-mint-green text-white dark:bg-teal-600" : ""}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Family Size</h3>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={familySize <= 1}
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleFamilySizeChange(Math.max(1, familySize - 1))}
                    >
                      -
                    </Button>
                    <span className="font-medium mx-2">{familySize}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={familySize >= 8}
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleFamilySizeChange(Math.min(8, familySize + 1))}
                    >
                      +
                    </Button>
                    <span className="text-sm text-muted-foreground ml-2">people</span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Regional Preferences</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(selectedRegions).map(region => (
                      <Button 
                        key={region}
                        variant={selectedRegions[region] ? "default" : "outline"} 
                        className={`justify-start ${selectedRegions[region] ? "bg-mint-green text-white dark:bg-teal-600" : ""}`}
                        onClick={() => handleRegionToggle(region)}
                      >
                        {region}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  onClick={handleSaveAllPreferences} 
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardFooter>
            </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;