import { AxiosError } from 'axios';
import { DateTime } from 'luxon';
import { catchError, firstValueFrom, tap } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from '@wings-corporation/nest-pino-logger';
import { LEGACY_ORDER_DEFAULT_TIMEZONE } from '@wings-online/app.constants';
import { ParameterKeys } from '@wings-online/parameter/parameter.constants';
import { ParameterService } from '@wings-online/parameter/parameter.service';

import { ILegacyOrderService } from '../interfaces';
import { OrderStatus } from '../order.constants';

@Injectable()
export class LegacyOrderService implements ILegacyOrderService {
  legacyApiUrl: string;
  timeout: number;
  constructor(
    protected readonly config: ConfigService,
    protected readonly httpService: HttpService,
    protected readonly logger: PinoLogger,
    private readonly parameterService: ParameterService,
  ) {
    this.legacyApiUrl = this.config.getOrThrow('LEGACY_API_URL');
    this.timeout = this.config.get('EXTERNAL_API_TIMEOUT') || 5000;
  }

  /**
   *
   * @param params
   */
  async changeOrderStatus(params: {
    docNumber: string;
    status: OrderStatus;
  }): Promise<void> {
    const methodName = 'changeOrderStatus';
    this.logger.trace({ methodName, params: params.docNumber }, 'BEGIN');
    const requestBody: UpdateStatusNumberOrderRequest = {
      docNumber: params.docNumber,
      status: params.status,
      created_date: DateTime.now()
        .setZone(LEGACY_ORDER_DEFAULT_TIMEZONE)
        .toFormat('yyyy-LL-dd hh:mm:ss'),
    };

    const url = `${this.legacyApiUrl}/order/updateStatusNumberOrder`;

    const request = this.httpService
      .post<UpdateStatusNumberOrderResponse>(url, requestBody, {
        timeout: this.timeout,
      })
      .pipe(
        tap((response) => this.logger.info({ methodName, response })),
        catchError((error: AxiosError) => {
          this.logger.error({
            methodName,
            errorContext: 'Legacy API Error',
            error: {
              message: error.message,
              data: error.response?.data,
            },
          });
          throw error;
        }),
      );
    const { data } = await firstValueFrom(request);
    if (data.code !== 200 || data.data.success === false) {
      this.logger.error({
        methodName,
        errorContext: 'Legacy API Error',
        error: {
          message: data.error,
          data,
        },
      });
      throw Error(`Legacy API Error: ${data.error}`);
    }

    this.logger.trace({ methodName }, 'END');
  }

  /**
   *
   * @param customerId
   */
  async isCustomerDummy(customerId: string): Promise<boolean> {
    const parameter = await this.parameterService.getByKeyAndValue(
      ParameterKeys.DUMMY_CUSTOMER_ID,
      customerId,
    );

    return parameter?.value === customerId ? true : false;
  }
}

interface UpdateStatusNumberOrderRequest {
  docNumber: string;
  status: OrderStatus;
  created_date: string;
}

interface UpdateStatusNumberOrderResponse {
  code: number;
  error: string;
  data: {
    success: boolean;
  };
}
