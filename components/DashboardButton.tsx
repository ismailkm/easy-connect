import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import { IconSymbol, IconSymbolName } from './ui/IconSymbol';

interface DashboardButtonProps {
  iconName: IconSymbolName;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function DashboardButton({
  iconName,
  title,
  subtitle,
  onPress,
}: DashboardButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.buttonRight}>
        <IconSymbol name={iconName} size={40} color="white" />
      </View>
      <View style={styles.buttonLeft}>
        <Text style={styles.buttonTitle}>{title}</Text>
        <Text style={styles.buttonSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonRight: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonLeft: {
    flex: 3,
    backgroundColor: 'transparent',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.8,
  },
});