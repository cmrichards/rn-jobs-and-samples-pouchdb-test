import React, {PropTypes} from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ListView,
  Image,
  Dimensions
} from 'react-native'
import colors from 'HSColors'
import {Text, Button} from 'react-native-elements'
import { navigatePush } from '../actions'
import moment from "moment"
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'
import blobUtil from "blob-util"

var { width } = Dimensions.get('window');


class Samples extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      avatarSource: null,
      samples: []
    }
    this.createSample = this.createSample.bind(this)
    this.updateSamples = this.updateSamples.bind(this)
  }

  componentWillUnmount() {
    this.listener.cancel();
  }

  componentDidMount() {
    const { job, database } = this.props;
    this.listener  = database.fetchAndListenForSampleChanges(job, this.updateSamples)
  }

  samplesDataSource() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return ds.cloneWithRows(this.state.samples)
  }

  updateSamples(results) {
    const { job, database } = this.props;
    database.fetchSamplesForJob(job, (results) =>
      this.setState({
        samples: results.rows.map(row => row.doc) || []
      })
   )
  }

  createSample() {
    const { job, database } = this.props;
    var sample = { name: "Sample 1" }
    database.createSample(job, sample)
  }

  render() {
    const { job, onSamplePress, database } = this.props;
    const { samples } = this.state
    return (
      <View style={styles.container}>
        <View>
          <View style={styles.job_details}>
            <Text style={{width: 200}}>
              Job Date: {moment(job.job_date).format("Do MMM YY")}
            </Text>
            <Text style={{textAlign: "right"}}>
              { samples.length } Samples
            </Text>
          </View>
        </View>

        <ListView
          style={{backgroundColor: "#FFFFFF"}}
          dataSource={this.samplesDataSource()}
          enableEmptySections={true}
          renderRow={(sample) => <SampleRow database={database} onSamplePress={() => onSamplePress(sample)} sample={sample}/>}
        />
      </View>
    )
  }

}

class SampleRow extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      avatarSource: null
    }
  }

  componentDidMount() {
    const { database, sample } = this.props

    return;

    // !!! TODO not working aaargh !!
    var blob = database.localDB.getAttachment(sample._id, 'image').then(function(blobOrBuffer) {

      blobUtil.arrayBufferToBlob(blobOrBuffer, 'image/jpeg').then(function (blob) {
         console.log(blob)
         console.log(JSON.stringify(blob))
         var url = blobUtil.createObjectURL(blob);
         console.log(url)
         console.log(JSON.stringify(url))
        this.setState({
          imageUrl: url
        });
      }).catch(function (err) {
        // error
      });
      //this.setState({
        //imageUrl: blobUtil.createObjectURL(blobOrBuffer)
      //});
      // alert(blobUtil.createObjectURL(blobOrBuffer));
    }).catch((err) => {
      alert(err);
    });
  }

  imagePicker() {
    const { sample, database } = this.props
    var options = {
      title: 'Select Photo',
      quality: 0.5,
      storageOptions: {
        skipBackup: true,
        path: 'images',
        imageUrl: null
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        var source;
        if (Platform.OS === 'ios') {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          source = {uri: response.uri, isStatic: true};
        }

        database.localDB.put( {
            ...sample,
            _attachments: {
            'image': {
              content_type: 'image/jpeg',
              data: response.data
            }
          }
        })

        this.setState({
          avatarSource: source
        });
      }
    });
  }


  render() {
    const { sample, onSamplePress } = this.props
    return (
      <TouchableOpacity onPress={onSamplePress}>
        <View style={{flex: 1, flexDirection: "column", justifyContent: "space-between"}}>
            <View style={{marginBottom: 5, borderTopWidth: 1, borderTopColor: "#DDDDDD", flex: 1, flexDirection: "row", justifyContent: "space-between"}}>
              <View style={{ paddingTop: 10, paddingLeft: 10, width: 200}}>
                <Text style={{ fontWeight: "bold", color: "#000000", fontSize: 15 }}>
                { sample.name }
                </Text>
                <View>
                <Text style={{fontSize: 13}}>{ sample.comments }</Text>
                </View>
                { sample.plastic &&
                <View>
                <Text style={{fontSize: 13}}>Plastic: { sample.plastic }%</Text>
                </View>
                }
                { sample.organic &&
                <View>
                <Text style={{fontSize: 13}}>Organic: { sample.organic }%</Text>
                </View>
                }
                { sample.metal &&
                <View>
                <Text style={{fontSize: 13}}>Metal: { sample.metal }%</Text>
                </View>
                }
              </View>
              <View style={{ paddingTop: 10, paddingLeft: 10, width: 80}}>
              <TouchableOpacity onPress={() => this.imagePicker()}>
                <Text style={{ color: '#f7b244', fontSize: 12, fontWeight: "bold"}}>
                { sample.weight && sample.weight+"kg" }
                </Text>
                <Icon color={colors.grey2} name='photo-camera' size={26} />
              </TouchableOpacity>
              </View>
            </View>
            { this.state.imageUrl && <Text>{ this.state.imageUrl }</Text> }
            { this.state.imageUrl && <Image source={this.state.imageUrl} style={{width: width*0.2, height: width*0.2}} /> }
        </View>
      </TouchableOpacity>
    )

  }
  // { sample._attachments && false && <Image source={URL.createObjectURL(sample._attachments.image.data )} style={{width: width*0.2, height: width*0.2}} /> }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0
  },
  job_details: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10
  },
  detail: {
  }
})

const mapDispatchToProps = (dispatch) => {
  return {
    onSamplePress: (sample) => {
      dispatch(navigatePush({key: 'sample_form', title: "Edit Sample", sample}))
    },
  }
}

export default connect(
  (state) => { return {} } ,
  mapDispatchToProps
)(Samples)

