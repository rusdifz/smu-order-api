import { AxiosError } from 'axios';
import { catchError, firstValueFrom, tap } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from '@wings-corporation/nest-pino-logger';
import { ParameterKeys } from '@wings-online/parameter/parameter.constants';
import { ParameterService } from '@wings-online/parameter/parameter.service';

import { ISfaService } from '../interfaces';

@Injectable()
export class SfaService implements ISfaService {
  sfaApiUrl: string;
  timeout: number;
  constructor(
    protected readonly config: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly logger: PinoLogger,
    private readonly parameterService: ParameterService,
  ) {
    this.sfaApiUrl = this.config.getOrThrow('SFA_API_URL');
    this.timeout = this.config.get('EXTERNAL_API_TIMEOUT') || 5000;
  }

  /**
   *
   * @param params
   */
  async listReturnTkg(params: {
    custId: string;
    docNo: string;
    limit: number;
    page: number;
  }): Promise<any> {
    const methodName = 'listReturnTkg';
    // this.logger.trace({ methodName, params: params.custId }, 'BEGIN');

    const parameterOrderType = await this.parameterService.getOne(
      ParameterKeys.TKG_ORDER_TYPE,
    );
    if (!parameterOrderType) {
      throw Error(`Not maintain Parameter: ${ParameterKeys.TKG_ORDER_TYPE}`);
    }

    const encodedOrderType = encodeURIComponent(parameterOrderType.value);
    let query = encodedOrderType ? `orderTypeIdIn=${encodedOrderType}` : '';
    if (params.custId) {
      query += query ? `&custId=${params.custId}` : `custId=${params.custId}`;
    }

    if (params.docNo) {
      query += query ? `&docNo=${params.docNo}` : `docNo=${params.docNo}`;
    }

    if (params.limit && params.limit > 0) {
      query += query ? `&limit=${params.limit}` : `limit=${params.limit}`;
    } else {
      query += query ? `&limit=10` : `limit=10`;
    }

    if (params.page && params.page > 0) {
      query += query ? `&page=${params.page}` : `page=${params.page}`;
    } else {
      query += query ? `&page=1` : `page=1`;
    }

    const url = `${this.sfaApiUrl}/returntkg/paginate?${query}`;

    const request = this.httpService
      .get<any>(url, {
        timeout: this.timeout,
      })
      .pipe(
        tap((response) => this.logger.info({ methodName, response })),
        catchError((error: AxiosError) => {
          this.logger.error({
            methodName,
            errorContext: 'SFA API Error',
            error: {
              message: error.message,
              data: error.response?.data,
            },
          });
          throw error;
        }),
      );

    const { status, data } = await firstValueFrom(request);
    if (status !== 200) {
      this.logger.error({
        methodName,
        errorContext: 'SFA API Error',
        error: {
          message: data.error,
          data,
        },
      });
      throw Error(`SFA API Error: ${data.error}`);
    }

    // this.logger.trace({ methodName }, 'END');
    return data;
  }
  /**
   *
   * @param params
   */
  async listReturnOrder(params: {
    custId: string;
    docNo: string;
    limit: number;
    page: number;
  }): Promise<any> {
    const methodName = 'listReturnOrder';
    // this.logger.trace({ methodName, params: params.custId }, 'BEGIN');

    const parameterOrderType = await this.parameterService.getOne(
      ParameterKeys.RETURN_ORDER_TYPE,
    );
    if (!parameterOrderType) {
      throw Error(`Not maintain Parameter: ${ParameterKeys.RETURN_ORDER_TYPE}`);
    }

    const encodedOrderType = encodeURIComponent(parameterOrderType.value);
    let query = encodedOrderType ? `orderTypeIdIn=${encodedOrderType}` : '';
    if (params.custId) {
      query += query ? `&custId=${params.custId}` : `custId=${params.custId}`;
    }

    if (params.docNo) {
      query += query ? `&docNo=${params.docNo}` : `docNo=${params.docNo}`;
    }

    if (params.limit && params.limit > 0) {
      query += query ? `&limit=${params.limit}` : `limit=${params.limit}`;
    } else {
      query += query ? `&limit=10` : `limit=10`;
    }

    if (params.page && params.page > 0) {
      query += query ? `&page=${params.page}` : `page=${params.page}`;
    } else {
      query += query ? `&page=1` : `page=1`;
    }

    const url = `${this.sfaApiUrl}/returntkg/paginate?${query}`;

    const request = this.httpService
      .get<any>(url, {
        timeout: this.timeout,
      })
      .pipe(
        tap((response) => this.logger.info({ methodName, response })),
        catchError((error: AxiosError) => {
          this.logger.error({
            methodName,
            errorContext: 'SFA API Error',
            error: {
              message: error.message,
              data: error.response?.data,
            },
          });
          throw error;
        }),
      );

    const { status, data } = await firstValueFrom(request);
    const reasons = await this.parameterService.getOrThrow(
      ParameterKeys.RETURN_REASON,
    );

    if (status !== 200) {
      this.logger.error({
        methodName,
        errorContext: 'SFA API Error',
        error: {
          message: data.error,
          data,
        },
      });
      throw Error(`SFA API Error: ${data.error}`);
    }

    // this.logger.trace({ methodName }, 'END');
    return { parameterOrderType, reasons, ...data };
  }
}
