import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddebe1',
    flex:1,
  },
  card:{
    marginVertical:10,
    elevation:1,
    borderColor:'#0e1b63',
    padding:20,
    backgroundColor:'#bac0e0',
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
    color:'#010414'
  },
  cardItem1:{
    fontSize:17,
    textAlign:'left',
    flex:1,
    fontWeight:'500',
    color:'#010414'
  }

});

  export default styles;