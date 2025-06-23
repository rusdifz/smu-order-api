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

    const groupedByDocNumber: Record<string, any> = {};

    for (const data of propsSFA.data.listData) {
      const docNumber = data.header.docNo;
      if (!groupedByDocNumber[docNumber]) {
        groupedByDocNumber[docNumber] = [];
      }
      for (const item of data.details) {
        groupedByDocNumber[docNumber].push(item);
      }
    }

    for (const [docNumber, item] of Object.entries(groupedByDocNumber)) {
      const header = propsSFA.data.listData.find(
        (h) => h.header.docNo == docNumber,
      ).header;
      const enrichedDetails = item.map((detail) => {
        const matchedItem = itemMap.get(detail.materialId) as Record<
          string,
          any
        >;

        return {
          ...{
            orderType: detail.orderTypeId,
            createdAt: header.docDate,
            discount: detail.discPrice,
            documentNumber: detail.docNo,
            itemName: detail.name,
            materialId: detail.materialId,
            newMaterialId: matchedItem.id,
            price: detail.netPrice,
            priceValue: detail.netPrice,
            sequence: detail.item,
            qtyPack: detail.qtyCase,
            packUom: detail.slsUnit,
            qtyBase: detail.qtyPack,
            baseUom: detail.baseUnit,
            totalBought: mapTotalBought(detail, matchedItem),
            typeBought: matchedItem.base_uom,
            orderHeaderId: detail.orderHeaderId,
            mMaterialId: detail.materialId,
            materialTitleName: matchedItem.name,
            materialImage: matchedItem.image_url,
            pricePcs: detail.price_pcs,
            returnReason: detail.reasonId,
          },
        };
      });

      const data = {
        docNumber: header.docNo,
        date: Math.floor(new Date(header.docDate).getTime() / 1000),
        reason: parameters.find((r) => r.value === header.reason)?.desc,
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
      if(item?.details) continue;

      const data = {
        status: Object.keys(OrderStatus).find(
          (key) => OrderStatus[key] == item?.header?.status,
        ),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: Math.floor(new Date(item?.header?.documentDate).getTime() / 1000),
        reason: item?.details[0].returnReason,
        order_tkg_in: item.details
          ?.filter(
            (item) =>
              item.orderType ===
              parameters.find(
                (r) => r.key == ParameterKeys.TKG_WO_IN_ORDER_TYPE,
              )?.value,
          )
          .map((item) => {
            return {
              ...item,
              returnReason: item.returnReason,
            };
          }),
        order_tkg_out: item.details
          ?.filter(
            (item) =>
              item.orderType ===
              parameters.find(
                (r) => r.key == ParameterKeys.TKG_WO_OUT_ORDER_TYPE,
              )?.value,
          )
          .map((item) => {
            return {
              ...item,
              returnReason: item.returnReason,
            };
          }),
      };

      if (data.order_tkg_in.length > 0 && data.order_tkg_out.length > 0)
        listData.push(data);
    }

    for (const item of propsOrderWOHist.data) {
      if(item?.details) continue;
      
      const data = {
        status: Object.keys(OrderStatus).find(
          (key) => OrderStatus[key] === item?.header?.status,
        ),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: Math.floor(new Date(item?.header?.documentDate).getTime() / 1000),
        reason: item.details[0].returnReason,
        order_tkg_in: item.details
          ?.filter(
            (item) =>
              item.orderType ===
              parameters.find(
                (r) => r.key == ParameterKeys.TKG_WO_IN_ORDER_TYPE,
              )?.value,
          )
          .map((item) => {
            return {
              ...item,
              returnReason: item.returnReason,
            };
          }),
        order_tkg_out: item.details
          ?.filter(
            (item) =>
              item.orderType ===
              parameters.find(
                (r) => r.key == ParameterKeys.TKG_WO_OUT_ORDER_TYPE,
              )?.value,
          )
          .map((item) => {
            return {
              ...item,
              returnReason: item.returnReason,
            };
          }),
      };

      if (data.order_tkg_in.length > 0 && data.order_tkg_out.length > 0)
        listData.push(data);
    }

    listData.sort((a, b) => b.date - a.date); // sort DESC
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

function mapTotalBought(detail: any, matchedItem: any): number {
  let totalBought = detail.qtyCase;
  if (detail.qtyPack > 0) {
    totalBought += detail.qtyPack * matchedItem.pack_qty;
  }
  return totalBought;
}
