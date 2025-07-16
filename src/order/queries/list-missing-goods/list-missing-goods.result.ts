export class ListMissingGoodsResult {
  constructor(props: any) {
    return {
      metadata: {
        page: props.data.page,
        limit: props.data.limit,
        total: props.data.total,
      },
      data: props.data.listData
        .filter((s) => s.header.helpdeskCat === 6)
        .map((item) => {
          return {
            cat: item.header.helpdeskCat,
            ticket: item.header.alertNo,
            status: item.header.alerts.find(
              (as) => as.alertNo === item.header.alertNo,
            )?.alertStatus,
            date: Math.floor(
              new Date(item.header.createdDate).getTime() / 1000,
            ),
            lastUpdateData: Math.max(
              0,
              Math.floor(new Date(item.header.changedDate).getTime() / 1000),
            ),
            itemsMissing: item.details.map((detail) => {
              return {
                ticket: item.header.alertNo,
                productDesc: detail.produkDesc,
                qty: detail.jumlahSelisih,
                uom: detail.uom,
                problem: item.header.detailProblem,
                solution: item.header.solutions.find(
                  (as) => as.alertNo === item.header.alertNo,
                ),
              };
            }),
          };
        }),
    };
  }
}
