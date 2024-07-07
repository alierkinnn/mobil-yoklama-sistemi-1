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
      fontWeight:'400',
    },
    buttons:{
      display:'flex',
      flex:1,
      flexDirection:'row',
      textAlign:'left',
    },
    picker:{
      width: 160,
      height: 50,
    },
    pickerItem:{
      fontSize:13,
    }

  });

  export default styles;