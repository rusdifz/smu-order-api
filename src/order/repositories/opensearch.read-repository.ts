import { OpensearchClient } from 'nestjs-opensearch';

import { PinoLogger } from '@wo-sdk/nest-pino-logger';

import { IOpensearchReadRepository } from '../interfaces';

export class OpensearchReadRepository implements IOpensearchReadRepository {
  constructor(
    readonly searchClient: OpensearchClient,
    readonly logger: PinoLogger,
    readonly indexName: string,
  ) {}
  /**
   *
   * @param search
   */
  public async spellCheck(search: string): Promise<string> {
    const methodName = 'spellCheck';
    this.logger.trace({ methodName }, 'BEGIN');
    this.logger.debug({ methodName, search });
    const response = await this.searchClient.search<SuggestResponse>({
      suggest_text: search,
      suggest_field: 'name',
      suggest_mode: 'always',
      suggest_size: 1,
      index: this.indexName,
    });

    const { body } = response;
    this.logger.debug({ methodName, body });

    const result: string[] = [];

    for (const check of body.suggest.name) {
      if (check.options.length > 0) {
        result.push(check.options[0].text);
      } else {
        result.push(check.text);
      }
    }

    this.logger.trace({ methodName }, 'END');
    return result.join(' ');
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
