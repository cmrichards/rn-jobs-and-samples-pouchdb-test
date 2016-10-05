import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import moment from "moment"

export default class JobRow extends Component {

  render() {
    const { job, pressItem } = this.props;
    return (
      <TouchableOpacity onPress={pressItem}>
        <View style={{flex: 1, flexDirection: "column", justifyContent: "space-between"}}>
            <View style={{marginBottom: 5, borderTopWidth: 1, borderTopColor: "#DDDDDD", height: 30, flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
              <Text style={{ paddingTop: 10, paddingLeft: 10, width: 200, fontWeight: "bold", color: "#000000", fontSize: 15 }}>
                { job.company } ({ job.samples ? Object.keys(job.samples).length : 0})
              </Text>
              <Text style={{ color: '#f7b244', paddingTop: 10, paddingLeft: 10, width: 80, fontSize: 12, fontWeight: "bold"}}>
              { moment(job.job_date).format("Do MMM YY") }
              </Text>
            </View>
            <View style={{paddingLeft: 10, paddingBottom: 10}}>
            <Text style={{fontSize: 13}}>{ job.address || "Address goes here" }</Text>
            </View>
        </View>
      </TouchableOpacity>
    )
  }

}
