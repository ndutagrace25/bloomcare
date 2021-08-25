const Realm = require('realm');
import {
  BLOCKS,
  PATH,
  BEDS,
  STATIONS,
  NEW_SCOUT_SESSION,
  NEW_SCOUT_BLOCK,
  NEW_SCOUT_BED,
  NEW_SCOUT_STATION,
  NEW_SCOUT_POINT,
  NEW_SCOUT_ISSUE,
  POINTS,
  ISSUES,
  ISSUES_TYPE,
  ISSUES_CATEGORY,
  SCOUT_HISTORY,
} from './schemas';
import {
  Actions
} from 'react-native-router-flux';

const blockSchema = {
  name: BLOCKS,
  primaryKey: 'id',
  properties: {
    id: 'int',
    block_name: 'string',
    block_number: {
      type: 'int',
      optional: true,
    },
    block_parent: {
      type: 'int',
      optional: true,
    },
    created_by: {
      type: 'int',
      optional: true,
    },
    modified_by: {
      type: 'int',
      optional: true,
    },
    created_at: 'string',
  },
};

const bedSchema = {
  name: BEDS,
  primaryKey: 'id',
  properties: {
    id: 'int',
    bed_id: 'int',
    block_id: 'int',
    plant_status: 'int',
    variety_id: 'int',
    bed_name: 'string',
    bed_number: 'int',
    block_name: 'string',
    variety_name: 'string',
    parent_block: 'string',
    parent_id: 'int',
  },
};

const stationSchema = {
  name: STATIONS,
  primaryKey: 'id',
  properties: {
    id: 'int',
    station_name: 'string'
  },
};

const pointSchema = {
  name: POINTS,
  primaryKey: 'id',
  properties: {
    id: 'int',
    point_name: 'string',
  },
};

const issueSchema = {
  name: ISSUES,
  primaryKey: 'id',
  properties: {
    id: 'int',
    issue_name: 'string',
    issue_type_id: 'int',
    tolerance_type_id: {
      type: 'int',
      optional: true,
    },
    score_id: 'int',
    issue_type_name: 'string',
    tolerance_type_name: 'string',
    score_name: 'string'
  },
};

const issueTypeSchema = {
  name: ISSUES_TYPE,
  primaryKey: 'id',
  properties: {
    id: 'int',
    issue_type_name: 'string'
  },
};

const issueCategorySchema = {
  name: ISSUES_CATEGORY,
  primaryKey: 'id',
  properties: {
    id: 'int',
    issue_category_name: 'string',
    issue_id: 'int',
    issue_name: 'string',
  },
};


const newScoutSessionSchema = {
  name: NEW_SCOUT_SESSION,
  primaryKey: 'id',
  properties: {
    id: 'int',
    status: 'int',
    personnel: 'string',
    created: 'string',
  },
};

const newScoutBlockSchema = {
  name: NEW_SCOUT_BLOCK,
  primaryKey: 'id',
  properties: {
    id: 'int',
    session: 'int',
    block: 'string',
    created: 'string',
  },
};

const newScoutBedSchema = {
  name: NEW_SCOUT_BED,
  primaryKey: 'id',
  properties: {
    id: 'int',
    block: 'int',
    bed: 'string',
    created: 'string',
  },
};

const newScoutStationSchema = {
  name: NEW_SCOUT_STATION,
  primaryKey: 'id',
  properties: {
    id: 'int',
    bed: 'int',
    station: 'string',
    created: 'string',
  },
};

const newScoutPointSchema = {
  name: NEW_SCOUT_POINT,
  primaryKey: 'id',
  properties: {
    id: 'int',
    station: 'int',
    point: 'string',
    created: 'string',
  },
};

const newScoutIssueSchema = {
  name: NEW_SCOUT_ISSUE,
  primaryKey: 'id',
  properties: {
    id: 'int',
    point: 'string',
    block: 'string',
    personnel: 'string',
    bed: 'string',
    entry: 'string',
    issue_type: 'string',
    issue: 'string',
    issue_category: 'string',
    value: 'int',
    date: 'string',
    plant: 'string',
    variety: 'string',
    longitude: 'string',
    latitude: 'string',
  },
};

const databaseOptions = {
  path: PATH,
  schema: [
    blockSchema,
    bedSchema,
    stationSchema,
    pointSchema,
    issueSchema,
    issueTypeSchema,
    issueCategorySchema,
    newScoutSessionSchema,
    newScoutBlockSchema,
    newScoutBedSchema,
    newScoutStationSchema,
    newScoutPointSchema,
    newScoutIssueSchema,
  ],
  schemaVersion: 55, //optional which is important for migration
};

// BLOCK FUNCTIONS
export const createBlock = blockList =>
  new Promise((resolve, reject) => {
    let allBlocks;
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          for (let r = 0; r < blockList.length; r++) {
            allBlocks = blockList[r];
            realm.create(BLOCKS, allBlocks);
          }
          resolve(allBlocks);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllBlocks = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredBlocks = realm.objects(BLOCKS);
        resolve(allStoredBlocks);
      })
      .catch(error => reject(error));
  });

export const findBlockById = blockId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(BLOCKS)
          .filtered('id = "' + blockId + '"');
        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

