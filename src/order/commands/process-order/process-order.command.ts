import { ICommand } from '@nestjs/cqrs';
import { UserIdentity } from '@wings-online/common';

export class ProcessOrderCommandProps {
  readonly id: number;
  readonly identity: UserIdentity;
}

export class ProcessOrderCommand
  extends ProcessOrderCommandProps
  implements ICommand
{
  constructor(props: ProcessOrderCommandProps) {
    super();
    Object.assign(this, props);
  }
}
