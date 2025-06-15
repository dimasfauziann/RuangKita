import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainApp'>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

type User = {
  username: string;
  name: string;
  email: string;
  departemen: string;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/images/avatar.png')} // Ganti dengan URL atau ikon default
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.infoSection}>
          <InfoRow label="Username" value={user.username} />
          <InfoRow label="Departemen" value={user.departemen} />
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  infoSection: {
    width: '100%',
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
});
