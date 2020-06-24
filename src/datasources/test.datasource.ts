import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as localConfig from './mongodb.datasource.json';
import * as serverConfig from './mongodb.datasource.server.json';


export class DatasourceConfiguration {
  name: string;
  connector: string;
  file?: string;
  url?: string;
  host?: string;
  user?: string;
  password?: string;
  database?: string;
}

let config: DatasourceConfiguration;

if (
  process.env.NODE_ENV === 'SomeEnvLikeProd'
) {
  // Application runs in cloud, get the required data from environment variables
  config = serverConfig;
  config.url = 'someUrl';
  config.host = 'someHost';
  config.user = 'someUser';
  config.password = 'somePassword';
  config.database = 'someDatabase';

} else {
  // Application run on a local machine. Store data in a JSON file
  config = localConfig
}

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class TestDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'test';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.test', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
