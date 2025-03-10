import { OpensearchModule } from 'nestjs-opensearch';

import { HttpModule } from '@nestjs/axios';
import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpensearchModuleOptionsProvider } from '@wings-online/providers';
import { TypeOrmUnitOfWorkModule } from '@wo-sdk/nest-typeorm-uow';

import { CommandControllers, CommandHandlers } from './commands';
import { Factories } from './domains';
import {
  TypeOrmBillingHeaderEntity,
  TypeOrmCustomerEntity,
  TypeOrmCustomerInfoEntity,
  TypeOrmCustomerShippingAddress,
  TypeOrmCustomerShippingAddressWS,
  TypeOrmDeliveryAddressEntity,
  TypeOrmDeliveryHeader,
  TypeOrmDeliveryItemEntity,
  TypeOrmMaterialEntity,
  TypeOrmOrderHeaderDummyEntity,
  TypeOrmOrderHeaderEntity,
  TypeOrmOrderHeaderHistoryEntity,
  TypeOrmOrderHeaderMainEntity,
  TypeOrmOrderItemDummyEntity,
  TypeOrmOrderItemEntity,
  TypeOrmOrderItemHistoryEntity,
  TypeOrmTrackingStatusEntity,
} from './entities';
import { TypeOrmBillEntity } from './entities/typeorm.bill.entity';
import { TypeOrmDeliveryEntity } from './entities/typeorm.delivery.entity';
import { TypeOrmOrderEntity } from './entities/typeorm.order.entity';
import {
  LEGACY_ORDER_SERVICE,
  ORDER_READ_REPOSITORY,
  ORDER_WRITE_REPOSITORY,
  PRODUCT_SEARCH_READ_REPOSITORY,
} from './order.constants';
import { QueryControllers, QueryHandlers } from './queries';
import {
  OpensearchProductSearchReadRepository,
  TypeOrmOrderReadRepository,
  TypeOrmOrderWriteRepository,
} from './repositories';
import { LegacyOrderService } from './services/legacy-order.service';
import { OrderChangedSubscriber } from './subscribers';

const Entities = [
  TypeOrmCustomerEntity,
  TypeOrmCustomerInfoEntity,
  TypeOrmOrderHeaderEntity,
  TypeOrmOrderItemEntity,
  TypeOrmOrderHeaderHistoryEntity,
  TypeOrmOrderItemHistoryEntity,
  TypeOrmOrderHeaderDummyEntity,
  TypeOrmOrderItemDummyEntity,
  TypeOrmDeliveryHeader,
  TypeOrmDeliveryItemEntity,
  TypeOrmMaterialEntity,
  TypeOrmCustomerShippingAddress,
  TypeOrmCustomerShippingAddressWS,
  TypeOrmTrackingStatusEntity,
  TypeOrmDeliveryAddressEntity,
  TypeOrmOrderHeaderMainEntity,
  TypeOrmBillingHeaderEntity,
  TypeOrmOrderEntity,
  TypeOrmDeliveryEntity,
  TypeOrmBillEntity,
];

const Repositories: Provider<any>[] = [
  {
    provide: ORDER_READ_REPOSITORY,
    useClass: TypeOrmOrderReadRepository,
  },
  {
    provide: PRODUCT_SEARCH_READ_REPOSITORY,
    useClass: OpensearchProductSearchReadRepository,
  },
  {
    provide: ORDER_WRITE_REPOSITORY,
    useClass: TypeOrmOrderWriteRepository,
  },
];

const Subscribers = [OrderChangedSubscriber];

const Services: Provider<any>[] = [
  {
    provide: LEGACY_ORDER_SERVICE,
    useClass: LegacyOrderService,
  },
];

const Providers = [
  ...CommandHandlers,
  ...Repositories,
  ...Factories,
  ...Repositories,
  ...QueryHandlers,
  ...Subscribers,
  ...Services,
];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature(Entities),
    TypeOrmUnitOfWorkModule,
    OpensearchModule.forRootAsync({
      inject: [ConfigService],
      useClass: OpensearchModuleOptionsProvider,
    }),
    HttpModule,
  ],
  controllers: [...CommandControllers, ...QueryControllers],
  providers: Providers,
})
export class OrderModule {}
