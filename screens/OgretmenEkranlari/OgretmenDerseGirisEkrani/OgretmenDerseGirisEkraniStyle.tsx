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
    fontSize:20,
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
    display:'flex'
  },
  button: {
    backgroundColor: '#1E9D4C',
    marginTop:15,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  buttonOutline: {
    width: '100%',
    paddingHorizontal: 35,
    paddingVertical:15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 35,
    borderColor: '#1E9D4C',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 15,
  },
  buttonOutlineText: {
    color: '#1E9D4C',
    fontWeight: '700',
    fontSize: 16,
  },
});

  export default styles;