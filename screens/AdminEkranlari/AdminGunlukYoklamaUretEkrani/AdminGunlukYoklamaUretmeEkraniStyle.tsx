import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ddebe1',
      flex: 1,
      paddingHorizontal:20,
    },
    headerTopBar:{
      backgroundColor:'#1E9D4C',
      paddingHorizontal:16,
      paddingVertical:15,
      marginBottom:20,
      borderRadius:10,
      display:'flex',
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
    },
    days:{
      width:'50%',
    },
    day:{
      paddingHorizontal:30,
      padding:10,
      borderRadius:10,
      margin:5,
    },
    button:{
      backgroundColor: 'white',
      marginTop: 10,
      borderColor: '#1E9D4C',
      borderWidth: 2,
      width:'75%',
      padding:10,
      borderRadius:10,
    },
    row:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      marginVertical:7,
      elevation:1,
      padding:10,
      backgroundColor:'#fff',
      borderRadius: 10,
    },
    cell:{
      fontSize:13,
      textAlign:'left',
      flex:1,
      fontWeight:'400'
    },

  });

  export default styles;