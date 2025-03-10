import ms from 'ms';
import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { IdentityUtil, UserIdentity } from '@wings-online/common';
import { CacheUtil } from '@wings-online/common/utils/cache.util';
import { TypeOrmCustomerEntity } from '@wings-online/order/entities';
import { ParameterKeys } from '@wings-online/parameter/parameter.constants';
import { ParameterService } from '@wings-online/parameter/parameter.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly parameterService: ParameterService,
  ) {}

  /**
   *
   * @param externalId
   * @returns
   */
  public async getIdentityByExternalId(
    externalId: string,
  ): Promise<UserIdentity | undefined> {
    let identity: UserIdentity | undefined;

    const entity = await this.dataSource
      .createQueryBuilder(TypeOrmCustomerEntity, 'identity')
      .innerJoinAndSelect('identity.infos', 'info')
      .where('identity.externalId = :externalId', { externalId })
      .cache(
        CacheUtil.getCacheKeyByParts([
          this.getIdentityByExternalId.name,
          externalId,
        ]),
        ms('1h'),
      )
      .getOne();

    if (entity) {
      const dryInfo = entity.infos.find((info) => info.type === 'DRY');
      const frozenInfo = entity.infos.find((info) => info.type === 'FROZEN');

      const organization =
        IdentityUtil.getOrganizationFromExternalId(externalId);

      const dummyCustomers = await this.parameterService.get(
        ParameterKeys.DUMMY_CUSTOMER_ID,
      );

      const isDummy =
        dummyCustomers?.find((dummy) => dummy.value === entity.externalId) !==
        undefined;

      identity = {
        id: entity.id,
        externalId: entity.externalId,
        isActive: entity.isActive,
        isDummy,
        organization,
        division: {
          dry: dryInfo
            ? {
                payerId: dryInfo.payerId,
              }
            : undefined,
          frozen: frozenInfo
            ? {
                payerId: frozenInfo.payerId,
              }
            : undefined,
        },
      };
    }
    return identity;
  }
}
