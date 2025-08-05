import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';

interface DashboardButtonProps {
  iconName: IconSymbolName;
  title: string;
  subtitle: string;
  onPress: () => void;
  startColor: string;
  endColor: string;
}

export function DashboardButton({
  iconName,
  title,
  subtitle,
  onPress,
  startColor,
  endColor,
}: DashboardButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <LinearGradient
        colors={[startColor, endColor]}
        style={styles.button}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
      <View style={styles.iconContainer}>
        <IconSymbol name={iconName} size={35} color={Colors.light.background} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.buttonTitle}>{title}</Text>
        <Text style={styles.buttonSubtitle}>{subtitle}</Text>
      </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 15,
  },
  button: {
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonTitle: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSubtitle: {
    color: Colors.light.background,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600'
  },
});