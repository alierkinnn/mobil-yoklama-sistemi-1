import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddebe1',
    flex:1,
    paddingTop:50,
    alignItems: 'center',
  },
  hataTxt: {
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    fontSize:18,
  },
  logoContainer: {
    marginBottom: 20, 
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain', 
  },

  input: {
    backgroundColor: 'white',
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
    display:'flex',
    textAlign:'center',
  },
  button: {
    backgroundColor: '#1E9D4C',
    marginTop:15,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arka planı karartmak için opaklık
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

  export default styles;