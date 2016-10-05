import React, {Component} from 'react';
import {
  View,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const NavbarAction = ({ onPress, icon }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ padding: 15, marginRight: 10 }}>
        <Icon color={"#FFFFFF"} name={ icon } size={26} />
      </View>
    </TouchableOpacity>
  )
}

export default NavbarAction
