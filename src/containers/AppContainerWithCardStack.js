'use strict'

import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import { navigatePop, navigatePush } from '../actions'
import {
  NavigationExperimental,
  StyleSheet,
  Text,
  BackAndroid,
  View,
  TouchableOpacity
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Jobs from './Jobs';
import Samples from "../components/Samples"
import JobForm from "../components/JobForm"
import SampleForm from "../components/SampleForm"
import NavbarAction from "../components/NavbarAction"

const {
  CardStack: NavigationCardStack,
  Card: NavigationCard,
  Header: NavigationHeader
} = NavigationExperimental

class AppContainerWithCardStack extends React.Component {

  constructor(props) {
    super(props)
    this._renderScene = this._renderScene.bind(this)
    this._renderActions = this._renderActions.bind(this)
  }

  componentDidMount() {
    let { backAction } = this.props
    BackAndroid.addEventListener("hardwareBackPress", () => { backAction(); return true;} );
  }
  componentWillUnmount() {
    let { backAction } = this.props
    BackAndroid.removeEventListener("hardwareBackPress", () => { backAction(); return true;});
  }

  render() {
    let { navigationState, backAction } = this.props

    return (
      <NavigationCardStack
        navigationState={navigationState}
        onNavigateBack={backAction}
        style={styles.container}
        direction={navigationState.routes[navigationState.index].key === 'job_form' ?
          'vertical' : 'horizontal'
        }
        renderHeader={props => (
          <NavigationHeader
            {...props}
            style={ styles.navbar }
            onNavigateBack={backAction}
            renderTitleComponent={props => {
              const title = props.scene.route.title
              return <NavigationHeader.Title><Text style={styles.title}>{title}</Text></NavigationHeader.Title>
            }}
            renderRightComponent={this._renderActions}
          />
        )}
        renderScene={this._renderScene}
      />
    )
  }

  _renderActions({scene}) {
    const { showSampleForm, showJobForm } = this.props
    const { route } = scene
    switch(route.key) {
    case 'job':
      return <NavbarAction onPress={() => showSampleForm(route.job)} icon={"add"}/>
    case 'jobs':
      return <NavbarAction onPress={() => showJobForm()} icon={"add"}/>
    default:
      return null
    }
  }

  _renderScene({scene}) {
    const { route } = scene;
    const { database } = this.props;
    switch(route.key) {
    case 'jobs':
      return <Jobs database={ database }/>
    case 'job':
      return <Samples job={route.job} database={ database }/>
    case 'job_form':
      return <MyForm database={ database } />
    case 'sample_form':
      return <SampleForm job={route.job} sample={route.sample} database={ database } />
    }
  }

}


AppContainerWithCardStack.propTypes = {
  navigationState: PropTypes.object,
  backAction: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  navbar: {
    backgroundColor: "#1a8aca",
  },
  title: {
    color: "#FFF"
  }
})

export default connect(
  state => ({
    navigationState: state.navigationState
  }),
  dispatch => ({
    backAction: () => {
      dispatch(navigatePop())
    },
    showSampleForm: (job) => {
      dispatch(navigatePush({key: 'sample_form', title: "New Sample", job}))
    },
    showJobForm: () => {
      dispatch(navigatePush({key: 'job_form', title: "New Job"}))
    }
  })
)(AppContainerWithCardStack)
