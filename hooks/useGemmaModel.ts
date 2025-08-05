import { useGemma } from '@/context/GemmaProvider';
import { useFocusEffect } from 'expo-router';
import React from 'react';

/**
 * A hook for "smart" screens that require the Gemma model.
 * It ensures the model is loaded when the screen is focused
 * and provides the loading and loaded status.
 */
export const useGemmaModelLoader = () => {
  const { isModelLoaded, isLoadingModel, loadModel } = useGemma();

  useFocusEffect(
    React.useCallback(() => {
        console.log("useGemmaModelLoader");
      // When the screen comes into focus, load the model.
      // The loadModel function in the provider is smart enough
      // not to reload if it's already loaded.
      loadModel();
    }, [loadModel])
  );

  return { isModelLoaded, isLoadingModel };
};


/**
 * A hook for "dumb" screens that DO NOT need the Gemma model.
 * It ensures the model is unloaded when the screen is focused
 * to free up memory.
 */
export const useGemmaModelUnloader = () => {
  const { isModelLoaded, unloadModel } = useGemma();

  useFocusEffect(
    React.useCallback(() => {
        console.log("useGemmaModelUnloader");
      // When this screen comes into focus, if the model is loaded, unload it.
      if (isModelLoaded) {
        unloadModel();
      }
    }, [isModelLoaded, unloadModel])
  );
};