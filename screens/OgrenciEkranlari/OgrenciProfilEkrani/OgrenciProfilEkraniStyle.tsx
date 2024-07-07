import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ddebe1',
      flex: 1,
      alignItems: 'center',
    },
    inputContainer: {
      width: '80%',
      marginTop:-10,
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 10,
    },
    input1: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 10,
      marginTop: 10,
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
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
    imageContainer:{
      marginVertical:30,
      display:'flex',
      alignItems:'center'
    },
    image:{
      width: 175,
      height: 175,
      resizeMode: 'contain',
      borderRadius:20, 
    }
  });

  export default styles;