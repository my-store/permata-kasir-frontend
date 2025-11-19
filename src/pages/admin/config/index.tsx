import { DefaultAdminConfigState } from '../../../libs/redux/reducers/admin/admin.config.slice';
const ConfigKey: string = 'admin.config';

export function createAdminConfig(update?: any) {
  localStorage.setItem(
    ConfigKey,
    JSON.stringify({
      ...DefaultAdminConfigState,
      ...update,
    }),
  );
}

export function getAdminConfig(key?: string): any {
  let config: any = localStorage.getItem(ConfigKey);

  // No config found
  if (!config) {
    // Insert a new config
    createAdminConfig();
    // Re-call this function
    return getAdminConfig(key);
  }

  // Parse saved config
  config = JSON.parse(config);

  // Return specific config (if key is presented)
  // Or return the entire config
  return key ? config[key] : config;
}
