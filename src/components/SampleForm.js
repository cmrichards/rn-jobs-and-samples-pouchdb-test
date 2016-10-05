import React, { Component } from 'react';
import { connect } from 'react-redux'
import t from "tcomb-form-native"
import {
  StyleSheet,
  View,
  ScrollView
} from 'react-native';

import {
  Button,
  Text
} from 'react-native-elements'

import Icon from 'react-native-vector-icons/MaterialIcons'
import socialColors from 'HSSocialColors'
import { navigatePop } from '../actions'

import Database from "../Database"

var Form = t.form.Form;

var Sample = t.struct({
  name: t.String,              // a required string
  weight: t.maybe(t.Number),  // an optional string
  comments: t.maybe(t.String),
  plastic: t.maybe(t.Number),
  organic: t.maybe(t.Number),
  metal: t.maybe(t.Number),
});

class SampleForm extends Component {

  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      value: this.props.sample || {
        name: "",
        weight: "",
        comments: "",
        plasic: "",
        organic: "",
        metal: ""
      }
    }
  }

  onChange(value) {
    this.setState({
      value: { ...this.statevalue, ...value }
    });
  }

  onPress() {
    const { goToJob, database, job } = this.props
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      var sample = this.state.value
      if (!sample.created) {
        var sample = {
          ...value,
          type: "sample",
          created: (new Date()).toJSON(),
        }
        var _id = Database.fullSampleId(job, sample)
        var sample = { ...sample, _id }
        database.createSample(job, sample, () => goToJob())
      } else {
        database.localDB.put(sample, () => goToJob())
      }
    }
  }

  render () {
    const { value } = this.state
    return (
      <ScrollView>
        <View style={styles.container}>
          <Form
            ref="form"
            type={Sample}
            value={value}
            onChange={this.onChange.bind(this)}
            options={{}}
          />
          <Button
            buttonStyle={{marginTop: 15}}
            backgroundColor={socialColors.facebook}
            onPress={this.onPress.bind(this)}
            title={value.created ? "Update" : 'Add Sample'} />
        </View>
      </ScrollView>
    )
  }

}


var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 0,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    goToJob: () => {
      dispatch(navigatePop())
    }
  }
}

export default connect(
  (state) => { return {} } ,
  mapDispatchToProps
)(SampleForm)

