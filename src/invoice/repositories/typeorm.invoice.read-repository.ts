import { DateTime } from 'luxon';
import { DataSource } from 'typeorm';

import { InjectDataSource } from '@nestjs/typeorm';
import { PaginationUtil, UserIdentity } from '@wings-online/common';
import { BaseReadRepository } from '@wings-online/common/repositories/base.read-repository';
import { Collection, PaginatedCollection } from '@wo-sdk/core';
import { DEFAULT_QUERY_LIMIT } from '@wo-sdk/nest-http';

import {
  TypeOrmBillingHeaderEntity,
  TypeOrmBillingPromoEntity,
  TypeOrmMaterialEntity,
} from '../entities';
import { TypeOrmInvoiceEntity } from '../entities/typeorm.invoice.entity';
import { TypeOrmOverdueInvoiceEntity } from '../entities/typeorm.overdue-invoice.entity';
import { IInvoiceReadRepository, ListInvoiceParams } from '../interfaces';
import {
  InvoiceStatus,
  InvoiceStatusEnum,
  InvoiceTypeEnum,
} from '../invoice.constants';
import { InvoiceMapper } from '../mapper/invoice.read-model.mapper';
import {
  InvoiceDetailReadModel,
  InvoiceOverdueReadModel,
  InvoiceReadModel,
} from '../read-models';
import { OverdueInvoiceReadModel } from '../read-models/overdue-invoice.read-model';

