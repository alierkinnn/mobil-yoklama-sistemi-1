import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    textAlign:'center',
    flex:1,
    fontWeight:'400'
  }

});

  export default styles;