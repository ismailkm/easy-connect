import { RoadmapInterface } from '@/types/RoadmapInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ROADMAPS_KEY = 'roadmaps';

export const RoadmapModel =  {
  
  /**
   * Retrieves the entire list of all roadmaps the user has created.
   * @returns A promise that resolves to an array of Roadmap objects, or an empty array if none exist.
   */
  async getRoadmaps(): Promise<RoadmapInterface[]> { // Corrected return type
    try {
      const roadmapsJson = await AsyncStorage.getItem(ROADMAPS_KEY);
      if (roadmapsJson) {
        const roadmaps = JSON.parse(roadmapsJson);
        return Array.isArray(roadmaps) ? roadmaps : [];
      }
      return [];
    } catch (error) {
      console.error('Error getting roadmaps from storage:', error);
      return [];
    }
  },

  /**
   * Adds a newly generated roadmap to the existing list.
   * @param newRoadmap The new Roadmap object to add.
   */
  async addRoadmap(newRoadmap: RoadmapInterface | null): Promise<void> {
    try {
      const currentRoadmaps = await this.getRoadmaps();
      const updatedRoadmaps = [...currentRoadmaps, newRoadmap]; 
      await AsyncStorage.setItem(ROADMAPS_KEY, JSON.stringify(updatedRoadmaps));
    } catch (error) {
      console.error('Error adding roadmap:', error);
    }
  },

  /**
   * Retrieves the data for one single, specific roadmap by its ID.
   * @param id The ID of the roadmap to retrieve.
   * @returns A promise that resolves to the found Roadmap object, or null if not found.
   */
  async getRoadmapById(id: string): Promise<RoadmapInterface | null> {
    try {
      const roadmaps = await this.getRoadmaps();
      return roadmaps?.find(roadmap => roadmap.id === id) || null;
    } catch (error) {
      console.error('Error getting roadmap by ID:', error);
      return null;
    }
  },

  /**
   * Saves changes to a specific roadmap.
   * @param updatedRoadmap The Roadmap object with updated data.
   */
  async updateRoadmap(updatedRoadmap: RoadmapInterface): Promise<void> {
    try {
      const currentRoadmaps = await this.getRoadmaps();
      const updatedList = currentRoadmaps?.map(roadmap =>
        roadmap.id === updatedRoadmap.id ? updatedRoadmap : roadmap
      );
      await AsyncStorage.setItem(ROADMAPS_KEY, JSON.stringify(updatedList));
    } catch (error) {
      console.error('Error updating roadmap:', error);
    }
  },

  /**
   * Deletes a roadmap from the list by its ID.
   * @param id The ID of the roadmap to delete.
   */
  async deleteRoadmap(id: string): Promise<void> {
    try {
      const currentRoadmaps = await this.getRoadmaps();
      const filteredList = currentRoadmaps?.filter(roadmap => roadmap.id !== id);
      await AsyncStorage.setItem(ROADMAPS_KEY, JSON.stringify(filteredList));
    } catch (error) {
      console.error('Error deleting roadmap:', error);
    }
  }
}