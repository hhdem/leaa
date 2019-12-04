import { Repository } from 'typeorm';
import { loggerUtil } from '@leaa/api/src/utils';

const commonUpdate = async (
  repository: Repository<any>,
  CONSTRUCTOR_NAME: string,
  id: any,
  args: any,
  relationArgs: any = {},
): Promise<any | undefined> => {
  if (!args) {
    const message = `Not Found Args by ${id}`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    const message = `Not Found Item ${id}`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  const nextItem = await repository.save({
    ...prevItem,
    ...args,
    ...relationArgs,
  });

  await loggerUtil.updateLog({ id, prevItem, nextItem, constructorName: CONSTRUCTOR_NAME });

  return nextItem;
};

const commonDelete = async (
  repository: Repository<any>,
  CONSTRUCTOR_NAME: string,
  id: number,
): Promise<any | undefined> => {
  const prevId = id;
  const prevItem = await repository.findOne(id);

  if (!prevItem) {
    const message = `Not Found Item ${id}`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  const nextItem = await repository.remove(prevItem);

  if (!nextItem) {
    const message = `Delete Item ${id} Faild`;

    loggerUtil.warn(message, CONSTRUCTOR_NAME);

    return undefined;
  }

  loggerUtil.warn(`delete item ${id} successful: ${JSON.stringify(nextItem)}\n\n`, CONSTRUCTOR_NAME);

  return {
    ...nextItem,
    id: prevId,
  };
};

export const curdUtil = {
  commonUpdate,
  commonDelete,
};
