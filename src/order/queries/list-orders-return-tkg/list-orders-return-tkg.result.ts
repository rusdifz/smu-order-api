import { OrderStatus } from '@wings-online/order/order.constants';

export class ListOrdersReturnTkgResult {
  constructor(
    materialForSFA: any,
    page: any,
    limit: any,
    propsSFA: any,
    propsOrderWO: any,
    propsOrderWOHist: any,
  ) {
    const listData: any[] = [];
    const itemMap = new Map(
      materialForSFA.items.map((item) => [item.external_id, item]),
    );

    for (const item of propsSFA.data.listData) {
      const enrichedDetails = item.details.map((detail) => {
        const matchedItem = itemMap.get(detail.materialId) as Record<
          string,
          any
        >;
        return {
          ...{
            orderType: detail.orderTypeId,
            createdAt: '2025-05-02T15:45:41.610Z',
            discount: detail.discPrice,
            documentNumber: detail.docNo,
            itemName: detail.name,
            materialId: detail.materialId,
            newMaterialId: matchedItem.id,
            price: detail.netPrice,
            priceValue: detail.netPrice,
            qtyBase: 0,
            qtyPack: matchedItem.pack_qty,
            baseUom: matchedItem.base_uom,
            packUom: matchedItem.pack_uom,
            sequence: '1',
            soNumber: null,
            totalBought: detail.qtyPack,
            totalSent: null,
            typeBought: detail.slsUnit,
            orderHeaderId: 66292579,
            mMaterialId: null,
            materialTitleName: matchedItem.name,
            materialImage: matchedItem.image_url,
            flashSaleId: '',
            pricePcs: 7900,
            discountPcs: 0,
            coinAmount: 0,
            coinPcs: 0,
            rewardVoucherId: null,
            voucherAmount: null,
            voucherBrand: null,
            freeProductFlag: '',
            voucherPercent: null,
            minPurchaseAmount: null,
            maxDiscount: null,
            coinVoucher: null,
            flagRecommendation: '',
          },
        };
      });

      const data = {
        status: item.history[0].soStatus,
        docNumber: item.header.docNo,
        date: Math.floor(new Date(item.header.docDate).getTime() / 1000),
        reason: item.header.reason,
        order_tkg_in: enrichedDetails.filter(
          (item) => item.orderType === 'ZS21',
        ),
        order_tkg_out: enrichedDetails.filter(
          (item) => item.orderType === 'ZS22',
        ),
      };

      listData.push(data);
    }

    for (const item of propsOrderWO.data.listData) {
      const data = {
        status: Object.keys(OrderStatus).find(
          (key) => OrderStatus[key] == item?.header?.status,
        ),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: Math.floor(new Date(item?.header?.documentDate).getTime() / 1000),
        reason: item.details[0].returnReason,
        order_tkg_in: item.details?.filter((item) => item.orderType === 'ZS21'),
        order_tkg_out: item.details?.filter(
          (item) => item.orderType === 'ZS22',
        ),
      };

      listData.push(data);
    }

    for (const item of propsOrderWOHist.data.listData) {
      const data = {
        status: Object.keys(OrderStatus).find(
          (key) => OrderStatus[key] === item?.header?.status,
        ),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: Math.floor(new Date(item?.header?.documentDate).getTime() / 1000),
        reason: item.details[0].returnReason,
        order_tkg_in: item.details?.filter((item) => item.orderType === 'ZS21'),
        order_tkg_out: item.details?.filter(
          (item) => item.orderType === 'ZS22',
        ),
      };

      listData.push(data);
    }

    return {
      metaData: {
        page: page,
        limit: limit,
        total: listData.length,
        // sfa: {
        //   page: parseInt(propsSFA?.data?.page),
        //   limit: parseInt(propsSFA?.data?.limit),
        //   total: parseInt(propsSFA?.data?.total),
        // },
        // wo: {
        //   page: parseInt(propsOrderWO?.metadata?.page),
        //   limit: parseInt(propsOrderWO?.metadata?.limit),
        //   total: parseInt(propsOrderWO?.metadata?.total),
        // },
        // wo_hist: {
        //   page: parseInt(propsOrderWOHist?.metadata?.page),
        //   limit: parseInt(propsOrderWOHist?.metadata?.limit),
        //   total: parseInt(propsOrderWOHist?.metadata?.total),
        // },
        // orderBy: propsSFA.data.orderBy,
        // order: propsSFA.data.order,
      },
      listData,
    };
  }
}
