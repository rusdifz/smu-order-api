import { DataSource } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserIdentity } from '@wings-online/common';

import { OrderAggregate, OrderFactory } from '../domains';
import {
  TypeOrmOrderHeaderDummyEntity,
  TypeOrmOrderHeaderEntity,
} from '../entities';
import { IOrderWriteRepository } from '../interfaces';

@Injectable()
export class TypeOrmOrderWriteRepository implements IOrderWriteRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly factory: OrderFactory,
  ) {}

  async getById(
    id: number,
    identity: UserIdentity,
    isDummy: boolean,
  ): Promise<OrderAggregate | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(
        isDummy ? TypeOrmOrderHeaderDummyEntity : TypeOrmOrderHeaderEntity,
        'order',
      )
      .where('order.id = :id', { id })
      .andWhere('order.customerId = :externalId', {
        externalId: identity.externalId,
      })
      .getOne();

    return entity ? this.factory.reconstitute(entity, id) : undefined;
  }

  async getByRefId(
    id: number,
    identity: UserIdentity,
    isDummy: boolean,
  ): Promise<OrderAggregate | undefined> {
    const entity = await this.dataSource
      .createQueryBuilder(
        isDummy ? TypeOrmOrderHeaderDummyEntity : TypeOrmOrderHeaderEntity,
        'order',
      )
      .where('order.refId = :id', { id })
      .andWhere('order.customerId = :externalId', {
        externalId: identity.externalId,
      })
      .getOne();

    return entity ? this.factory.reconstitute(entity, id) : undefined;
  }

  async save(order: OrderAggregate, isDummy: boolean): Promise<void> {
    if (!order.isDirty) return;

    await this.dataSource.createEntityManager().upsert(
      isDummy ? TypeOrmOrderHeaderDummyEntity : TypeOrmOrderHeaderEntity,
      {
        id: order.id.value,
        flagCancelOrder: order.flagCancelOrder,
        flagTriggerCancel: order.flagTriggerCancel,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        deletedAt: order.deletedAt,
      },
      { conflictPaths: ['id'], skipUpdateIfNoValuesChanged: true },
    );
  }
}
