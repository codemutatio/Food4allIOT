import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    margin: 10,
  },
  infoContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginTop: 5,
  },
  text_input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    margin: 5,
  },
  card: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    margin: 5,
  },
  heading: {
    fontSize: 16,
    color: 'darkgray',
    marginBottom: 3,
  },
  info: {
    fontSize: 18,
    color: 'dimgray',
    marginBottom: 15,
  },
  topBottomSpread: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  btnCtn: {
    width: '100%',
    alignItems: 'center',
  },
  removeBtn: {
    backgroundColor: '#F95561',
    // width: 100,
    padding: 13,
    borderRadius: 50,
    elevation: 5,
  },
  batBtn: {
    backgroundColor: '#9E63D7',
    padding: 13,
    borderRadius: 50,
    elevation: 5,
  },
  heartBtn: {
    backgroundColor: '#38A39F',
    padding: 13,
    borderRadius: 50,
    elevation: 5,
  },
  backBtn: {
    backgroundColor: '#1C58E2',
    padding: 13,
    borderRadius: 50,
    elevation: 5,
  },
  removeBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  functionBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  textLarge: {
    fontSize: 24,
  },
  textRateCont: {
    width: 120,
    height: 120,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  textRate: {
    fontSize: 32,
  },
});

export default styles;
