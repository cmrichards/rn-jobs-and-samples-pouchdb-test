import toId from "to-id"
import PouchDB from 'pouchdb-react-native';

import events from 'events'
events.EventEmitter.defaultMaxListeners = 20;

let counter = 0
let remoteURL = "***" // cloudant URL
let username = "***"
let password = "***"

export default class Database {
  constructor() {
    this.localDB = new PouchDB('jobs');
    this.remoteDB = new PouchDB(remoteURL , { auth: { username, password } });
    this.sync = this.localDB.sync(this.remoteDB, {
      live: true,
      retry: true
    })
  }

  closeConnection() {
    this.sync.cancel()
    this.localDB.close()
    this.remoteDB.close()
    this.sync = null
    this.localDB = null
    this.remoteDB = null
  }

  OLDfetchAndListenForSampleChanges(job, callback) {
    this.fetchSamplesForJob(job, callback);
    var listener = this.localDB.changes({
      live: true,
      since: "now",
      filter: (doc) => doc.type === "sample"
    }).on('change', callback)
    return listener;
  }

  fetchAndListenForSampleChanges(job, callback) {
    counter ++
    console.log('Counter++' + counter)
    this.fetchSamplesForJob(job, callback);
    var listener = this.localDB.changes({
      live: true,
      since: "now",
      filter: (doc) => doc.type === "sample"
    }).on('change', callback)
    return {
       cancel: () => {
          listener.cancel()
          counter--
          console.log('Counter--'+counter)
       }
    }
  }

  fetchSamplesForJob(job, callback) {
    this.localDB
      .allDocs({
        include_docs: true,
        // attachments: true,
        startkey: Database.samplesForJob(job),
        endkey: Database.samplesForJob(job)+'\uffff'
      })
      .then(callback)
      .catch(err => {
        alert(JSON.stringify(err));
      })
  }

  createSample(job, sample, callback) {
    var sample = {
      ...sample,
      type: "sample",
      created: (new Date()).toJSON()
    }
    sample = {
      ...sample,
      _id: Database.fullSampleId(job, sample)
    }
    this.localDB.put(sample, callback);
  }

  static partialJobId(job) {
    return job.created;
  }

  static fullJobId(job) {
    return "job:"+Database.partialJobId(job);
  }

  static fullSampleId(job, sample) {
    return "sample:"+Database.partialJobId(job)+":"+sample.created;
  }

  static samplesForJob(job) {
    return "sample:"+Database.partialJobId(job)+":";
  }

  static jobs() {
    return "job:"
  }

}

