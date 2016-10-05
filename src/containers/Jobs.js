import React, { Component } from 'react'
import { connect } from 'react-redux'
import { navigatePush } from '../actions'
import PouchDB from 'pouchdb-react-native';
import toId from "to-id"
import Database from "../Database"
import colors from 'HSColors'
import fonts from 'HSFonts'

import {
  StyleSheet,
  View,
  Platform,
  ListView,
  Dimensions,
  StatusBar
} from 'react-native';
import {
  Tabs,
  Tab,
  SearchBar,
} from 'react-native-elements'
import { Container } from 'navbar-native'
import JobRow from "../components/JobRow"
import Icon from 'react-native-vector-icons/MaterialIcons'

var { width } = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export class Jobs extends Component {

  constructor (props) {
    super(props)
    this.state = {
      searching: false,
      filterText: "",
      selectedTab: 'active',
      selectedIndex: 1,
      closed: false,
      count: 0,
      jobs: []
    }
    this.count = 0
    this.changeTab = this.changeTab.bind(this)
    this.filterList = this.filterList.bind(this)
    this.pressedSearch = this.pressedSearch.bind(this)
  }

  componentDidMount() {
    console.log("MOUNTING JOBS")
    const { database } = this.props
    this.fetchAllRows()
    this.changes = database.localDB.changes({
      live: true,
      since: "now",
      filter: (doc) => doc.type === "job"
    }).on('change', (change) => { this.count += 1; this.setState({ count: this.count}); this.fetchAllRows()})
  }

  componentWillUnmount() {
    this.changes.cancel()
    console.log("UNMOUTING JOBS")
  }

  fetchAllRows() {
    const { database } = this.props
    database.localDB
      .allDocs({
        include_docs: true,
        startkey: Database.jobs(),
        endkey: Database.jobs()+'\uffff'
      })
      .then(results => {
        this.setState({
          jobs: results.rows.map(row => row.doc)
        });
      }).catch(err => {
        alert(JSON.stringify(err));
      })
  }

  activeDataSource() {
    return this.makeDataSource(0)
  }

  completeDataSource() {
    return this.makeDataSource(1)
  }

  makeDataSource(state) {
    var jobs = this.state.jobs.filter(j => j.state == state);
    if (this.state.searching && this.state.filterText) {
      jobs = jobs.filter( j => j.company.match(new RegExp(this.state.filterText, "i")))
    }
    return ds.cloneWithRows(jobs)
  }

  updateJobs(jobs) {
    this.setState({ jobs });
  }

  filterList (filterText) {
    if (this.state.searching)
      this.setState({ filterText })
  }

  pressedSearch () {
    this.setState({
      selectedTab: this.state.selectedTab == 'active' || this.state.selectedTab == 'complete' ? this.state.selectedTab : 'active',
      searching: !this.state.searching,
    })
  }

  changeTab (selectedTab) {
    this.setState({ selectedTab })
  }

  render() {
    const { selectedTab, searching } = this.state
    const { onJobPress } = this.props
    const buttons = ['Option 1', 'Option 2']
    return (
      <Container>
          <StatusBar
            backgroundColor="#1a8aca"
            barStyle="light-content"
            />
          {
            this.state.selectedTab != 'form' &&
            searching &&
              <View>
                <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                  <SearchBar
                   lightTheme
                   noIcon
                   onChangeText={this.filterList}
                   containerStyle={{marginBottom: 0, width: width * 1}}
                   inputStyle={{height: 55, fontSize: 20}}
                   placeholder='Search Jobs...' />
                </View>
              </View>
          }
        <Tabs hidesTabTouch>
          <Tab
            titleStyle={[styles.titleStyle]}
            selectedTitleStyle={[styles.titleSelected, {marginTop: -3, marginBottom: 7}]}
            selected={selectedTab === 'active'}
            title={selectedTab === 'active' ? 'ACTIVE JOBS' : null}
            renderIcon={() => <Icon color={colors.grey2} name='whatshot' size={26} />}
            renderSelectedIcon={() => <Icon color={colors.primary} name='whatshot' size={26} />}
            onPress={() => this.changeTab('active')}>

            <ListView
              ref={ref => this.listView1 = ref}
              onContentSizeChange={() => {
                this.listView1.scrollTo({y: 0})
              }}
              style={{backgroundColor: "#FFFFFF"}}
              dataSource={this.activeDataSource()}
              enableEmptySections={true}
              renderRow={(rowData) => <JobRow pressItem={() => onJobPress(rowData)} job={rowData}/>}
            />
          </Tab>
          <Tab
            tabStyle={selectedTab !== 'complete' && { marginBottom: -6 }}
            titleStyle={[styles.titleStyle, {marginTop: -1}]}
            selectedTitleStyle={[styles.titleSelected, {marginTop: -3, marginBottom: 7}]}
            selected={selectedTab === 'complete'}
            title={selectedTab === 'complete' ? 'COMPLETED JOBS' : null}
            renderIcon={() => <Icon style={{paddingBottom: 4}} color={colors.grey2} name='done' size={26} />}
            renderSelectedIcon={() => <Icon color={colors.primary} name='done' size={26} />}
            onPress={() => this.changeTab('complete')}>

            <ListView
              ref={ref => this.listView2 = ref}
              onContentSizeChange={() => {
                this.listView2.scrollTo({y: 0})
              }}
              style={{backgroundColor: "#FFFFFF"}}
              dataSource={this.completeDataSource()}
              enableEmptySections={true}
              renderRow={(rowData) => <JobRow pressItem={() => onJobPress(rowData)} job={rowData}/>}
            />
          </Tab>
          { __DEV__ &&
            <Tab
              tabStyle={selectedTab !== 'more' && { marginBottom: -6 }}
              titleStyle={[styles.titleStyle, {marginTop: -1}]}
              selectedTitleStyle={[styles.titleSelected, {marginTop: -3, marginBottom: 8}]}
              selected={selectedTab === 'more'}
              title={selectedTab === 'more' ? 'CRASH' : null}
              renderIcon={() => <Icon style={{paddingBottom: 4}} color={colors.grey2} name='error' size={26} />}
              renderSelectedIcon={() => <Icon color={colors.primary} name='error' size={26} />}
              onPress={() => this.changeTab('more')}>
            </Tab>
          }
        </Tabs>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  titleStyle: {
    ...Platform.select({
      ios: {
        fontFamily: fonts.ios.black
      }
    })
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    onJobPress: (job) => {
      dispatch(navigatePush({key: 'job', title: job.company, job}))
    }
  }
}

export default connect(
  (state) => { return {} } ,
  mapDispatchToProps
)(Jobs)

