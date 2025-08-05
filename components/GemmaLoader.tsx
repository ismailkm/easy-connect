import { Text, View } from '@/components/Themed';
import { useGemma } from '@/context/GemmaProvider';
import { useRootNavigationState, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Modal, StyleSheet } from 'react-native';

export const GemmaLoader = () => {
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { loadModel, unloadModel, isLoadingModel } = useGemma();

  // Routes that where the model has to be unloaded
  const dumbRoutes = [
    '(tabs)/practice-english',
    'translate/select-image',
  ];

  // Routes that where the model has to be loaded
  const smartRoutes = [
    'create-roadmap',
    'preview-translate',
    '(tabs)/ask-about-uk-life',
    'lesson/[id]',
  ];


  useEffect(() => {
    if (!navigationState?.key) return;

    const currentPath = segments.join('/');
    const isCurrentlyOnDumbRoute = dumbRoutes.some(route => currentPath.startsWith(route));
    const isCurrentlyOnSmartRoute = smartRoutes.some(route => currentPath.startsWith(route));

    if (isCurrentlyOnDumbRoute) {
      console.log("isCurrentlyOnDumbRoute")
      unloadModel();
    } else if(isCurrentlyOnSmartRoute) {
      console.log("isCurrentlyOnSmartRoute")
      loadModel();
    } 

  }, [segments, navigationState?.key]);

  const currentPath = segments.join('/');
  const isSmartRouteActive = smartRoutes.some(route => currentPath.startsWith(route));
  
  const shouldShowLoader = isLoadingModel && isSmartRouteActive;

  if (!shouldShowLoader) {
    return null;
  }

  return (
    <Modal transparent={true} visible={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>Loading AI Tutor...</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  },
  loaderContainer: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  loaderText: {
    color: '#ffffff',
    marginTop: 15,
    fontSize: 16,
  },
});