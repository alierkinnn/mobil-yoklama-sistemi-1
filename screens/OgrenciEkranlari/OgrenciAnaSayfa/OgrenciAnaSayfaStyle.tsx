import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddebe1',
    flex:1,
   
  },
  card:{
    marginVertical:10,
    elevation:1,
    borderColor:'#e6f032',
    padding:20,
    backgroundColor:'#f4f5df',
    margin:20,
    borderRadius:15,
    borderWidth:1.5,
  },
  row:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  ikon:{
    textAlign:'center',
    marginTop:5,
    color:'black',
  },
  cardItem:{
    fontSize:13,
    textAlign:'left',
    flex:1,
    fontWeight:'500',
    color:'#4d594c'
  },
  cardItem1:{
    fontSize:17,
    textAlign:'left',
    flex:1,
    fontWeight:'500',
    color:'#4d594c'
  }

});

  export default styles;