import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { format, isBefore, parse } from 'date-fns';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  FormReservasiScreen: { mode?: 'create' | 'edit'; data?: any };
  RequestScreen: undefined;
};

type RequestScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'RequestScreen'>;
};

interface Booking {
  id: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  ruangan: string;
  acara: string;
  createdBy: string;
}

const IconText = React.memo(({ icon, text }: { icon: any; text: string }) => (
  <View style={styles.iconRow}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.cardText}>{text}</Text>
  </View>
));

const RequestScreen: React.FC<RequestScreenProps> = ({ navigation }) => {
  const [bookingList, setBookingList] = useState<Booking[]>([]);
  const [user, setUser] = useState<any>(null);

  const icons = {
    calendar: require('../assets/images/calendar.png'),
    clock: require('../assets/images/clock.png'),
    building: require('../assets/images/building.png'),
    note: require('../assets/images/note.png'),
    user: require('../assets/images/user.png'),
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadData = async () => {
        try {
          const userData = await AsyncStorage.getItem('user');
          const bookings = await AsyncStorage.getItem('bookings');

          const userObj = userData ? JSON.parse(userData) : null;
          const bookingsArr = bookings ? JSON.parse(bookings) : [];
          const email = userObj?.email || 'zyon@example.com';

          const filtered = bookingsArr.filter(
            (item: Booking) => item.createdBy === email
          );
          setUser(userObj);
          setBookingList(filtered);
        } catch (error) {
          Alert.alert('Gagal memuat data', 'Terjadi kesalahan saat memuat data.');
        }
      };
      loadData();
    }, [])
  );

  const handleDelete = (id: string, waktuMulai: string, tanggal: string) => {
    const now = new Date();
    const bookingTime = parse(`${tanggal} ${waktuMulai}`, 'yyyy-MM-dd HH:mm', new Date());

    if (isBefore(bookingTime, now)) {
      Alert.alert('Tidak bisa menghapus', 'Waktu reservasi sudah lewat.');
      return;
    }

    Alert.alert('Hapus Reservasi', 'Yakin ingin menghapus reservasi ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        onPress: async () => {
          try {
            const allBookingsRaw = await AsyncStorage.getItem('bookings');
            let allBookings: Booking[] = allBookingsRaw ? JSON.parse(allBookingsRaw) : [];

            allBookings = allBookings.filter((item) => item.id !== id);
            await AsyncStorage.setItem('bookings', JSON.stringify(allBookings));

            const email = user?.email || 'zyon@example.com';
            setBookingList(allBookings.filter((item) => item.createdBy === email));
          } catch (error) {
            Alert.alert('Gagal menghapus', 'Terjadi kesalahan saat menghapus data.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const waktuMulai = parse(`${item.tanggal} ${item.waktuMulai}`, 'yyyy-MM-dd HH:mm', new Date());
    const isExpired = isBefore(waktuMulai, new Date());

    return (
      <View style={styles.card}>
        <IconText
          icon={icons.calendar}
          text={`${item.tanggal} | ${item.waktuMulai} - ${item.waktuSelesai}`}
        />
        <IconText icon={icons.building} text={item.ruangan} />
        <IconText icon={icons.note} text={item.acara} />
        <IconText icon={icons.user} text={item.createdBy} />
        {isExpired && <Text style={styles.expiredLabel}>Sudah Lewat</Text>}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FormReservasiScreen', { mode: 'edit', data: item })}
            disabled={isExpired}
            style={[styles.btn, { backgroundColor: isExpired ? '#ccc' : '#007bff' }]}
          >
            <Text style={styles.btnText}>Ubah</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.waktuMulai, item.tanggal)}
            disabled={isExpired}
            style={[styles.btn, { backgroundColor: isExpired ? '#ccc' : '#ff5c5c' }]}
          >
            <Text style={styles.btnText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reservasi Saya</Text>
      <FlatList
        data={bookingList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada reservasi dibuat.</Text>
        }
      />
    </View>
  );
};

export default RequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 8,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  btn: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    marginTop: 40,
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
  expiredLabel: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
    fontWeight: '500',
  },
});
