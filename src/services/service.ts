import { FeatureRepository } from "../repositories/repository";
import {
  getCache,
  setCache,
  invalidateFeatureCache
} from "../cache";
import { isInRollout } from "../utils/hash";
import {
  EvaluationContext,
  FeatureEvaluationResult
} from "../domain/feature";

export class FeatureService {
  private repo = new FeatureRepository();

  async list() {
    return this.repo.list();
  }

  async getByKey(key: string) {
    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");
    return feature;
  }

  async create(data: {
    key: string;
    enabled: boolean;
    description?: string;
    rolloutPct?: number;
  }) {
    const existing = await this.repo.findByKey(data.key);
    if (existing) throw new Error("Feature already exists");

    return this.repo.create(data);
  }

  async delete(key: string) {
    const existing = await this.repo.findByKey(key);
    if (!existing) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.delete(key);
  }

  async updateGlobal(key: string, enabled: boolean) {
    const existing = await this.repo.findByKey(key);
    if (!existing) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.updateGlobal(key, enabled);
  }

  async updateRollout(key: string, rolloutPct: number) {
    const existing = await this.repo.findByKey(key);
    if (!existing) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.updateRollout(key, rolloutPct);
  }

  async setUserOverride(key: string, userId: string, enabled: boolean) {
    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.upsertUser(feature.id, userId, enabled);
  }

  async removeUserOverride(key: string, userId: string) {
    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.deleteUser(feature.id, userId);
  }

  async setGroupOverride(key: string, groupId: string, enabled: boolean) {
    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.upsertGroup(feature.id, groupId, enabled);
  }

  async removeGroupOverride(key: string, groupId: string) {
    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.deleteGroup(feature.id, groupId);
  }

  async setRegionOverride(key: string, region: string, enabled: boolean) {
    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.upsertRegion(feature.id, region, enabled);
  }

  async removeRegionOverride(key: string, region: string) {
    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");

    await invalidateFeatureCache(key);
    return this.repo.deleteRegion(feature.id, region);
  }
  async evaluate(
    key: string,
    ctx: EvaluationContext
  ): Promise<FeatureEvaluationResult> {

    const cacheKey = `feature:${key}:${JSON.stringify(ctx)}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const feature = await this.repo.findByKey(key);
    if (!feature) throw new Error("Feature not found");

    let result: FeatureEvaluationResult;

    if (ctx.userId) {
      const user = feature.userOverrides.find(
        (u) => u.userId === ctx.userId
      );
      if (user) {
        result = {
          key,
          enabled: user.enabled,
          source: "USER_OVERRIDE"
        };
        await setCache(cacheKey, result);
        return result;
      }
    }

    if (ctx.groupId) {
      const group = feature.groupOverrides.find(
        (g) => g.groupId === ctx.groupId
      );
      if (group) {
        result = {
          key,
          enabled: group.enabled,
          source: "GROUP_OVERRIDE"
        };
        await setCache(cacheKey, result);
        return result;
      }
    }

    if (ctx.region) {
      const region = feature.regionOverrides.find(
        (r) => r.region === ctx.region
      );
      if (region) {
        result = {
          key,
          enabled: region.enabled,
          source: "REGION_OVERRIDE"
        };
        await setCache(cacheKey, result);
        return result;
      }
    }

    if (typeof feature.rolloutPct === "number" && ctx.userId) {
      const enabled = isInRollout(ctx.userId, feature.rolloutPct);
      result = {
        key,
        enabled,
        source: "PERCENTAGE_ROLLOUT"
      };
      await setCache(cacheKey, result);
      return result;
    }

    result = {
      key,
      enabled: feature.enabled,
      source: "GLOBAL_DEFAULT"
    };

    await setCache(cacheKey, result);
    return result;
  }
}
