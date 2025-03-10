import { LoggerModule } from 'nestjs-pino';

import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  TypeOrmBillingHeaderEntity,
  TypeOrmBillingInvoiceEntity,
  TypeOrmBillingPromoEntity,
  TypeOrmMaterialEntity,
  TypeOrmOrderHeaderEntity,
} from './entities';
import { TypeOrmInvoiceEntity } from './entities/typeorm.invoice.entity';
import { TypeOrmOverdueInvoiceEntity } from './entities/typeorm.overdue-invoice.entity';
import { INVOICE_READ_REPOSITORY } from './invoice.constants';
import { QueryControllers, QueryHandlers } from './queries';
import { TypeOrmInvoiceReadRepository } from './repositories';

const Entities = [
  TypeOrmBillingHeaderEntity,
  TypeOrmOrderHeaderEntity,
  TypeOrmBillingInvoiceEntity,
  TypeOrmBillingPromoEntity,
  TypeOrmMaterialEntity,
  TypeOrmOverdueInvoiceEntity,
  TypeOrmInvoiceEntity,
];

const Repositories: Provider<any>[] = [
  {
    provide: INVOICE_READ_REPOSITORY,
    useClass: TypeOrmInvoiceReadRepository,
  },
];

const Providers = [...Repositories, ...QueryHandlers];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature(Entities),
    // TODO remove this if possible, most likeliy circular dependency issue
    LoggerModule.forRoot(),
  ],
  controllers: [...QueryControllers],
  providers: Providers,
})
export class InvoiceModule {}
