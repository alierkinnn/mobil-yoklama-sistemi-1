// styles.tsx
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#b2d4c0',
    flex: 1,
    flexDirection:'column'
  },
  header: {
    padding:20,
    alignItems: "center",
    marginBottom:10,
    backgroundColor: '#eef0b4',
    marginHorizontal: 20,
    borderRadius: 15,
  },
  headerText: {
    color: "#4d594c",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerText1: {
    color: "#4d594c",
    fontSize: 14,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drawerItemText: {
    fontSize: 16,
  },
  logoutItem: {
    marginTop: 20,
    backgroundColor: "#e74c3c", // Çıkış yap butonunun arkaplan rengi
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal:20,
  },
  logoutItemText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
