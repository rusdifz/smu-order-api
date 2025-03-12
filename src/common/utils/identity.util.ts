import { RETAIL_S_GROUP } from '@wings-online/app.constants';
import { Organization } from '@wings-corporation/core';

export class IdentityUtil {
  /**
   *
   * @param externalId
   * @returns
   */
  public static getOrganizationFromExternalId(
    externalId: string,
  ): Organization {
    if (externalId.startsWith('WS')) {
      return 'WS';
    } else if (externalId.startsWith('WGO')) {
      return 'WGO';
    } else {
      return 'SMU';
    }
  }

  public static isRetailS(org: Organization, group: string): boolean {
    return org != 'WS' && group === RETAIL_S_GROUP;
  }
}
