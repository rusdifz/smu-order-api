import { OrderStatus } from "@wings-online/order/order.constants";

export class ListOrdersReturnTkgResult {

  constructor(propsSFA: any, propsOrderWO: any, propsOrderWOHist: any) {
    let listData: any[] = [];
    for (const item of propsSFA.data.listData) {
      const data = {
        status: item.history[0].soStatus,
        docNumber: item.header.docNo,
        date: item.header.docDate,
        reason: item.header.reason,
        items: item.details,
      };
      listData.push(data);
    }

    for (const item of propsOrderWO.data.listData) {
      const data = {
        status: Object.keys(OrderStatus).find(key => OrderStatus[key] == item?.header?.status),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: item?.header?.documentDate,
        reason: '',
        items: item?.details,
      };
      listData.push(data);
    }

    for (const item of propsOrderWOHist.data.listData) {
      const data = {
        status: Object.keys(OrderStatus).find(key => OrderStatus[key] === item?.header?.status),
        statusCode: item?.header?.status,
        docNumber: item?.header?.documentNumber,
        date: item?.header?.documentDate,
        reason: '',
        items: item?.details,
      };
      listData.push(data);
    }

    return {
      metaData: {
        sfa:{
          page: parseInt(propsSFA?.data?.page),
          limit: parseInt(propsSFA?.data?.limit),
          total: parseInt(propsSFA?.data?.total),
        },
        wo:{
          page: parseInt(propsOrderWO?.metadata?.page),
          limit: parseInt(propsOrderWO?.metadata?.limit),
          total: parseInt(propsOrderWO?.metadata?.total),
        },
        wo_hist:{
          page: parseInt(propsOrderWOHist?.metadata?.page),
          limit: parseInt(propsOrderWOHist?.metadata?.limit),
          total: parseInt(propsOrderWOHist?.metadata?.total),
        }
        // orderBy: propsSFA.data.orderBy,
        // order: propsSFA.data.order,
      },
      listData
    };
  }
  
}