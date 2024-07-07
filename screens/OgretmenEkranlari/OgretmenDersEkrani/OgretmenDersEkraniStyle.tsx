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
  button: {
    backgroundColor: '#1E9D4C',
    marginTop:15,
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  dersBitirButton: {
    paddingHorizontal:20,
    paddingVertical:10,
    backgroundColor:'#d42424',
    display:'flex',
    flexDirection:'row',
    borderRadius:10,
    width:'45%',
    marginBottom:10,
    alignItems:'center',
    justifyContent:'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arka planı karartmak için opaklık
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
});

  export default styles;