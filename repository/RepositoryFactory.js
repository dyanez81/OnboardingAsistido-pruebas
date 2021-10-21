import SMSRepository from './webapi/SMSRepository';
import UserRepositoryWebApi from './webapi/UserRepository';
import OnboardRepository from './webapi/OnboardRepository';
import UpdateRepository from './webapi/UpdateRepository';
import GeocodeRepository from './webapi/GeocodeRepository';

import {AppSettingsRepository} from './offline/service/AppSettingsRepository';
import {AttemptRepository} from './offline/service/AttemptRepository';
import {ScoringRepository} from './offline/service/ScoringRepository';

const repositories = {
  sms: SMSRepository,
  user: UserRepositoryWebApi,
  onboard: OnboardRepository,
  update: UpdateRepository,
  geocode: GeocodeRepository,
};

const repositoriesRealm = {
  appSettings: realm => new AppSettingsRepository(realm),
  attempt: realm => new AttemptRepository(realm),
  scoring: realm => new ScoringRepository(realm),
};

/**
 * @author: Juan de Dios
 * @desc: Conjunto de funciones útiles para los repositories
 */
export const RepositoryFactory = {
  /**
   * @author: Juan de Dios
   * @desc: Obtiene el Repository por el nombre
   * @param {string} nombre Nombre del Repository
   * @return {Repository} Devuelve una instancia de un Repository
   */
  get: nombre => repositories[nombre],
  getRealm: (name, realm) => repositoriesRealm[name](realm),
};
