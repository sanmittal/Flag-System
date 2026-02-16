import { prisma } from "../db";

export class FeatureRepository {
  create(data: any) {
    return prisma.featureFlag.create({ data });
  }

  findByKey(key: string) {
    return prisma.featureFlag.findUnique({
      where: { key },
      include: {
        userOverrides: true,
        groupOverrides: true,
        regionOverrides: true
      }
    });
  }

  list() {
    return prisma.featureFlag.findMany();
  }

  delete(key: string) {
    return prisma.featureFlag.delete({ where: { key } });
  }

  updateGlobal(key: string, enabled: boolean) {
    return prisma.featureFlag.update({
      where: { key },
      data: { enabled }
    });
  }

  updateRollout(key: string, rolloutPct: number) {
    return prisma.featureFlag.update({
      where: { key },
      data: { rolloutPct }
    });
  }

  upsertUser(featureId: string, userId: string, enabled: boolean) {
    return prisma.userOverride.upsert({
      where: { userId_featureId: { userId, featureId } },
      update: { enabled },
      create: { userId, enabled, featureId }
    });
  }

  deleteUser(featureId: string, userId: string) {
    return prisma.userOverride.delete({
      where: { userId_featureId: { userId, featureId } }
    });
  }

  upsertGroup(featureId: string, groupId: string, enabled: boolean) {
    return prisma.groupOverride.upsert({
      where: { groupId_featureId: { groupId, featureId } },
      update: { enabled },
      create: { groupId, enabled, featureId }
    });
  }

  deleteGroup(featureId: string, groupId: string) {
    return prisma.groupOverride.delete({
      where: { groupId_featureId: { groupId, featureId } }
    });
  }

  upsertRegion(featureId: string, region: string, enabled: boolean) {
    return prisma.regionOverride.upsert({
      where: { region_featureId: { region, featureId } },
      update: { enabled },
      create: { region, enabled, featureId }
    });
  }

  deleteRegion(featureId: string, region: string) {
    return prisma.regionOverride.delete({
      where: { region_featureId: { region, featureId } }
    });
  }
}
