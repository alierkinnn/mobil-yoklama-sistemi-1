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
    },
    inputContainer: {
      width: '90%',
      marginTop: 5,
    },
    input1: {
      display:'flex',
      flexDirection:'row',
      textAlignVertical:'center',
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 10,
      marginTop: 10,
    },
    headerTopBar:{
      backgroundColor:'#1E9D4C',
      paddingHorizontal:16,
      paddingVertical:15,
      marginBottom:5,
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
      fontSize: 12,
      textAlign:'center'
    },

    dropdownContainer: {
      width: '90%',
      marginTop: 5,
    },
    dropdown:{
      backgroundColor: '#ad7f4b',
      width: '100%',
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
  },
  dropdownText:{
      color:'white',
      fontSize:16,
  },
  dropdownItem: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'white',
    padding: 15,
    margin: 5,
    borderRadius: 10,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  imageContainer:{
    marginVertical:20,
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