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
          problem: item.header.alerts.find(
            (as) => as.alertNo === item.header.alertNo,
          )?.reasonDesc,
          solution: item.header.solutions.find(
            (as) => as.alertNo === item.header.alertNo,
          )?.reasonDesc,
          item: {
            productDesc: item.details.find(
              (as) => as.alertNo === item.header.alertNo,
            )?.produkDesc,
            qty: item.details.find((as) => as.alertNo === item.header.alertNo)
              ?.jumlahSelisih,
            uom: item.details.find((as) => as.alertNo === item.header.alertNo)
              ?.uom,
          },
        };
      }),
    };
  }
}
