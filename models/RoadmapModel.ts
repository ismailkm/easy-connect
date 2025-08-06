import { LearningLine, RoadmapInterface, StageInterface } from '@/types/RoadmapInterface';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ROADMAPS_STORAGE_KEY = 'roadmaps';

export const RoadmapModel =  {
  
  /**
   * Retrieves the entire list of all roadmaps the user has created.
   * @returns A promise that resolves to an array of Roadmap objects, or an empty array if none exist.
   */
  async getRoadmaps(): Promise<RoadmapInterface[]> { // Corrected return type
    try {
      const roadmapsJson = await AsyncStorage.getItem(ROADMAPS_STORAGE_KEY);
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
      await AsyncStorage.setItem(ROADMAPS_STORAGE_KEY, JSON.stringify(updatedRoadmaps));
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
      await AsyncStorage.setItem(ROADMAPS_STORAGE_KEY, JSON.stringify(updatedList));
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
      await AsyncStorage.setItem(ROADMAPS_STORAGE_KEY, JSON.stringify(filteredList));
    } catch (error) {
      console.error('Error deleting roadmap:', error);
    }
  },

  /**
   * Retrieves the data for one single, specific stage by its ID.
   * @param id The ID of the stage to retrieve.
   * @returns A promise that resolves to the found stage object, or null if not found.
   */
  async getStageById(stageId: string): Promise<StageInterface | null> {
    const roadmaps = await this.getRoadmaps();
    for (const roadmap of roadmaps) {
      const foundStage = roadmap.stages.find(stage => stage.id === stageId);
      if (foundStage) {
        return foundStage;
      }
    }
    return null;
  },

  /**
   * Saves learning materials to a specific stage within a roadmap.
   * @param stageId The ID of the stage to update.
   * @param learningMaterials The array of learning materials to save.
   */
  async saveLearningMaterialsToStage(
    stageId: string,
    learningMaterials: LearningLine[]
  ): Promise<void> {
    try {
      const roadmaps = await this.getRoadmaps();
      let foundRoadmap: RoadmapInterface | null = null;
      let foundStage: StageInterface | null = null;

      for (const roadmap of roadmaps) {
        const stage = roadmap.stages.find(s => s.id === stageId);
        if (stage) {
          foundRoadmap = roadmap;
          foundStage = stage;
          break;
        }
      }

      if (!foundRoadmap || !foundStage) {
        throw new Error(`Stage ${stageId} not found in any roadmap`);
      }

      const updatedStages = foundRoadmap.stages.map(s =>
        s.id === stageId ? { ...s, learningMaterials: learningMaterials } : s
      );

      const updatedRoadmap = { ...foundRoadmap, stages: updatedStages };
      await this.updateRoadmap(updatedRoadmap);
      console.log(`Learning materials saved for stage ${stageId}`);
    } catch (error) {
      console.error('Error saving learning materials to stage:', error);
    }
  }
  
}