import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddebe1',
    flex: 1,
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
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

modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Arkaplan rengi ve opaklığı
},
modalContent: {
  backgroundColor: '#c8faec',
  padding: 20,
  borderRadius: 10,
  width: '90%',
},
closeButton: {
  position: 'absolute',
  top: 10,
  right: 10,
},
dersAdi: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  textAlign: 'center',
},
row:{
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems:'center',
  marginVertical:7,
  elevation:1,
  padding:15,
  backgroundColor:'white',
  borderRadius: 10,
},
cell:{
  fontSize:13,
  textAlign:'left',
  fontWeight:'400',
  color:'white',
},

});

  export default styles;