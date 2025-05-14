import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { DishTag } from './utils';

export interface UserPreferences {
  preferredTags: DishTag[];
  familySize: number;
  regionalPreferences: string[];
}

const DEFAULT_PREFERENCES: UserPreferences = {
  preferredTags: ['Healthy', 'Quick'],
  familySize: 4,
  regionalPreferences: []
};

export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists() && userDoc.data().preferences) {
      return userDoc.data().preferences as UserPreferences;
    } else {
      // If user doesn't have preferences yet, create default ones
      await setDoc(userDocRef, { preferences: DEFAULT_PREFERENCES }, { merge: true });
      return DEFAULT_PREFERENCES;
    }
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

export const saveUserPreferences = async (
  userId: string, 
  preferences: Partial<UserPreferences>
): Promise<boolean> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      // Get current preferences or use default
      const currentPrefs = userDoc.data().preferences || DEFAULT_PREFERENCES;
      
      // Create merged preferences object
      const updatedPrefs = {
        ...currentPrefs,
        ...preferences
      };
      
      // Update document with the merged preferences
      await updateDoc(userDocRef, { preferences: updatedPrefs });
    } else {
      // Create new document with default preferences plus updates
      await setDoc(userDocRef, { 
        preferences: {
          ...DEFAULT_PREFERENCES,
          ...preferences
        }
      });
    }
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    return false;
  }
};

// Helper functions for specific preference updates
export const updateFamilySize = async (userId: string, size: number): Promise<boolean> => {
  return saveUserPreferences(userId, { familySize: size });
};

export const updatePreferredTags = async (userId: string, tags: DishTag[]): Promise<boolean> => {
  return saveUserPreferences(userId, { preferredTags: tags });
};

export const updateRegionalPreferences = async (userId: string, regions: string[]): Promise<boolean> => {
  return saveUserPreferences(userId, { regionalPreferences: regions });
}; 