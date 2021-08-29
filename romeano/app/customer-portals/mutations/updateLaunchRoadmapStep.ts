import { AuthenticationError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const UpdateLaunchRoadmapStep = z.object({
  portalId: z.number(),
  currentRoadmapStage: z.number(),
})

export default resolver.pipe(
  resolver.zod(UpdateLaunchRoadmapStep),
  resolver.authorize(),
  async ({ portalId, currentRoadmapStage }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const userId = ctx.session.userId
    if (!userId) throw new AuthenticationError("no userId provided")

    const note = await db.portal.update({
      data: { currentRoadmapStage },
      where: { id: portalId },
    })

    return note
  }
)
