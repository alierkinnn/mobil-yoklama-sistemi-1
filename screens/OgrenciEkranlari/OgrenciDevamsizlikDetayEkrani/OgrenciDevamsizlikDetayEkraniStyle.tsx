import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ddebe1',
      flex: 1,
      paddingHorizontal:20,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginBottom: 50,
      alignItems:'center',
      justifyContent:'space-between'
    },
    button: {
      borderWidth: 1,
      borderRadius: 5,
      padding: 12,
      marginHorizontal: 5,
      backgroundColor: 'white',
    },
    buttonText: {
      fontSize:14,
      fontWeight:'500'
    },
    headerTopBar:{
      backgroundColor:'#1E9D4C',
      paddingHorizontal:90,
      paddingVertical:15,
      marginTop: -30,
      marginBottom:20,
      borderRadius:10,
    },
    headerTopBarText:{
      color: 'white',
      fontWeight: '700',
      fontSize: 20,
      textAlign:'center'
    },
    basliklar:{
      flexDirection:'row',
      justifyContent:'space-between',
      padding:10,
      textAlign:'left',
    },
    baslik:{
      fontSize:14,
      fontWeight:'600',
      textAlign: 'center',
    },
    row:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginVertical:7,
      elevation:1,
      padding:15,
      backgroundColor:'#fff',
      borderRadius: 10,
    },
    cell:{
      fontSize:13,
      textAlign:'left',
      fontWeight:'400',
    },

  });

  export default styles;