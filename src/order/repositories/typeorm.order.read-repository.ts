import { DateTime } from 'luxon';
import { Brackets, DataSource, SelectQueryBuilder } from 'typeorm';

import { InjectDataSource } from '@nestjs/typeorm';
import { Collection, PaginatedCollection } from '@wings-corporation/core';
import { DEFAULT_QUERY_LIMIT } from '@wings-corporation/nest-http';
import { LEGACY_ORDER_DEFAULT_TIMEZONE } from '@wings-online/app.constants';
import {
  BaseReadModelMapper,
  PaginationUtil,
  UserIdentity,
} from '@wings-online/common';
import { BaseReadRepository } from '@wings-online/common/repositories/base.read-repository';
import { ParameterKeys } from '@wings-online/parameter/parameter.constants';
import { ParameterService } from '@wings-online/parameter/parameter.service';

import {
  TypeOrmDeliveryHeader,
  TypeOrmOrderHeaderDummyEntity,
  TypeOrmOrderHeaderEntity,
  TypeOrmOrderHeaderHistoryEntity,
  TypeOrmOrderHeaderMainEntity,
  TypeOrmOrderItemEntity,
  TypeOrmOrderItemHistoryEntity,
} from '../entities';
import { TypeOrmOrderEntity } from '../entities/typeorm.order.entity';
import { IOrderReadRepository, ListProductParams } from '../interfaces';
import { OrderMapper } from '../mapper/order.read-model.mapper';
import {
  OrderState,
  OrderStatus,
  TRANSACTION_DATE_LIMIT,
} from '../order.constants';
import { OrderReadModel } from '../read-models';
import { ListOrderReadModel } from '../read-models/list-order.read-model';

