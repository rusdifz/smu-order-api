import { isDate } from 'lodash';
import { DateTime, IANAZone } from 'luxon';
import { ValueTransformer } from 'typeorm';

import { LEGACY_ORDER_DEFAULT_TIMEZONE } from '@wings-online/app.constants';

/**
 * This class helper to transform datetime without timezone to date with correct timestamp
 */
export class DatetimeTransformer implements ValueTransformer {
  /**
   *
   * @param data
   * @returns
   */
  from(data?: Date): Date | undefined {
    if (!data) return;
    const timezoneDiff = data.getTimezoneOffset();
    const offsetWithLegacyTimezone = IANAZone.create(
      LEGACY_ORDER_DEFAULT_TIMEZONE,
    ).offset(DateTime.fromJSDate(data).toUnixInteger());
    return DateTime.fromJSDate(data, { zone: LEGACY_ORDER_DEFAULT_TIMEZONE })
      .minus({ minutes: timezoneDiff + offsetWithLegacyTimezone })
      .toJSDate();
  }

  /**
   *
   * @param data
   * @returns
   */
  to(data: any): any {
    if (!isDate(data)) return data;
    const timezoneDiff = data.getTimezoneOffset();
    const offsetWithLegacyTimezone = IANAZone.create(
      LEGACY_ORDER_DEFAULT_TIMEZONE,
    ).offset(DateTime.fromJSDate(data).toUnixInteger());
    return DateTime.fromJSDate(data)
      .plus({ minutes: timezoneDiff + offsetWithLegacyTimezone })
      .toJSDate();
  }
}