export class TypeOrmInvoiceReadRepository
  extends BaseReadRepository
  implements IInvoiceReadRepository
{
  private invoiceMapper: InvoiceMapper;
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    super();
    this.invoiceMapper = new InvoiceMapper();
  }

  async listOverdueInvoices(
    identity: UserIdentity,
  ): Promise<OverdueInvoiceReadModel[]> {
    const payerIds = this.getPayerIdFromIdentity(identity);

    const entities = await this.dataSource
      .createQueryBuilder(TypeOrmOverdueInvoiceEntity, 'invoice')
      .select(['invoice.id', 'invoice.total', 'invoice.dueDate'])
      .andWhere(`invoice.status = :status`, { status: '0' })
      .andWhere(`invoice.payer in (:...payerIds)`, {
        payerIds,
      })
      .getMany();

    return entities.map((entity) => {
      return new OverdueInvoiceReadModel({
        id: entity.id,
        amount: entity.total,
        dueDate: entity.dueDate,
      });
    });
  }

  async getInvoiceOverdue(
    identity: UserIdentity,
  ): Promise<InvoiceOverdueReadModel> {
    const payerIds = this.getPayerIdFromIdentity(identity);
    if (!payerIds.length) {
      return new InvoiceOverdueReadModel({
        overdueAmount: 0,
        overdueCount: 0,
        total: 0,
      });
    }

    const baseQuery = this.dataSource
      .createQueryBuilder(TypeOrmBillingHeaderEntity, 'billing')
      .leftJoin('billing.orderHeader', 'orderHeader')
      .where(`billing.status = '0'`)
      .andWhere(`LTRIM(billing.payer, '0') in (:...payerIds)`, {
        payerIds,
      });

    const [all, overdue] = await Promise.all([
      baseQuery.select(['SUM(billing.total)']).getRawOne<{ sum: number }>(),
      baseQuery
        .select(['COUNT(billing.id)', 'SUM(billing.total)'])
        .andWhere(
          `now() >= (date_trunc('day', billing.dueDate) + interval '1 day')`,
        )
        .getRawOne<{ count: string; sum: number }>(),
    ]);

    return new InvoiceOverdueReadModel({
      overdueAmount: overdue?.sum || 0,
      overdueCount: Number(overdue?.count || ''),
      total: all?.sum || 0,
    });
  }

  async listInvoices(
    identity: UserIdentity,
    status: InvoiceStatus,
    options: { limit?: number; cursor?: string },
  ): Promise<Collection<InvoiceReadModel>> {
    const payerIds = this.getPayerIdFromIdentity(identity);
    if (payerIds.length <= 0) {
      return {
        data: [],
        metadata: {
          rowCount: 0,
        },
      };
    }

    const query = this.dataSource
      .createQueryBuilder(TypeOrmInvoiceEntity, 'invoice')
      .andWhere('invoice.status = :status', {
        status:
          status === 'PAID' ? InvoiceStatusEnum.PAID : InvoiceStatusEnum.UNPAID,
      })
      .andWhere('invoice.payer in (:...payerIds)', { payerIds })
      .addOrderBy('invoice.date', 'DESC')
      .addOrderBy('invoice.id', 'ASC');

    const countQuery = query.clone();

    if (options?.cursor) {
      const decoded = this.decodeCursor<{ date: string; id: number }>(
        options.cursor,
      );
      if (decoded) {
        query.andWhere(
          '((invoice.date <= :date and invoice.id > :id) or invoice.date < :date)',
          {
            date: DateTime.fromJSDate(new Date(decoded.date), {
              zone: 'Asia/Jakarta',
            }).toFormat('yyyy-MM-dd'),
            id: decoded.id,
          },
        );
      }
    }

    const limit = options.limit || DEFAULT_QUERY_LIMIT;
    query.limit(limit);

    const [entities, rowCount] = await Promise.all([
      query.getMany(),
      countQuery.getCount(),
    ]);

    let nextCursor: string | undefined;

    if (entities.length > 0) {
      const lastItem = entities[entities.length - 1];
      if (lastItem) {
        nextCursor = this.encodeCursor({
          date: lastItem.date.toISOString(),
          id: lastItem.id,
        });
      }
    }

    return {
      data: entities.map((entity) =>
        this.invoiceMapper.toReadModel({
          ...entity,
          invoiceDate: entity.date,
        }),
      ),
      metadata: {
        rowCount,
        nextCursor,
      },
    };
  }

  /**
   * @deprecated use `listInvoices` instead
   * @param params
   * @returns
   */
  async listInvoice(
    params: ListInvoiceParams,
  ): Promise<PaginatedCollection<InvoiceReadModel>> {
    const { identity } = params;
    const { offset, page, pageSize } = PaginationUtil.getPaginationParams(
      params.page,
      params.pageSize,
    );

    const payerIds = this.getPayerIdFromIdentity(identity);
    if (!payerIds.length) {
      return {
        data: [],
        metadata: {
          page,
          pageSize,
          totalCount: 0,
        },
      };
    }

    const query = this.dataSource
      .createQueryBuilder(TypeOrmBillingHeaderEntity, 'billing')
      .leftJoin('billing.orderHeader', 'orderHeader')
      .where('billing.status = :status', {
        status: params.status === InvoiceTypeEnum.PAID ? '1' : '0',
      })
      .andWhere(`LTRIM(billing.payer, '0') in (:...payerIds)`, {
        payerIds,
      })
      .take(pageSize)
      .skip(offset);

    query.orderBy('billing.invoiceDate', 'DESC');

    const [invoices, totalCount] = await query.getManyAndCount();

    return {
      data: invoices.map(this.invoiceMapper.toReadModel),
      metadata: {
        page,
        pageSize,
        totalCount,
      },
    };
  }

  async getInvoiceDetail(
    invoiceNumber: string,
    identity: UserIdentity,
  ): Promise<InvoiceDetailReadModel | undefined> {
    const payerIds = this.getPayerIdFromIdentity(identity);
    if (!payerIds.length) return;

    const data = await this.dataSource
      .createQueryBuilder(TypeOrmBillingHeaderEntity, 'billing')
      .innerJoinAndSelect('billing.items', 'items')
      .leftJoinAndMapOne(
        'items.item',
        TypeOrmMaterialEntity,
        'invoiceItem',
        `LTRIM(items.itemId, '0') = invoiceItem.itemId AND invoiceItem.entity = :organization`,
        { organization: identity.organization },
      )
      .leftJoinAndMapMany(
        'items.promos',
        TypeOrmBillingPromoEntity,
        'invoicePromo',
        `items.invoiceNumber = invoicePromo.invoiceNumber AND LTRIM(items.itemId, '0') = invoicePromo.itemId`,
      )
      .where('billing.number = :invoiceNumber', {
        invoiceNumber,
      })
      .andWhere(`LTRIM(billing.payer, '0') in (:...payerIds)`, {
        payerIds,
      })
      .andWhere('items.total > 0')
      .getOne();

    if (!data) return;

    return new InvoiceDetailReadModel({
      invoiceNumber: data.number,
      soNumber: data.soNumber,
      subtotal: data.subTotal,
      discount: Math.abs(data.discount),
      total: data.total,
      dueDate: data.dueDate,
      jackPoint: data.jackPoint,
      queenPoint: data.queenPoint,
      kingPoint: data.kingPoint,
      items:
        data.items?.map((item) => ({
          imageUrl: item.item?.image || '',
          name: item.item?.name || '',
          baseQty: item.baseQty,
          baseUom: item.baseUom,
          packQty: item.packQty,
          packUom: item.packUom,
          total: item.total,
          discount:
            item.promos?.reduce((acc, promo) => {
              acc += Math.abs(promo.discount);
              return acc;
            }, 0) || 0,
        })) || [],
    });
  }

  private getPayerIdFromIdentity(identity: UserIdentity): string[] {
    // @BEN from the data in DB it seems that payer field is
    // padded by '0' to 10 char len but only for non WS
    // instead of using LTRIM in query (which is slow), better to pad our params
    const ids: string[] = [];

    if (identity.division.dry && identity.division.dry.payerId) {
      if (identity.organization === 'WS') {
        ids.push(identity.division.dry.payerId);
      } else {
        ids.push(identity.division.dry.payerId.padStart(10, '0'));
      }
    }

    if (identity.division.frozen && identity.division.frozen.payerId) {
      if (identity.organization === 'WS') {
        ids.push(identity.division.frozen.payerId);
      } else {
        ids.push(identity.division.frozen.payerId.padStart(10, '0'));
      }
    }

    return ids;
  }
}
