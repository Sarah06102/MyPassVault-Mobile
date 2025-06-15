import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { StyleSheet, Text, TouchableOpacity } from "react-native";


export default function CustomDrawerContent(props: any) {
    return (
      <DrawerContentScrollView {...props} style={styles.container}>
        <MenuItem icon="key" label="Dashboard" onPress={() => props.navigation.navigate('Dashboard')} />
        <MenuItem icon="shield-checkmark" label="Security" onPress={() => props.navigation.navigate('Security')} />
        <MenuItem icon="settings" label="Settings" onPress={() => props.navigation.navigate('Settings')} />
        <MenuItem icon="help-circle" label="Help" onPress={() => props.navigation.navigate('Help')} />
      </DrawerContentScrollView>
    );
  }
  
    const MenuItem = ({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
        <Ionicons name={icon} size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#7C3AED',
      flex: 1,
      paddingTop: 40,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      paddingLeft: 20,
    },
    icon: {
      marginRight: 20,
    },
    label: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
});
  