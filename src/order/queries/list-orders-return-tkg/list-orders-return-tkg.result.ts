import { OrderStatus } from '@wings-online/order/order.constants';
import { ParameterValue } from '@wings-online/parameter/interfaces';
import { ParameterKeys } from '@wings-online/parameter/parameter.constants';

export class ListOrdersReturnTkgResult {
  constructor(
    parameters: ParameterValue[],
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
            createdAt: item.header.docDate,
            discount: detail.discPrice,
            documentNumber: detail.docNo,
            itemName: detail.name,
            materialId: detail.materialId,
            newMaterialId: matchedItem.id,
            price: detail.netPrice,
            priceValue: detail.netPrice,
            qtyBase: detail.qtyPack,
            qtyPack: detail.qtyCase,
            baseUom: detail.baseUnit,
            packUom: detail.slsUnit,
            sequence: detail.item,
            totalBought: detail.qtyCase,
            typeBought: detail.slsUnit,
            orderHeaderId: detail.orderHeaderId,
            mMaterialId: detail.materialId,
            materialTitleName: matchedItem.name,
            materialImage: matchedItem.image_url,
            pricePcs: detail.price_pcs,
            returnReason: parameters.find((r) => r.value === detail.return)
              ?.desc,
          },
        };
      });

      const data = {
        status: item.history[0].soStatus,
        docNumber: item.header.docNo,
        date: Math.floor(new Date(item.header.docDate).getTime() / 1000),
        reason: parameters.find((r) => r.value === item.header.reason)?.desc,
        order_tkg_in: enrichedDetails.filter(
          (item) =>
            item.orderType ===
            parameters
              .find((r) => r.key == ParameterKeys.TKG_ORDER_TYPE)
              ?.value.split(',')[0],
        ),
        order_tkg_out: enrichedDetails.filter(
          (item) =>
            item.orderType ===
            parameters
              .find((r) => r.key == ParameterKeys.TKG_ORDER_TYPE)
              ?.value.split(',')[1],
        ),
      };

      if (data.order_tkg_in.length > 0 || data.order_tkg_out.length > 0)
        listData.push(data);
    }

    for (const item of propsOrderWO.data) {
      const data = {
        status: Object.keys(OrderStatus).find(
          (key) => OrderStatus[key] == item?.header?.status,
        ),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: Math.floor(new Date(item?.header?.documentDate).getTime() / 1000),
        reason: parameters.find((r) => r.value === item.details[0].returnReason)
          ?.desc,
        order_tkg_in: item.details
          ?.filter((item) => item.orderType === 'ZT01')
          .map((item) => {
            return {
              ...item,
              returnReason: parameters.find(
                (r) => r.value === item.returnReason,
              )?.desc,
            };
          }),
        order_tkg_out: item.details
          ?.filter((item) => item.orderType === 'ZT02')
          .map((item) => {
            return {
              ...item,
              returnReason: parameters.find(
                (r) => r.value === item.returnReason,
              )?.desc,
            };
          }),
      };

      if (data.order_tkg_in.length > 0 || data.order_tkg_out.length > 0)
        listData.push(data);
    }

    for (const item of propsOrderWOHist.data) {
      const data = {
        status: Object.keys(OrderStatus).find(
          (key) => OrderStatus[key] === item?.header?.status,
        ),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: Math.floor(new Date(item?.header?.documentDate).getTime() / 1000),
        reason: parameters.find((r) => r.value === item.details[0].returnReason)
          ?.desc,
        order_tkg_in: item.details
          ?.filter((item) => item.orderType === 'ZT01')
          .map((item) => {
            return {
              ...item,
              returnReason: parameters.find(
                (r) => r.value === item.returnReason,
              )?.desc,
            };
          }),
        order_tkg_out: item.details
          ?.filter((item) => item.orderType === 'ZT02')
          .map((item) => {
            return {
              ...item,
              returnReason: parameters.find(
                (r) => r.value === item.returnReason,
              )?.desc,
            };
          }),
      };

      if (data.order_tkg_in.length > 0 || data.order_tkg_out.length > 0)
        listData.push(data);
    }

    return {
      metadata: {
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
      data: listData,
    };
  }
}
