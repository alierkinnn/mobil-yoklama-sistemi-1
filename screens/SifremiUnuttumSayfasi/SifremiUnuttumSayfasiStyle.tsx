import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ddebe1',
    },
    logoContainer: {
      marginBottom: 20, 
    },
    logo: {
      width: 150,
      height: 150,
      resizeMode: 'contain', 
    },
    inputContainer: {
      width: '80%'
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    rolContainer:{
      display:'flex',
      flexDirection:'row',
      marginTop: 5,
      
    },
    seciliRol: {
      borderColor: '#1E9D4C',
      borderWidth: 2,
    },
    rolButton: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
      marginRight: 10,       
    },
    rolButtonText: {
      
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    button: {
      backgroundColor: '#1E9D4C',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginBottom: 5,
      borderColor: '#1E9D4C',
      borderWidth: 2,
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
    buttonOutlineText: {
      color: '#1E9D4C',
      fontWeight: '700',
      fontSize: 16,
    },
  });

  export default styles;