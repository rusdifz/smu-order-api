import { BaseReadModelMapper } from '@wings-online/common';

import {
  TypeOrmOrderHeaderDummyEntity,
  TypeOrmOrderHeaderEntity,
  TypeOrmOrderHeaderHistoryEntity,
} from '../entities';
import {
  DeliveryAddressReadModel,
  OrderItemReadModel,
  OrderReadModel,
} from '../read-models';
import {
  DeliveryItemReadModel,
  DeliveryReadModel,
  ShippingAddressReadModel,
  TrackingStatusReadModel,
} from '../read-models/';

export class OrderMapper extends BaseReadModelMapper<
  | TypeOrmOrderHeaderEntity
  | TypeOrmOrderHeaderDummyEntity
  | TypeOrmOrderHeaderHistoryEntity,
  OrderReadModel
> {
  toReadModel(data: TypeOrmOrderHeaderEntity): OrderReadModel {
    return new OrderReadModel({
      id: data.id,
      invoiceCode: data.invoiceCode,
      soNumber: data.salesOrderCode,
      orderNo: data.orderNo,
      documentDate: data.documentDate,
      transactionDate: data.transactionDate,
      remainingItemPrice: data.remainingItemPrice,
      status: data.status,
      subTotal: data.subTotal,
      totalPrice: data.totalPrice,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      jackPoint: data.jackPoint,
      queenPoint: data.queenPoint,
      kingPoint: data.kingPoint,
      bonusCoin: data.coinTotal,
      regularDiscountTotal: data.regularDiscountTotal,
      voucherDiscountTotal: data.voucherDiscountTotal,
      maxDiscount: data.maxDiscount,
      creditMemo: data.creditMemo,
      voucherId: data.rewardVoucherId,
      voucherAmount: data.voucherAmountGe,
      voucherPercentage: data.voucherPersentGe,
      orderBy: data.orderBy,
      shippingDate: data.deliveryDate,
      flagCancelOrder: data.flagCancelOrder,
      shippingAddress: data.shippingAddress
        ? new ShippingAddressReadModel({
            id: data.shippingAddress.id,
            name: data.shippingAddress.name,
            address: data.shippingAddress.address,
          })
        : undefined,
      shippingAddressWS: data.shippingAddressWS
        ? new ShippingAddressReadModel({
            id: data.shippingAddressWS.id,
            name: data.shippingAddressWS.name,
            address: data.shippingAddressWS.address,
          })
        : undefined,
      deliveryAddress: data.deliveryAddress
        ? new DeliveryAddressReadModel({
            id: data.deliveryAddress.id,
            externalId: data.deliveryAddress.externalId,
            name: data.deliveryAddress.name,
            label: data.deliveryAddress.label,
            address: data.deliveryAddress.address,
          })
        : undefined,
      items: data.items?.map((item) => {
        const itemName =
          item.materialTitleName || item.material?.titleName || '';
        const imageUrl = item.materialImage || item.material?.image || '';
        return new OrderItemReadModel({
          materialId: item.materialId,
          newMaterialId: item.newMaterialId,
          itemName,
          imageUrl,
          price: item.price,
          discount: item.discount,
          discountPcs: item.discountPcs,
          baseQty: item.qtyBase,
          packQty: item.qtyPack,
          baseUom: item.baseUom,
          packUom: item.packUom,
          typeBought: item.typeBought,
          totalBought: item.totalBought,
          voucherAmount: item.voucherAmount,
          voucherPercentage: item.voucherPercent,
          maxDiscount: item.maxDiscount,
          voucherBrand: item.voucherBrand,
          freeProductFlag: item.freeProductFlag,
        });
      }),
      deliveries: data.deliveries?.map((delivery) => {
        return new DeliveryReadModel({
          id: delivery.id,
          number: delivery.deliveryNumber,
          soNumber: delivery.soNumber,
          status: delivery.deliveryStatus,
          items:
            delivery.items?.map((deliveryItem) => {
              return new DeliveryItemReadModel({
                id: deliveryItem.id,
                externalId: Number(deliveryItem.materialId),
                name: deliveryItem.materialTitleName || '',
                baseQty: deliveryItem.qtyBase,
                packQty: deliveryItem.qtyPack,
                price: deliveryItem.valueDelivery,
                imageUrl: deliveryItem.materialImage || '',
              });
            }) || [],
        });
      }),
      trackings: data.trackings?.map((tracking) => {
        return new TrackingStatusReadModel({
          id: tracking.id,
          documentNumber: tracking.documentNumber,
          deliveryNumber: tracking.deliveryNumber,
          status: tracking.status,
          redeliveryNumber: tracking.redeliveryNumber,
          createdAt: tracking.createdDate,
          insertedAt: tracking.insertDate,
        });
      }),
    });
  }
}
