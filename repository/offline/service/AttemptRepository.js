export class AttemptRepository {
  constructor(realm) {
    this.realm = realm;
  }

  create(model) {
    this.realm.write(() => {
      this.realm.create('Attempt', model);
    });
  }

  update(attempt, model) {
    this.realm.write(() => {
      attempt.count = model.count;
    });
  }

  getOne({type}) {
    return this.realm.objects('Attempt').filtered(`type = "${type}"`)[0];
  }

  getList() {
    return this.realm.objects('Attempt');
  }

  count() {
    return this.realm.objects('Attempt').length;
  }
}
