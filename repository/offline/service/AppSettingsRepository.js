export class AppSettingsRepository {
  constructor(realm) {
    this.realm = realm;
  }

  create(model) {
    this.realm.write(() => {
      this.realm.create('AppSetting', model);
    });
  }

  update(appSettings, model) {
    this.realm.write(() => {
      appSettings.logged = model.logged;
      appSettings.useBiometry = model.useBiometry;
      appSettings.token = model.token;
      appSettings.tokenChanged = model.tokenChanged;
    });
  }

  getOne() {
    return this.realm.objects('AppSetting')[0];
  }

  getList() {
    return this.realm.objects('AppSetting');
  }

  count() {
    return this.realm.objects('AppSetting').length;
  }

  logout(appSettings) {
    return this.realm.write(() => {
      appSettings.logged = false;
    });
  }
}
