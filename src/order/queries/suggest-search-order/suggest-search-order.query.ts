import { IQuery } from '@nestjs/cqrs';

export class SuggestSearchOrderQueryProps {
  readonly search: string;
}

export class SuggestSearchOrderQuery
  extends SuggestSearchOrderQueryProps
  implements IQuery
{
  constructor(props: SuggestSearchOrderQueryProps) {
    super();
    Object.assign(this, props);
  }
}
