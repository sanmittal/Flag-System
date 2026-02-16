import { Router } from "express";
import { z } from "zod";
import { FeatureService } from "../services/service";

const router = Router();
const service = new FeatureService();



const createSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
  description: z.string().optional(),
  rolloutPct: z.number().min(0).max(100).optional()
});

const evaluateSchema = z.object({
  userId: z.string().optional(),
  groupId: z.string().optional(),
  region: z.string().optional()
});

const globalSchema = z.object({
  enabled: z.boolean()
});

const rolloutSchema = z.object({
  rolloutPct: z.number().min(0).max(100)
});

const userOverrideSchema = z.object({
  userId: z.string(),
  enabled: z.boolean()
});

const groupOverrideSchema = z.object({
  groupId: z.string(),
  enabled: z.boolean()
});

const regionOverrideSchema = z.object({
  region: z.string(),
  enabled: z.boolean()
});



// Create feature
router.post("/", async (req, res) => {
  try {
    const data = createSchema.parse(req.body);
    const result = await service.create(data);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// List all features
router.get("/", async (_, res) => {
  try {
    const result = await service.list();
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Get specific feature
router.get("/:key", async (req, res) => {
  try {
    const result = await service.getByKey(req.params.key);
    res.json(result);
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
});

// Delete feature
router.delete("/:key", async (req, res) => {
  try {
    const result = await service.delete(req.params.key);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});



// Update global enabled state
router.patch("/:key/global", async (req, res) => {
  try {
    const body = globalSchema.parse(req.body);
    const result = await service.updateGlobal(req.params.key, body.enabled);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Update rollout percentage
router.patch("/:key/rollout", async (req, res) => {
  try {
    const body = rolloutSchema.parse(req.body);
    const result = await service.updateRollout(
      req.params.key,
      body.rolloutPct
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});



router.post("/:key/evaluate", async (req, res) => {
  try {
    const context = evaluateSchema.parse(req.body);
    const result = await service.evaluate(req.params.key, context);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});



// Add / update user override
router.post("/:key/user-override", async (req, res) => {
  try {
    const body = userOverrideSchema.parse(req.body);
    const result = await service.setUserOverride(
      req.params.key,
      body.userId,
      body.enabled
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Remove user override
router.delete("/:key/user-override/:userId", async (req, res) => {
  try {
    const result = await service.removeUserOverride(
      req.params.key,
      req.params.userId
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});


// Add / update group override
router.post("/:key/group-override", async (req, res) => {
  try {
    const body = groupOverrideSchema.parse(req.body);
    const result = await service.setGroupOverride(
      req.params.key,
      body.groupId,
      body.enabled
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Remove group override
router.delete("/:key/group-override/:groupId", async (req, res) => {
  try {
    const result = await service.removeGroupOverride(
      req.params.key,
      req.params.groupId
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});



// Add / update region override
router.post("/:key/region-override", async (req, res) => {
  try {
    const body = regionOverrideSchema.parse(req.body);
    const result = await service.setRegionOverride(
      req.params.key,
      body.region,
      body.enabled
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Remove region override
router.delete("/:key/region-override/:region", async (req, res) => {
  try {
    const result = await service.removeRegionOverride(
      req.params.key,
      req.params.region
    );
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
