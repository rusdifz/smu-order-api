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
          date: Math.floor(new Date(item.header.createdDate).getTime() / 1000),
          lastUpdateData: Math.max(
            0,
            Math.floor(new Date(item.header.changedDate).getTime() / 1000),
          ),
          problem: item.header.detailProblem,
          solution: item.header.solutions[0].reasonDesc,
          item: {
            productDesc: item.details[0].produkDesc,
            qty: item.details[0].jumlahSelisih,
            uom: item.details[0].uom,
          },
        };
      }),
    };
  }
}
