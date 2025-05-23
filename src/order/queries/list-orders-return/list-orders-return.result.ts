export class ListOrdersReturnResult {
  constructor(materialForSFA: any, props: any) {
    let listData: any[] = [];

    const itemMap = new Map(
      materialForSFA.items.map((item) => [item.external_id, item]),
    );
    for (const item of props.data.listData) {
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
            soNumber: null,
            totalBought: detail.qtyCase,
            totalSent: null,
            typeBought: detail.slsUnit,
            orderHeaderId: detail.orderHeaderId,
            mMaterialId: detail.materialId,
            materialTitleName: matchedItem.name,
            materialImage: matchedItem.image_url,
            flashSaleId: '',
            pricePcs: detail.price_pcs,
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
            returnReason: props.reasons.find((r) => r.value === detail.return)
              ?.desc,
          },
        };
      });

      console.log(enrichedDetails);
      const data = {
        status: item.history[0].soStatus,
        docNumber: item.header.docNo,
        date: Math.floor(new Date(item.header.docDate).getTime() / 1000),
        reason: props.reasons.find((r) => r.value === item.header.reason)?.desc,
        items: enrichedDetails.filter(
          (z) => z.orderType === props.parameterOrderType.value,
        ),
      };
      listData.push(data);
    }

    return {
      metadata: {
        page: props.data.page,
        limit: props.data.limit,
        total: props.data.total,
        // orderBy: props.data.orderBy,
        // order: props.data.order,
      },
      data: listData,
    };
  }
}
