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
    custId: string,
    docNo: string,
  }): Promise<any> {
    const methodName = 'listReturnTkg';
    this.logger.trace({ methodName, params: params.custId }, 'BEGIN');

    const parameterOrderType = await this.parameterService.getOne(
      ParameterKeys.TKG_ORDER_TYPE,
    );
    if(!parameterOrderType){
      throw Error(`Not maintain Parameter: ${ParameterKeys.TKG_ORDER_TYPE}`);
    }

    const encodedOrderType = encodeURIComponent(parameterOrderType.value);
    let query = encodedOrderType ? `orderTypeIdIn=${encodedOrderType}` : '';
    if (params.custId) {
      query += query ? `&custId=${params.custId}` : ``;
    }
    if (params.docNo) {
      query += query ? `&docNo=${params.docNo}` : ``;
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

    this.logger.trace({ methodName }, 'END');
    return data;
  }
}
