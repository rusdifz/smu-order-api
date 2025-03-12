import { InjectOpensearchClient, OpensearchClient } from 'nestjs-opensearch';

import { Injectable } from '@nestjs/common';
import { OpensearchResult } from '@wings-online/common';
import { InjectPinoLogger, PinoLogger } from '@wings-corporation/nest-pino-logger';

import { OpensearchItemEntity } from '../entities';
import { IProductSearchReadRepository } from '../interfaces';
import { ProductSearchReadModel } from '../read-models';
import { OpensearchReadRepository } from './opensearch.read-repository';

@Injectable()
export class OpensearchProductSearchReadRepository
  extends OpensearchReadRepository
  implements IProductSearchReadRepository
{
  constructor(
    @InjectOpensearchClient()
    readonly searchClient: OpensearchClient,
    @InjectPinoLogger(OpensearchProductSearchReadRepository.name)
    readonly logger: PinoLogger,
  ) {
    const indexName = 'products';
    super(searchClient, logger, indexName);
  }

  /**
   *
   * @param search
   * @param limit
   * @returns
   */
  async search(params: {
    search: string;
    categoryId?: number;
    limit?: number;
  }): Promise<ProductSearchReadModel[]> {
    const method = 'search';
    this.logger.trace(`BEGIN`);
    this.logger.info({ method, params });

    const search = params.search.toLowerCase();

    const body = {
      query: {
        bool: {
          should: [
            {
              match: {
                name: {
                  query: search,
                  boost: 3,
                },
              },
            },
            {
              term: {
                external_id: {
                  value: search,
                  boost: 10,
                },
              },
            },
            {
              prefix: {
                name: {
                  value: search,
                  boost: 5,
                },
              },
            },
            {
              fuzzy: {
                name: {
                  value: search,
                },
              },
            },
            {
              match: {
                'name_nowhitespace.partial': {
                  query: search,
                },
              },
            },
          ],
          must: params.categoryId
            ? [
                {
                  term: {
                    category_id: {
                      value: params.categoryId,
                    },
                  },
                },
              ]
            : undefined,
          minimum_should_match: 1,
        },
      },
      size: params.limit,
    };

    this.logger.debug({ method, body });

    const response = await this.searchClient.search<
      OpensearchResult<OpensearchItemEntity>
    >({
      index: this.indexName,
      body,
    });

    this.logger.debug({ method, response: response.body });
    this.logger.trace({ method }, 'END');

    return response.body.hits.hits.map((item) => {
      return {
        id: item._source.id,
        external_id: item._source.external_id,
        name: item._source.name,
        image: item._source.image,
        category_id: item._source.category_id,
      };
    });
  }
}
