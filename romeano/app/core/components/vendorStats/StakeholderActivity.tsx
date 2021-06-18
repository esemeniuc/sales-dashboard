import { Card, CardHeader } from "../generic/Card"
import StyledLink from "../generic/Link"
import { timeAgo } from "../../util/relativeDate"
import React from "react"
import { Link } from "../../../../types"

type StakeholderActivityEvent = {
  customer: string,
  company: string,
  link: Link,
  timestamp: string
}

export function StakeholderActivity(props: { data: StakeholderActivityEvent[] }) {

  return <Card borderless>
    <CardHeader>Stakeholder Activity Log</CardHeader>
    <div className="mt-5 bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-2 flex flex-col gap-y-3">
        {
          props.data.map(event =>
            <div className="flex justify-between">
                        <span className="text-sm">
                            {`${event.customer} from ${event.company} viewed `}
                          <StyledLink href={event.link.href}>{event.link.body}</StyledLink>
                        </span>
              <span
                className="text-right text-sm text-gray-500">{timeAgo(new Date(event.timestamp))}</span>
            </div>
          )
        }
      </div>
    </div>
  </Card>
}