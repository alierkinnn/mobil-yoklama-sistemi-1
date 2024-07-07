import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ddebe1',
      flex: 1,
      paddingHorizontal:20,
    },
    container1:{
      backgroundColor: '#ddebe1',
      flex: 1,
      alignItems:'center',
      paddingTop:25,
    },
    headerTopBar:{
      backgroundColor:'#1E9D4C',
      paddingHorizontal:16,
      paddingVertical:15,
      marginBottom:20,
      borderRadius:10,
      elevation:2,
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
    
    },
    headerTopBarText:{
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
      textAlign:'center'
    },
    headerTopBarText1:{
      color: '#d1f0ce',
      fontWeight: '500',
      fontSize: 15,
      textAlign:'center'
    },
    logoContainer: {
      marginBottom: 20, 
    },
    logo: {
      width: 100,
      height: 100,
      resizeMode: 'contain', 
    },
    inputContainer: {
      width: '80%'
    },
    text:{
      marginHorizontal:10,
      marginVertical:5,
      marginTop:15,
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonContainer: {
      width: '40%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginBottom: 5,
      borderColor: '#1E9D4C',
      borderWidth: 2,
    },
    buttonOutlineText: {
      color: '#1E9D4C',
      fontWeight: '700',
      fontSize: 16,
    },
    button: {
      display:'flex',
      flexDirection:'row',
      justifyContent: 'center',
      backgroundColor: '#1E9D4C',
      width: '100%',
      padding: 15,
      borderRadius: 10,
    },
    ogretimTuruContainer:{
      display:'flex',
      flexDirection:'row',
      marginTop: 5,
      justifyContent:'center'
    },
    seciliOgretimTuru: {
      borderColor: '#1E9D4C',
      borderWidth: 2,
    },
    ogretimTuruButton: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 10,
      marginRight: 10,       
    },

  });

  export default styles;