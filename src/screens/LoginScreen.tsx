import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { Formik } from 'formik';
import * as Yup from 'yup';

import personIcon from '../assets/images/person.png';
import lockIcon from '../assets/images/lock.png';
import eyeIcon from '../assets/images/eye.png';
import eyeOffIcon from '../assets/images/eye-off.png';
import logo from '../assets/images/logo.png';
import { styles } from '../style/LoginScreen.styles.tsx';

type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username wajib diisi'),
  password: Yup.string().required('Password wajib diisi'),
});

const dummyUsers: Record<
  string,
  { password: string; name: string; email: string; departemen: string }
> = {
  zyon: {
    password: '12345',
    name: 'Zyon Alexander',
    email: 'zyonalexander@gmail.com',
    departemen: 'Information Technology',
  },
  admin: {
    password: '12345',
    name: 'Admin',
    email: 'admin@gmail.com',
    departemen: 'Manajemen',
  },
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        navigation.replace('MainApp');
      }
    };
    checkLogin();
  }, [navigation]);

  const handleLogin = async (values: { username: string; password: string }) => {
    const user = dummyUsers[values.username.toLowerCase()];
    if (user && user.password === values.password) {
      const userData = {
        username: values.username,
        name: user.name,
        email: user.email,
        departemen: user.departemen,
      };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      navigation.replace('MainApp');
    } else {
      Alert.alert('Login gagal', 'Username atau password salah');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Selamat Datang</Text>
        <Text style={styles.subtitle}>Silakan masuk untuk melanjutkan</Text>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <View style={styles.inputWrapper}>
                <Image source={personIcon} style={styles.iconImage} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#888"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {touched.username && errors.username && (
                <Text style={styles.error}>{errors.username}</Text>
              )}

              <View style={styles.inputWrapper}>
                <Image source={lockIcon} style={styles.iconImage} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  activeOpacity={0.7}
                >
                  <Image
                    source={showPassword ? eyeIcon : eyeOffIcon}
                    style={styles.eyeImage}
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              <TouchableOpacity
                onPress={handleSubmit as any}
                style={styles.button}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Masuk</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;


