import { OpensearchClient } from 'nestjs-opensearch';

import { Cache } from '@nestjs/cache-manager';
import { PinoLogger } from '@wings-corporation/nest-pino-logger';
import { CacheUtil } from '@wings-online/common/utils/cache.util';

import { IOpensearchReadRepository } from '../interfaces';

export class OpensearchReadRepository implements IOpensearchReadRepository {
  constructor(
    readonly searchClient: OpensearchClient,
    readonly logger: PinoLogger,
    readonly indexName: string,
    readonly cacheManager: Cache,
  ) {}
  /**
   *
   * @param search
   */
  public async spellCheck(search: string): Promise<string> {
    const methodName = 'spellCheck';
    this.logger.trace({ methodName }, 'BEGIN');
    this.logger.debug({ methodName, search });

    const cacheKey = CacheUtil.getCacheKey(`${this.indexName}:spell:${search}`);
    const cacheResult = await this.cacheManager.get<string>(cacheKey);
    if (cacheResult) {
      this.logger.debug({ methodName, cacheResult });
      this.logger.trace({ methodName }, 'end');
      return cacheResult;
    }

    const searchResponse = await this.searchClient.search<SuggestResponse>({
      suggest_text: search,
      suggest_field: 'name',
      suggest_mode: 'always',
      suggest_size: 1,
      index: this.indexName,
    });

    const { body } = searchResponse;
    this.logger.debug({ methodName, body });

    const result: string[] = [];

    for (const check of body.suggest.name) {
      if (check.options.length > 0) {
        result.push(check.options[0].text);
      } else {
        result.push(check.text);
      }
    }

    const response = result.join(' ');
    await this.cacheManager.set(
      cacheKey,
      response,
      CacheUtil.getTTLToEndOfDayInMs(),
    );

    this.logger.trace({ methodName }, 'END');
    return response;
  }
}

type SuggestResponse = {
  suggest: {
    name: SpellCheckProps[];
  };
};

type SpellCheckProps = {
  text: string;
  offset: string;
  length: string;
  options: OptionProps[];
};

type OptionProps = {
  text: string;
  score: number;
  freq: number;
};
