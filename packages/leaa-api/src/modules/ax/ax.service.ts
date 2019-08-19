import { Injectable } from '@nestjs/common';
import { Repository, FindOneOptions, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Ax, User } from '@leaa/common/src/entrys';
import { AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput } from '@leaa/common/src/dtos/ax';
import { BaseService } from '@leaa/api/src/modules/base/base.service';
import { formatUtil, loggerUtil, permissionUtil } from '@leaa/api/src/utils';

const CONSTRUCTOR_NAME = 'AxService';

@Injectable()
export class AxService extends BaseService<Ax, AxsArgs, AxsWithPaginationObject, AxArgs, CreateAxInput, UpdateAxInput> {
  constructor(@InjectRepository(Ax) private readonly axRepository: Repository<Ax>) {
    super(axRepository);
  }

  async axs(args: AxsArgs, user?: User): Promise<AxsWithPaginationObject> {
    const nextArgs = formatUtil.formatArgs(args);

    const qb = getRepository(Ax).createQueryBuilder();
    qb.select().orderBy(nextArgs.orderBy || 'created_at', nextArgs.orderSort);

    if (nextArgs.q) {
      const aliasName = new SelectQueryBuilder(qb).alias;

      ['title', 'slug'].forEach(q => {
        qb.andWhere(`${aliasName}.${q} LIKE :${q}`, { [q]: `%${nextArgs.q}%` });
      });
    }

    if (!user || (user && !permissionUtil.hasPermission(user, 'attachment.list'))) {
      qb.andWhere('status = :status', { status: 1 });
    }

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page: nextArgs.page || 1,
      pageSize: nextArgs.pageSize || 30,
    };
  }

  async ax(id: number, args?: AxArgs & FindOneOptions<Ax>, user?: User): Promise<Ax | undefined> {
    let nextArgs: FindOneOptions<Ax> = {};

    if (args) {
      nextArgs = args;
    }

    const whereQuery: { id: number; status?: number } = { id };

    if (!user || (user && !permissionUtil.hasPermission(user, 'attachment.list'))) {
      whereQuery.status = 1;
    }

    return this.axRepository.findOne({
      ...nextArgs,
      where: whereQuery,
    });
  }

  async axBySlug(slug: string, args?: AxArgs & FindOneOptions<Ax>, user?: User): Promise<Ax | undefined> {
    const ax = await this.axRepository.findOne({ where: { slug } });

    if (!ax) {
      const message = 'not found ax';

      loggerUtil.warn(message, CONSTRUCTOR_NAME);

      return undefined;
    }

    return this.ax(ax.id, args, user);
  }

  async craeteAx(args: CreateAxInput): Promise<Ax | undefined> {
    return this.axRepository.save({ ...args });
  }

  async updateAx(id: number, args: UpdateAxInput): Promise<Ax | undefined> {
    return this.update(id, args);
  }

  async deleteAx(id: number): Promise<Ax | undefined> {
    return this.delete(id);
  }
}
