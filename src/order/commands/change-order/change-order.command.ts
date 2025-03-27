import { CorrelatableCommand, WithIdentity } from '@wings-corporation/core';
import { UserIdentity } from '@wings-online/common';

export class ChangeOrderCommandProps implements WithIdentity<UserIdentity> {
  readonly identity: UserIdentity;
  readonly id: number;
}

export class ChangeOrderCommand extends CorrelatableCommand<ChangeOrderCommandProps> {
  constructor(data: ChangeOrderCommandProps) {
    super(data);
  }
}
