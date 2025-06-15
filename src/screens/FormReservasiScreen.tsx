import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { format } from 'date-fns';

import type { StackScreenProps } from '@react-navigation/stack';

type RootStackParamList = {
  FormReservasiScreen: {
    mode?: 'create' | 'edit';
    data?: any;
    selectedRoom?: string;
    selectedDate?: Date;
  };
};

type Props = StackScreenProps<RootStackParamList, 'FormReservasiScreen'>;

const PRIMARY = "#1976d2";
const SECONDARY = "#2196f3";
const SURFACE = "#fff";
const BORDER = "#dbeafe";

const FormReservasiScreen: React.FC<Props> = ({ route, navigation }) => {
  const {
    mode = 'create',
    data = null,
    selectedRoom = '',
    selectedDate = null,
  } = route.params || {};

  const [tanggal, setTanggal] = useState<Date>(new Date());
  const [mulai, setMulai] = useState<Date>(new Date());
  const [selesai, setSelesai] = useState<Date>(new Date());
  const [acara, setAcara] = useState('');
  const [ruangan, setRuangan] = useState('');
  const [showTanggal, setShowTanggal] = useState(false);
  const [showMulai, setShowMulai] = useState(false);
  const [showSelesai, setShowSelesai] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && data) {
      setRuangan(data.ruangan);
      setTanggal(new Date(data.tanggal));
      setMulai(new Date(`${data.tanggal}T${data.waktuMulai}`));
      setSelesai(new Date(`${data.tanggal}T${data.waktuSelesai}`));
      setAcara(data.acara);
    } else {
      if (selectedRoom) setRuangan(selectedRoom);
      if (selectedDate) setTanggal(new Date(selectedDate));
    }
  }, [mode, data, selectedRoom, selectedDate]);

  const handleSubmit = async () => {
    if (!ruangan || !acara) {
      Alert.alert('Validasi', 'Semua field wajib diisi!');
      return;
    }

    const userData = await AsyncStorage.getItem('user');
    const userObj = userData ? JSON.parse(userData) : null;

    const booking = {
      id: mode === 'edit' ? data.id : uuid.v4(),
      ruangan,
      tanggal: format(tanggal, 'yyyy-MM-dd'),
      waktuMulai: format(mulai, 'HH:mm'),
      waktuSelesai: format(selesai, 'HH:mm'),
      acara,
      createdBy: data?.createdBy || userObj?.email || "unknown"
    };

    const bookingsRaw = await AsyncStorage.getItem('bookings');
    const existing = bookingsRaw ? JSON.parse(bookingsRaw) : [];

    const bentrok = existing.some((item: any) => {
      if (mode === 'edit' && item.id === data.id) return false;
      if (item.ruangan !== booking.ruangan || item.tanggal !== booking.tanggal) return false;

      const mulaiBaru = new Date(`${booking.tanggal}T${booking.waktuMulai}`);
      const selesaiBaru = new Date(`${booking.tanggal}T${booking.waktuSelesai}`);
      const mulaiLama = new Date(`${item.tanggal}T${item.waktuMulai}`);
      const selesaiLama = new Date(`${item.tanggal}T${item.waktuSelesai}`);

      return mulaiBaru < selesaiLama && selesaiBaru > mulaiLama;
    });

    if (bentrok) {
      Alert.alert('Bentrok!', 'Waktu yang dipilih bentrok dengan booking lain.');
      return;
    }

    const updated = mode === 'edit'
      ? existing.map((item: any) => (item.id === data.id ? booking : item))
      : [...existing, booking];

    await AsyncStorage.setItem('bookings', JSON.stringify(updated));
    Alert.alert('Sukses', mode === 'edit' ? 'Reservasi berhasil diperbarui!' : 'Reservasi berhasil ditambahkan!');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: SURFACE }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formBox}>
          <Text style={styles.title}>{mode === 'edit' ? 'Edit Reservasi' : 'Buat Reservasi'}</Text>

          <Text style={styles.labelInput}>Ruangan</Text>
          <TextInput
            placeholder="Masukkan nama ruangan"
            placeholderTextColor="#aaa"
            value={ruangan}
            onChangeText={setRuangan}
            style={styles.input}
          />

          <Text style={styles.labelInput}>Nama Acara</Text>
          <TextInput
            placeholder="Masukkan nama acara"
            placeholderTextColor="#aaa"
            value={acara}
            onChangeText={setAcara}
            style={styles.input}
          />

          <Text style={styles.labelInput}>Tanggal</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowTanggal(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.timeButtonText}>
              {format(tanggal, 'dd MMM yyyy')}
            </Text>
          </TouchableOpacity>
          {showTanggal && (
            <DateTimePicker
              value={tanggal}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => {
                setShowTanggal(false);
                if (date) setTanggal(date);
              }}
            />
          )}

          <Text style={styles.labelInput}>Jam Mulai</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowMulai(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.timeButtonText}>
              {format(mulai, 'HH:mm')}
            </Text>
          </TouchableOpacity>
          {showMulai && (
            <DateTimePicker
              value={mulai}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => {
                setShowMulai(false);
                if (date) setMulai(date);
              }}
            />
          )}

          <Text style={styles.labelInput}>Jam Selesai</Text>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => setShowSelesai(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.timeButtonText}>
              {format(selesai, 'HH:mm')}
            </Text>
          </TouchableOpacity>
          {showSelesai && (
            <DateTimePicker
              value={selesai}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => {
                setShowSelesai(false);
                if (date) setSelesai(date);
              }}
            />
          )}

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>
              {mode === 'edit' ? 'Update' : 'Simpan Reservasi'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormReservasiScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: SURFACE,
    paddingVertical: 24,
  },
  formBox: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#1976d2',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: BORDER,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: PRIMARY,
    textAlign: 'center',
    marginBottom: 18,
    letterSpacing: 0.5,
  },
  labelInput: {
    color: PRIMARY,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#f8fafc",
    color: '#1e293b',
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 8,
    marginBottom: 2,
    fontSize: 16,
  },
  timeButton: {
    backgroundColor: "#e3f2fd",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 2,
  },
  timeButtonText: {
    color: PRIMARY,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  submitBtn: {
    marginTop: 28,
    backgroundColor: SECONDARY,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    elevation: 2,
    shadowColor: SECONDARY,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

