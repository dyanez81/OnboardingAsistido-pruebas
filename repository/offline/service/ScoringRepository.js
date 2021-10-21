export class ScoringRepository {
  constructor(realm) {
    this.realm = realm;
  }

  create(model) {
    this.realm.write(() => {
      this.realm.create('Scoring', model);
    });
  }

  update(scoring, model) {
    this.realm.write(() => {
      scoring.score = model.score;
    });
  }

  getOne({type}) {
    return this.realm.objects('Scoring').filtered(`type = "${type}"`)[0];
  }

  getList() {
    return this.realm.objects('Scoring');
  }

  count() {
    return this.realm.objects('Scoring').length;
  }
}
