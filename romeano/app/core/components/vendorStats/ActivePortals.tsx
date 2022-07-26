/* This example requires Tailwind CSS v2.0+ */
import "tailwindcss/tailwind.css"
import { MailIcon } from "@heroicons/react/outline"
import { getName } from "../../util/text"
import { StyledLink } from "../generic/Link"
import { Card, CardHeader } from "../generic/Card"
import { Contact, EventCounted, Link, Stakeholder } from "../../../../types"
import { range } from "lodash"
import { Link as BlitzLink, Routes } from "blitz"
import { StakeholderApprovalCircles } from "../generic/StakeholderApprovalCircles"

type ActivePortal = {
  portalId: number
  customerName: string
  currentRoadmapStage: number
  customerNumberOfStages: number
  primaryContact: Contact | null
  stakeholderEvents: Array<EventCounted<Stakeholder>>
  documentEvents: Array<EventCounted<Link>>
}

function ProgressBullets(props: { current: number; total: number }) {
  return (
    <div className="flex items-center" aria-label="Progress">
      <ol className="flex items-center space-x-3">
        {range(props.total).map((idx) => (
          <li key={idx}>
            {idx + 1 < props.current ? (
              <div className="block w-2.5 h-2.5 bg-white rounded-full border-green-300 border-2" />
            ) : idx + 1 === props.current ? (
              <div className="relative flex items-center justify-center" aria-current="step">
                {/* <span className="absolute w-5 h-5 p-px flex" aria-hidden="true">
                                    <span className="w-full h-full rounded-full bg-green-200" />
                                </span> */}
                <span className="relative block w-2.5 h-2.5 bg-green-300 rounded-full" aria-hidden="true" />
              </div>
            ) : (
              <div className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400" />
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function ActivePortals(props: { data: ActivePortal[] }) {
  return (
    <Card>
      <CardHeader>Active Portals</CardHeader>
      <div className="flex flex-col pt-4">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Opportunity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Primary Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stakeholder Clicks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Document Opens
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {props.data.map((portal, idx) => (
                    <tr key={idx} className="divide-x">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex flex-col gap-y-1">
                            <div className="text-lg font-medium text-gray-900">{portal.customerName}</div>
                            <ProgressBullets
                              current={portal.currentRoadmapStage}
                              total={portal.customerNumberOfStages}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {portal.primaryContact && (
                          <div className="relative bg-white flex items-center space-x-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900">
                                {getName(portal.primaryContact.firstName, portal.primaryContact.lastName)}
                              </p>
                              <p className="text-sm truncate">{portal.primaryContact.jobTitle}</p>
                            </div>
                            <div className="w-10 h-10 border-2 flex items-center justify-center border-grey-600 rounded-full ">
                              <a href={`mailto:${portal.primaryContact.email}`}>
                                <MailIcon className="h-4 w-4 text-gray-400" />
                              </a>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3">
                          <StakeholderApprovalCircles data={portal.stakeholderEvents} />
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-between">
                          <div className="text-sm flex justify-center flex-col gap-y-1">
                            {portal.documentEvents.slice(0, 3).map((document, idx) => (
                              <div key={idx} className="flex gap-x-1">
                                <StyledLink href={document.href}>{document.body}</StyledLink>
                                <span className={"text-gray-900"}>{document.eventCount}</span>
                              </div>
                            ))}
                          </div>
                          <BlitzLink href={Routes.PortalDetails({ portalId: portal.portalId })}>
                            <a
                              className="inline-flex items-center px-5 my-3 border text-sm\
             leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50\
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300 border-gray-300"
                            >
                              View
                            </a>
                          </BlitzLink>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