// BED FUNCTIONS
export const createBed = bedList =>
  new Promise((resolve, reject) => {
    let allBeds;
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          for (let r = 0; r < bedList.length; r++) {
            allBeds = bedList[r];
            realm.create(BEDS, allBeds);
          }
          resolve(allBeds);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllBeds = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredBeds = realm.objects(BEDS);
        resolve(allStoredBeds);
      })
      .catch(error => reject(error));
  });

export const findBedById = bedId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(BEDS)
          .filtered('id = "' + bedId + '"');
        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

// STATION FUNCTIONS
export const createStation = stationList =>
  new Promise((resolve, reject) => {
    let allStations;
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          for (let r = 0; r < stationList.length; r++) {
            allStations = stationList[r];
            realm.create(STATIONS, allStations);
          }
          resolve(allStations);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllStations = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredStations = realm.objects(STATIONS);
        resolve(allStoredStations);
      })
      .catch(error => reject(error));
  });

export const findStationById = stationId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(STATIONS)
          .filtered('id = "' + stationId + '"');
        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

// POINTS FUNCTION
export const createPoint = pointList =>
  new Promise((resolve, reject) => {
    let allPoints;
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          for (let r = 0; r < pointList.length; r++) {
            allPoints = pointList[r];
            realm.create(POINTS, allPoints);
          }
          resolve(allPoints);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllPoints = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredPoints = realm.objects(POINTS);
        resolve(allStoredPoints);
      })
      .catch(error => reject(error));
  });

export const findPointById = pointId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(POINTS)
          .filtered('id = "' + pointId + '"');
        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

// ISSUES FUNCTION
export const createIssue = issuesList =>
  new Promise((resolve, reject) => {
    let allIssues;
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          for (let r = 0; r < issuesList.length; r++) {
            allIssues = issuesList[r];
            realm.create(ISSUES, allIssues);
          }
          resolve(allIssues);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllIssues = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredIssues = realm.objects(ISSUES);
        resolve(allStoredIssues);
      })
      .catch(error => reject(error));
  });

// ISSUE_TYPE FUNCTION
export const createIssueType = issuesTypeList =>
  new Promise((resolve, reject) => {
    let allIssuesTypes;
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          for (let r = 0; r < issuesTypeList.length; r++) {
            allIssuesTypes = issuesTypeList[r];
            realm.create(ISSUES_TYPE, allIssuesTypes);
          }
          resolve(allIssuesTypes);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllIssueTypes = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredIssueTypes = realm.objects(ISSUES_TYPE);
        resolve(allStoredIssueTypes);
      })
      .catch(error => reject(error));
  });

// ISSUE_CATEGORY FUNCTION
export const createIssueCategory = issuesCategoryList =>
  new Promise((resolve, reject) => {
    let allIssueCategory;
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          for (let r = 0; r < issuesCategoryList.length; r++) {
            allIssueCategory = issuesCategoryList[r];
            realm.create(ISSUES_CATEGORY, allIssueCategory);
          }
          resolve(allIssueCategory);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllIssueCategories = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredIssueCategories = realm.objects(ISSUES_CATEGORY);
        resolve(allStoredIssueCategories);
      })
      .catch(error => reject(error));
  });

// SCOUTING JOURNEY FUNCTIONS
export const createNewScout = (data, schema) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(schema, data);
          resolve(data);
        });
      })
      .catch(error => {
        reject(error);
      });
  });

export const queryAllNewScouts = schema =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm.objects(schema);
        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

export const searchNewScout = (where, schema) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm.objects(schema).filtered(where);
        let storedScout = allStoredNewScout.map(scout => {
          return scout;
        })
        console.log(where);
        console.log(storedScout);
        resolve(storedScout);
      })
      .catch(error => reject(error));
  });

export const findItemById = (id, schema) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(schema)
          .filtered('id = "' + id + '"');
        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

// DELETE ALL ISSUES ONCE SYNC IS DONE
export const deleteAllCollectedIssues = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm => {
      realm
        .write(() => {
          let allSubmittedIssues = realm.objects(NEW_SCOUT_ISSUE);
          realm.delete(allSubmittedIssues);
          resolve(allSubmittedIssues);
        })
        .catch(error => reject(error));
    });
  });

export const findBedScouted = (bed, schema) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(schema)
          .filtered('bedRealm = "' + bed + '"');
        let ss = realm
          .objects(schema);
        // .filtered('stationRealm = "' + entry + '"');
        let ddd = ss.map(stn => {
          return stn;
        })
        console.log(entry);
        console.log(ddd);

        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

export const findStationScouted = (realmBed, schema) =>
  new Promise((resolve, reject) => {
    console.log(realmBed);
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(schema)
          .filtered('realmBed = "' + realmBed + '"');
        let ss = realm
          .objects(schema)
        // .filtered('stationRealm = "' + realmBed + '"');
        let ddd = ss.map(stn => {
          return stn;
        });
        console.log(realmBed);
        console.log(ddd);

        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });

export const findPointScouted = (point, schema) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allStoredNewScout = realm
          .objects(schema)
          .filtered('point = "' + point + '"');
        resolve(allStoredNewScout);
      })
      .catch(error => reject(error));
  });