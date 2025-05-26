export class ListOrdersReturnResult {
  constructor(materialForSFA: any, props: any) {
    const itemMap = new Map(
      materialForSFA.items.map((item) => [item.external_id, item]),
    );

    return {
      metadata: {
        page: props.data.page,
        limit: props.data.limit,
        total: props.data.total,
        // orderBy: props.data.orderBy,
        // order: props.data.order,
      },
      data: props.data.listData.map((item) => {
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
              returnReason: props.reasons.find((r) => r.value === detail.return)
                ?.desc,
            },
          };
        });

        return {
          status: item.history[0].soStatus,
          docNumber: item.header.docNo,
          date: Math.floor(new Date(item.header.docDate).getTime() / 1000),
          reason: props.reasons.find((r) => r.value === item.header.reason)
            ?.desc,
          items: enrichedDetails.filter(
            (z) => z.orderType === props.parameterOrderType.value,
          ),
        };
      }),
    };
  }
}
