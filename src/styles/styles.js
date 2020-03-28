import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
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
    marginTop: 10,
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: 'dimgray',
    margin: 5,
  },
  topBottomSpread: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default styles;
