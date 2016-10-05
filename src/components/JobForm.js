import React, { Component } from 'react';
import { connect } from 'react-redux'
import { navigateReset } from '../actions'
import PouchDB from 'pouchdb-react-native';

import Database from "../Database"
import moment from "moment"
import t from "tcomb-form-native"

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Button,
  Text
} from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialIcons'
import socialColors from 'HSSocialColors'

var Form = t.form.Form;

var Job = t.struct({
  company: t.String,              
  address: t.maybe(t.String),  
  job_date: t.Date        
});

var options = {
  fields: {
    job_date: {
      config:  {
        format: (date) => moment(new Date()).format("Do MMM YY")
      }
    }
  }
};

class JobForm extends Component {

  onPress() {
    const { goToJob, database } = this.props
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      var job = {
        ...value,
        type: "job",
        created: (new Date()).toJSON(),
        state: 0
      }
      var _id = Database.fullJobId(job)
      var job = { ...job, _id }
      job.job_date = job.job_date.toJSON()
      database.localDB.put(job, () => goToJob(job))
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Form
          ref="form"
          type={Job}
          options={options}
        />
        <Button
          buttonStyle={{marginTop: 15}}
          backgroundColor={socialColors.facebook}
          onPress={this.onPress.bind(this)}
          title='Add Job' />
      </View>
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
    goToJob: (job) => {
      dispatch(navigateReset(
        [{key: "jobs", title: "Jobs"},
        {key: "job", title: job.company, job }], 1)
      )
    }
  }
}

export default connect(
  (state) => { return {} } ,
  mapDispatchToProps
)(JobForm)

