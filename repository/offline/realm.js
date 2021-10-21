import Realm from 'realm';

import {AppSetting} from './models/AppSetting';
import {Attempt} from './models/Attempt';
import {Scoring} from './models/Scoring';

export default function getRealm() {
  return Realm.open({
    schema: [AppSetting, Attempt, Scoring],
    schemaVersion: 1,
  });
}
