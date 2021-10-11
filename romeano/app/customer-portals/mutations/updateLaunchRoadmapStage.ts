import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateLaunchRoadmapStage = z.object({
  portalId: z.number(),
  roadmapStageId: z.number().nonnegative(),
  date: z.date(),
  heading: z.string().nonempty(),
})

export default resolver.pipe(
  resolver.zod(UpdateLaunchRoadmapStage),
  resolver.authorize(),
  async ({ portalId, roadmapStageId, date, heading }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    return await db.roadmapStage.update({
      data: { date, heading },
      where: { id: roadmapStageId },
    })
  }
)