export class TypeOrmOrderReadRepository
  extends BaseReadRepository
  implements IOrderReadRepository
{
  private orderMapper: BaseReadModelMapper<
    | TypeOrmOrderHeaderEntity
    | TypeOrmOrderHeaderDummyEntity
    | TypeOrmOrderHeaderHistoryEntity,
    OrderReadModel
  >;
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly parameterService: ParameterService,
  ) {
    super();
    this.orderMapper = new OrderMapper();
  }

  async listOrders(
    identity: UserIdentity,
    filter: {
      state?: OrderState;
      // externalIds?: string[];
      keyword?: string;
    } = {
      state: 'ANY',
    },
    options?: { limit?: number; cursor?: string },
  ) {
    const limit = options?.limit || DEFAULT_QUERY_LIMIT;

    const minDate = DateTime.now()
      .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
      .startOf('day')
      .minus({ day: TRANSACTION_DATE_LIMIT })
      .toJSDate();

    const query = this.dataSource
      .createQueryBuilder(TypeOrmOrderEntity, 'order')
      .andWhere('order.customerId = :customerId', {
        customerId: identity.externalId,
      })
      .addOrderBy('order.documentDate', 'DESC')
      .addOrderBy('order.id', 'DESC')
      .andWhere('order.deletedAt IS NULL')
      .andWhere('order.documentDate >= :minDate', {
        minDate,
      })
      .limit(limit);

    if (filter.state === 'DELIVERED') {
      if (identity.organization === 'WS') {
        query
          .innerJoin('order.deliveries', 'delivery')
          .leftJoin('order.bill', 'bill')
          .andWhere(
            new Brackets((qb) => {
              // qb.where('delivery.soNumber IS NOT NULL').andWhere(
              //   new Brackets((qbs) => {
              qb.where('bill.status = :status', { status: '0' }).orWhere(
                'bill.soNumber IS NULL',
              );
              // }),
              // );
            }),
          );
        // .andWhere('bill.flagWs = :flagWs', { flagWs: 'X' });
      } else {
        query.andWhere('order.status >= :status', {
          status: OrderStatus.SHIPPED,
        });
      }
    } else if (filter.state === 'UNDELIVERED') {
      if (identity.organization === 'WS') {
        query
          .leftJoin('order.deliveries', 'deliveries')
          .leftJoin('order.bill', 'bill')
          .andWhere('deliveries.soNumber IS NULL')
          .andWhere('bill.soNumber IS NULL');
      } else {
        query
          .andWhere('order.status < :status', { status: OrderStatus.SHIPPED })
          .andWhere('order.status != :cancelledStatus', {
            cancelledStatus: OrderStatus.CANCELLED_BY_CUSTOMER,
          });
      }
    }

    // if (filter.externalIds) {
    //   query.distinct(true);
    //   query.innerJoin('order.items', 'items');
    //   // see https://postgres.cz/wiki/PostgreSQL_SQL_Tricks_I#Predicate_IN_optimalization
    //   query.andWhere(
    //     `items.materialId IN (VALUES ${filter.externalIds
    //       .map((x) => `('${x}')`)
    //       .join(',')})`,
    //   );
    // }

    if (filter.keyword) {
      query.distinct(true);
      // query.innerJoin('order.items', 'items');
      // query.andWhere(
      //   `items.materialId IN (VALUES ${filter.externalIds
      //     .map((x) => `('${x}')`)
      //     .join(',')})`,
      // );
      query.andWhere(
        `order.id IN 
          (SELECT items.m_order_header_id FROM order_item items
            WHERE
              :keyword % any(string_to_array(items.material_title_name, ' '))
              OR :keyword % any(
                string_to_array(items.material_desc, ' ')
              )
          )`,
        {
          keyword: filter.keyword,
        },
      );
    }

    const countQuery = query.clone();

    if (options?.cursor) {
      const cursor = this.decodeCursor<{ date: number; id: string }>(
        options.cursor,
      );
      if (cursor) {
        query.andWhere('order.id < :id', {
          id: cursor.id,
        });
      }
    }

    const [entities, rowCount] = await Promise.all([
      query.getMany(),
      countQuery.getCount(),
    ]);

    const lastItem =
      entities.length > 0 ? entities[entities.length - 1] : undefined;

    const maxCancelDurationParameter = await this.parameterService.getOne(
      ParameterKeys.CANCEL_DURATION,
    );

    const maxCancelDuration = maxCancelDurationParameter
      ? Number(maxCancelDurationParameter.value)
      : undefined;

    return {
      data: entities.map((entity) => {
        const model = new ListOrderReadModel({
          ...entity,
          remainingItemPrice: entity.remainingItemPrice || null,
        });
        maxCancelDuration
          ? (model.maxCancelDuration = maxCancelDuration)
          : void 0;
        return model;
      }),
      metadata: {
        rowCount,
        nextCursor: lastItem
          ? this.encodeCursor({
              id: lastItem.id,
            })
          : undefined,
      },
    };
  }

  async listOrderHistories(
    identity: UserIdentity,
    filter?: { externalIds?: string[]; keyword?: string },
    options?: { limit?: number; cursor?: string },
  ): Promise<Collection<ListOrderReadModel>> {
    const limit = options?.limit || DEFAULT_QUERY_LIMIT;

    const maxDate = DateTime.now()
      .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
      .startOf('day')
      .minus({ day: TRANSACTION_DATE_LIMIT })
      .toJSDate();

    const query = this.dataSource
      .createQueryBuilder(TypeOrmOrderEntity, 'order')
      .leftJoin('order.bill', 'bill')
      .addOrderBy('order.documentDate', 'DESC')
      .addOrderBy('order.id', 'DESC')
      .andWhere('order.customerId = :customerId', {
        customerId: identity.externalId,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('order.deletedAt IS NOT NULL')
            .orWhere('order.documentDate < :maxDate', {
              maxDate,
            })
            .orWhere('bill.status = :status', { status: '1' });
        }),
      )
      .limit(limit);

    if (filter && filter.keyword) {
      // query.distinct(true);
      // query.innerJoin('order.items', 'items');
      // query.andWhere(
      //   `product_text_search(items.materialTitleName, items.itemName) @@ plainto_tsquery('${filter.keyword}')`,
      // );
      // query.andWhere(
      //   // see https://postgres.cz/wiki/PostgreSQL_SQL_Tricks_I#Predicate_IN_optimalization
      //   `items.materialId IN (VALUES ${filter.externalIds
      //     .map((x) => `('${x}')`)
      //     .join(',')})`,
      // );
      query.andWhere(
        `order.id IN 
          (SELECT items.m_order_header_id FROM order_item_hist items
            WHERE
              :keyword % any(string_to_array(items.material_title_name, ' '))
              OR :keyword % any(
                string_to_array(items.material_desc, ' ')
              )
          )`,
        {
          keyword: filter.keyword,
        },
      );
    }

    const countQuery = query.clone();

    if (options?.cursor) {
      const cursor = this.decodeCursor<{ date: number; id: string }>(
        options.cursor,
      );
      if (cursor) {
        query.andWhere('order.id < :id', {
          id: cursor.id,
        });
      }
    }

    const [entities, rowCount] = await Promise.all([
      query.getMany(),
      countQuery.getCount(),
    ]);

    const lastItem =
      entities.length > 0 ? entities[entities.length - 1] : undefined;

    const maxCancelDurationParameter = await this.parameterService.getOne(
      ParameterKeys.CANCEL_DURATION,
    );

    const maxCancelDuration = maxCancelDurationParameter
      ? Number(maxCancelDurationParameter.value)
      : undefined;

    return {
      data: entities.map((entity) => {
        const model = new ListOrderReadModel({
          ...entity,
          remainingItemPrice: entity.remainingItemPrice || null,
        });
        maxCancelDuration
          ? (model.maxCancelDuration = maxCancelDuration)
          : void 0;
        return model;
      }),
      metadata: {
        rowCount,
        nextCursor: lastItem
          ? this.encodeCursor({
              id: lastItem.id,
            })
          : undefined,
      },
    };
  }

  /**
   * @deprecated use `listOrders` or `listOrderHistories` instead
   * @param params
   * @returns
   */
  async listOrder(
    params: ListProductParams,
  ): Promise<PaginatedCollection<OrderReadModel>> {
    const { identity } = params;
    const { offset, page, pageSize } = PaginationUtil.getPaginationParams(
      params.page,
      params.pageSize,
    );
    const isWholesale = identity.externalId.includes('WS');

    const query = this.dataSource
      .createQueryBuilder(TypeOrmOrderHeaderMainEntity, 'order')
      .where('order.customerId = :customerId', {
        customerId: identity.externalId,
      })
      .orderBy('order.createdAt', 'DESC')
      .addOrderBy('order.id', 'DESC')
      .leftJoin(
        'order.deliveries',
        'deliveries',
        `LTRIM(order.sales_order_code, '0') = LTRIM(deliveries.so_number, '0')`,
      )
      .leftJoin('order.billing', 'billing')
      .take(pageSize)
      .skip(offset);

    if (params.isDelivered !== undefined) {
      // delivered order
      if (params.isDelivered) {
        query.andWhere('order.documentDate >= :documentDate', {
          documentDate: DateTime.now().startOf('day').minus({
            day: TRANSACTION_DATE_LIMIT,
          }),
        });
        if (isWholesale) {
          query
            .andWhere(
              new Brackets((qb) => {
                qb.where('delivery.soNumber IS NOT NULL').andWhere(
                  new Brackets((qbs) => {
                    qbs
                      .where('billing.status = :status', { status: '0' })
                      .orWhere('billing.soNumber IS NULL');
                  }),
                );
              }),
            )
            .andWhere('billing.flagWs = :flagWs', { flagWs: 'X' })
            .andWhere('order.deletedAt IS NULL');
        } else {
          query.andWhere('order.status >= :status', {
            status: OrderStatus.SHIPPED,
          });
        }
        // undelivered order
      } else {
        query
          .andWhere('order.deletedAt IS NULL')
          .andWhere('order.transactionDate >= :transactionDate', {
            transactionDate: DateTime.now().startOf('day').minus({
              day: TRANSACTION_DATE_LIMIT,
            }),
          });
        if (isWholesale) {
          query
            .andWhere('deliveries.soNumber IS NULL')
            .andWhere('billing.soNumber IS NULL');
        } else {
          query
            .andWhere('order.status < :status', { status: OrderStatus.SHIPPED })
            .andWhere('order.status != :cancelledStatus', {
              cancelledStatus: OrderStatus.CANCELLED_BY_CUSTOMER,
            });
        }
      }
      // order history
    } else if (params.isHistory) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('order.deletedAt IS NOT NULL')
            .orWhere('order.transactionDate < :transactionDate', {
              transactionDate: DateTime.now().startOf('day').minus({
                day: TRANSACTION_DATE_LIMIT,
              }),
            })
            .orWhere(
              new Brackets((qbs) => {
                qbs.where('billing.status = :status', { status: '1' });
                if (isWholesale)
                  qbs.andWhere('billing.flagWs = :flagWs', { flagWs: 'X' });
                else
                  qbs.andWhere(
                    new Brackets((qbx) =>
                      qbx
                        .where('billing.flagWs = :flagWs', { flagWs: '' })
                        .orWhere('billing.flagWs IS NULL'),
                    ),
                  );
              }),
            );
        }),
      );
    }

    if (params.materialIds && params.materialIds.length > 0) {
      const subquery = await this.dataSource
        .createQueryBuilder(TypeOrmOrderHeaderEntity, 'header')
        .select('header.id')
        .leftJoin('header.items', 'items')
        .where('items.materialId in (:...materialIds)')
        .getQuery();

      query.andWhere(`order.id IN (${subquery})`, {
        materialIds: params.materialIds,
      });
    }

    const [orders, totalCount] = await query.getManyAndCount();

    return {
      data: orders.map(this.orderMapper.toReadModel),
      metadata: {
        page,
        pageSize,
        totalCount,
      },
    };
  }

  /**
   *
   * @param identity
   * @param id
   */
  async getOrderInfo(
    identity: UserIdentity,
    id: string,
    isDummy: false,
  ): Promise<OrderReadModel | undefined> {
    let query: SelectQueryBuilder<
      | TypeOrmOrderHeaderEntity
      | TypeOrmOrderHeaderHistoryEntity
      | TypeOrmOrderHeaderDummyEntity
    >;

    if (isDummy) {
      query = this.dataSource.createQueryBuilder(
        TypeOrmOrderHeaderDummyEntity,
        'order',
      );
    } else {
      const ifOnHeaderHist = await this.dataSource
        .createQueryBuilder(TypeOrmOrderHeaderHistoryEntity, 'order')
        .select('1')
        .where({ id })
        .getExists();

      query = ifOnHeaderHist
        ? this.dataSource.createQueryBuilder(
            TypeOrmOrderHeaderHistoryEntity,
            'order',
          )
        : this.dataSource.createQueryBuilder(TypeOrmOrderHeaderEntity, 'order');
    }

    query
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect(
        'order.deliveryAddress',
        'deliveryAddress',
        'deliveryAddress.buyerExternalId = order.customerId',
      )
      .leftJoinAndSelect('items.material', 'material')
      .leftJoinAndMapMany(
        'order.deliveries',
        TypeOrmDeliveryHeader,
        'deliveries',
        // TODO consider removing LTRIM
        `LTRIM(order.sales_order_code, '0') = LTRIM(deliveries.so_number, '0')`,
      )
      .leftJoinAndSelect('deliveries.items', 'deliveryItems')
      .where('order.id = :id', { id })
      .andWhere('order.customerId = :customerId', {
        customerId: identity.externalId,
      })
      .orderBy('items.sequance::int', 'ASC');

    const entity = await query.getOne();

    return entity ? this.orderMapper.toReadModel(entity) : undefined;
  }

  /*
   * @param identity
   * @param id
   */
  async getOrderStatusHistory(
    identity: UserIdentity,
    id: string,
    isDummy: false,
  ): Promise<OrderReadModel | undefined> {
    const query = this.dataSource
      .createQueryBuilder(
        isDummy ? TypeOrmOrderHeaderDummyEntity : TypeOrmOrderHeaderMainEntity,
        'order',
      )
      .leftJoinAndSelect('order.trackings', 'trackings')
      .where('order.id = :id', { id })
      .andWhere('order.customerId = :customerId', {
        customerId: identity.externalId,
      })
      .orderBy('trackings.id', 'ASC');

    const entity = await query.getOne();

    return entity ? this.orderMapper.toReadModel(entity) : undefined;
  }

  async listOrderReturn(
    identity: UserIdentity,
    filter: {
      docNo?: string;
    },
    options?: { limit?: number; page?: number },
  ): Promise<any> {
    const limit = options?.limit || DEFAULT_QUERY_LIMIT;
    const page = options?.page || 1;

    const queryAll = this.dataSource
      .createQueryBuilder(TypeOrmOrderHeaderEntity, 'order')
      .andWhere('order.customerId = :customerId', {
        customerId: identity.externalId,
      })
      .addOrderBy('order.documentDate', 'DESC')
      .addOrderBy('order.id', 'DESC')
      .andWhere('order.deletedAt IS NULL')
      .andWhere('order.status = :status', { status : OrderStatus.CONFIRMED});

      
    if (filter && filter.docNo) {
      queryAll
        .andWhere('order.documentNumber = :docNo', {docNo: filter.docNo})
    }

    const queryLimit = queryAll
      .take(limit)
      .skip((page - 1) * limit);

    const countQuery = queryAll.clone();

    const [entitiesHeader, rowCount] = await Promise.all([
      queryLimit.getMany(),
      countQuery.getCount(),
    ]);

    let data: any[] = [];
    for (const header of entitiesHeader) {
      const details = await this.dataSource
        .createQueryBuilder(TypeOrmOrderItemEntity, 'detail')
        .where('detail.m_order_header_id = :headerId', { headerId: header.id })
        .getMany();

        data.push({
          header,
          details
        });
    };

    return {
      data: {
        listData: data
      },
      metadata: {
        page: page,
        limit: limit,
        total: rowCount,
      }
    };
  }

  async listOrderHistoryReturn(
    identity: UserIdentity,
    filter: {
      docNo?: string;
    },
    options?: { limit?: number; page?: number },
  ): Promise<any> {
    const limit = options?.limit || DEFAULT_QUERY_LIMIT;
    const page = options?.page || 1;
    
    const queryAll = this.dataSource
      .createQueryBuilder(TypeOrmOrderHeaderHistoryEntity, 'order')
      .andWhere('order.customerId = :customerId', {
      customerId: identity.externalId,
      })
      .addOrderBy('order.documentDate', 'DESC')
      .addOrderBy('order.id', 'DESC')
      .andWhere('order.deletedAt IS NULL')
      .andWhere('order.status NOT IN (:...statuses)', {
        statuses: [OrderStatus.CONFIRMED, OrderStatus.NOT_CONFIRMED],
      });

    if (filter && filter.docNo) {
      queryAll
        .andWhere('order.documentNumber = :docNo', {docNo: filter.docNo})
    }

    const queryLimit = queryAll
      .take(limit)
      .skip((page - 1) * limit);

    const countQuery = queryAll.clone();

    const [entitiesHeader, rowCount] = await Promise.all([
      queryLimit.getMany(),
      countQuery.getCount(),
    ]);

    let data: any[] = [];
    for (const header of entitiesHeader) {
      const details = await this.dataSource
        .createQueryBuilder(TypeOrmOrderItemHistoryEntity, 'detail')
        .where('detail.m_order_header_id = :headerId', { headerId: header.id })
        .getMany();

        data.push({
          header,
          details
        });
    };

    return {
      data: {
        listData: data
      },
      metadata: {
        page: page,
        limit: limit,
        total: rowCount,
      }
    };
  }
}
