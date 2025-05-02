export class ListOrdersReturnResult {

  constructor(props: any) {
    let listData: any[] = [];
    for (const item of props.data.listData) {
      const data = {
        status: item.history[0].soStatus,
        docNumber: item.header.docNo,
        date: item.header.docDate,
        reason: item.header.reason,
        items: item.details,
      };
      listData.push(data);
    }

    return {
      metaData: {
        page: props.data.page,
        limit: props.data.limit,
        total: props.data.total,
        orderBy: props.data.orderBy,
        order: props.data.order,
      },
      listData
    };
  }
  
}