export interface ISfaService {
  listReturnTkg(params: any): Promise<any>;

  listReturnOrder(params: any): Promise<any>;

  listMissingGoods(params: any): Promise<any>;
}
