import React from 'react';
import {connect} from 'react-redux';
import {Container, Text} from 'native-base';
import {withNavigation} from '@react-navigation/compat';
// import {addBLE} from '../actions';

const BLE = () => {
  const status = 'connection status';
  return (
    <Container>
      <Text style={{backgroundColor: 'red'}}>Status: {status}</Text>
      <Text>Color: {'red'}</Text>
      <Text>Device: {'ME'}</Text>
    </Container>
  );
};
export default BLE;

// class BLE extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <Container>
//         <Text style={{backgroundColor: this.props.color}}>
//           Status: {this.props.status}
//         </Text>
//         <Text>Color: {this.props.color}</Text>
//         {this.props.connectedDevice && (
//           <Text>Device: {this.props.connectedDevice.name}</Text>
//         )}
//       </Container>
//     );
//   }
// }

// function mapStateToProps(state) {
//   console.log(state);
//   return {
//     BLEList: state.BLEs.BLEList,
//     color: state.BLEs.color,
//     connectedDevice: state.BLEs.connectedDevice,
//     status: state.BLEs.status,
//   };
// }

// const mapDispatchToProps = dispatch => ({
//   addBLE: device => dispatch(addBLE(device)),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   null,
//   {forwardRef: true},
// )(withNavigation(BLE));
