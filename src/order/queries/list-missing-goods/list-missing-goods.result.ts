export class ListMissingGoodsResult {
  constructor(props: any) {
    return {
      metadata: {
        page: props.data.page,
        limit: props.data.limit,
        total: props.data.total,
      },
      data: props.data.listData.map((item) => {
        return {
          ticket: item.header.alertNo,
          status: item.header.alerts.find(
            (as) => as.alertNo === item.header.alertNo,
          )?.alertStatus,
          date: Math.floor(new Date(item.header.createdDate).getTime() / 1000),
          lastUpdateData: Math.max(
            0,
            Math.floor(new Date(item.header.changedDate).getTime() / 1000),
          ),
          itemsMissing: item.header.alerts.map((alert) => {
            return {
              ticket: alert.alertNo,
              productDesc: item.details.find(
                (as) => as.alertNo === alert.alertNo,
              )?.produkDesc,
              qty: item.details.find((as) => as.alertNo === alert.alertNo)
                ?.jumlahSelisih,
              uom: item.details.find((as) => as.alertNo === alert.alertNo)?.uom,
              problem: alert.reasonDesc,
              solution: item.header.solutions.find(
                (as) => as.alertNo === item.header.alertNo,
              )?.reasonDesc,
            };
          }),
        };
      }),
    };
  }
}
