import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f6ff',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  innerContainer: {
    backgroundColor: 'white',
    padding: 28,
    borderRadius: 16,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  iconImage: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  eyeImage: {
    width: 20,
    height: 20,
    tintColor: '#888',
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#222',
  },
  error: {
    color: '#d93025',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});