import * as React from "react"
import { useEffect } from "react"
import "tailwindcss/tailwind.css"
import Modal from "app/core/components/generic/Modal"
import Labeled from "app/core/components/generic/Labeled"
import { z } from "zod"
import { useFieldArray, useForm } from "react-hook-form"
import { CloudUploadIcon, PlusIcon } from "@heroicons/react/solid"
import { UploadModal } from "./uploadModal"
import { Dialog } from "@headlessui/react"
import { useMutation } from "blitz"
import updateLaunchRoadmapStage from "app/customer-portals/mutations/updateLaunchRoadmapStage"
import createLaunchRoadmapStageLink from "app/customer-portals/mutations/createLaunchRoadmapStageLink"
import { zodResolver } from "@hookform/resolvers/zod"
import { LinkType } from "db"
import { ModalAction, ModalActionChange, ModalDisplayState, ModalState } from "../LaunchRoadmap"
import { formatISO9075 } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import { TrashIcon } from "@heroicons/react/outline"

export default function RoadmapModal(props: {
  portalId: number
  roadmapStageId: number
  modalState: ModalState
  actionDispatcher: React.Dispatch<ModalAction>
  refetchHandler: () => void
}) {
  const [updateLaunchRoadmapStageMutation] = useMutation(updateLaunchRoadmapStage)
  const [createLaunchRoadmapStageLinkMutation] = useMutation(createLaunchRoadmapStageLink)

  const schema = z.object({
    heading: z.string().nonempty(),
    date: z.string().optional(),
    tasks: z
      .object({
        task: z.string().nonempty(),
      })
      .array(),
    //doc/upload handled separately
  })
  type FormValues = z.infer<typeof schema>
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async (data) => {
    await updateLaunchRoadmapStageMutation({
      portalId: props.portalId,
      roadmapStageId: props.roadmapStageId,
      heading: data.heading,
      date: (data.date && new Date(data.date)) || undefined,
      tasks: data.tasks.map((task) => task.task),
    })
    props.actionDispatcher({ type: ModalActionChange.MODAL_SUBMITTED, payload: {} })
    props.refetchHandler()
  })

  useEffect(() => {
    reset({
      heading: props.modalState.heading ?? undefined,
      date: props.modalState.date
        ? formatISO9075(utcToZonedTime(props.modalState.date, "UTC"), { representation: "date" })
        : undefined,
      tasks: props.modalState.tasks.map((task) => ({ task })),
    })
  }, [props.modalState, reset]) //need this to avoid caching in react-hook-form with previous values

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    name: "tasks", // unique name for your Field Array
    control, // control props comes from useForm (optional: if you are using FormContext)
  })
  const onClose = () => props.actionDispatcher({ type: ModalActionChange.MODAL_CLOSE, payload: {} })
  return (
    <>
      {/*Main modal*/}
      <Modal isOpen={props.modalState.displayState === ModalDisplayState.ROADMAP_MODAL} onClose={onClose}>
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h2" className="text-xl leading-6 font-medium font-bold text-gray-900">
            Edit Milestone
          </Dialog.Title>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-6 mt-3">
              <div>
                <Labeled label={"Heading"}>
                  <input
                    className="border rounded-md p-3 w-full font-light text-sm"
                    placeholder="Roadmap heading"
                    {...register("heading", { required: true })}
                  />
                  {errors.heading && <p>{errors.heading.message}</p>}
                </Labeled>
              </div>
              <div>
                <Labeled label={"Date"}>
                  <input
                    type="date"
                    className="border rounded-md p-3 w-full font-light text-sm"
                    placeholder="Due date"
                    {...register("date")}
                  />
                  {errors.date && <p>{errors.date.message}</p>}
                </Labeled>
              </div>
            </div>
          </form>
          <hr className="w-screen -translate-x-8 my-8" />
          <h3 className="font-medium text-gray-900 mt-4 mb-3">Tasks</h3>
          {/*<FlexibleList label="Tasks" list={tasks} dispatch={setTasks} />*/}
          <div className="flex flex-col">
            {fields.map((field, index) => (
              <div key={index} className="flex justify-between mb-2">
                <div className="flex items-center">
                  <span className="text-xl text-gray-500 inline-block cursor-pointer">⠿</span>
                  {/*<input*/}
                  {/*  type="hidden"*/}
                  {/*  key={`${index}.id`}*/}
                  {/*  {...register(`tasks.${index}.id`, {*/}
                  {/*    setValueAs: (v) => {*/}
                  {/*      console.log("MAGIC", v, parseInt(v) ?? undefined)*/}
                  {/*      return parseInt(v) ?? undefined*/}
                  {/*    },*/}
                  {/*  })}*/}
                  {/*/>*/}
                  <input
                    type="text"
                    placeholder="Task description"
                    className="border rounded-md ml-1 p-2 w-max"
                    key={`${index}.task`}
                    {...register(`tasks.${index}.task`, { required: true })}
                  />
                  {errors.tasks?.[index] && <p>{errors.tasks[index].task?.message}</p>}
                </div>
                <button type="button" onClick={() => remove(index)}>
                  <TrashIcon className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={() => append({ task: "" })}>
            <PlusIcon className="h-4 w-4 text-gray-600" aria-hidden="true" />
          </button>

          {/*<hr className="w-screen -translate-x-8 my-8" />*/}
          <h3 className="font-medium">Doc/Link</h3>
          {/* <div className="grid grid-cols-2 gap-6"> */}
          <div className="mt-3">
            {props.modalState.link && (
              <div>
                Name: {props.modalState.link?.body}
                {/*<TrashIcon className="w-4 h-4 text-gray-400" />*/}
              </div>
            )}
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm
              leading-4 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => {
                props.actionDispatcher({ type: ModalActionChange.HANDLE_UPLOAD, payload: {} })
              }}
            >
              <CloudUploadIcon className="-ml-0.5 mr-2 h-4 w-4" />
              Upload
            </button>
          </div>
          <div className="mt-5 flex justify-between flex-row-reverse">
            <button
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-auto text-sm"
              onClick={onSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/*Uploader modal*/}
      <Modal isOpen={props.modalState.displayState === ModalDisplayState.UPLOAD_MODAL} onClose={onClose}>
        <UploadModal
          uploadParams={{ portalId: props.portalId }}
          title={"Upload"}
          onLinkComplete={async (link) => {
            const backendLink = await createLaunchRoadmapStageLinkMutation({
              launchRoadmapStageId: props.roadmapStageId,
              link: {
                ...link,
                type: LinkType.WebLink,
              },
            })
            props.actionDispatcher({
              type: ModalActionChange.LINK_SUBMITTED,
              payload: { link },
            })
            props.refetchHandler()
          }}
          onUploadComplete={async (link) => {
            const backendLink = await createLaunchRoadmapStageLinkMutation({
              launchRoadmapStageId: props.roadmapStageId,
              link: {
                ...link,
                type: LinkType.Document,
              },
            })
            props.actionDispatcher({
              type: ModalActionChange.LINK_SUBMITTED,
              payload: { link },
            })
            props.refetchHandler()
          }}
        />
      </Modal>
    </>
  )
}

/*
import "tailwindcss/tailwind.css"
import TextArea from "../core/components/generic/TextArea"
import { Card, CardHeader } from "../core/components/generic/Card"
import { useState } from "react"

function Sandbox() {
  const [highlightedItems, setHighlightedItems] = useState<string[]>([])
  const [textAreaProps, setTextAreaProps] = useState<{ className?: string }>({})

  return (
    <div className="bg-gray-100 p-4 w-1/2">
      <Card>
        <CardHeader>Proposal</CardHeader>
        <TextArea
          label="Description"
          onKeyDown={(e) => {
            if (e.key === "Enter") setTextAreaProps({ className: "outline-none resize-none" })
          }}
          {...textAreaProps}
        />
        <FlexibleList label="Highlight Items" list={highlightedItems} dispatch={setHighlightedItems} />
      </Card>
    </div>
  )
}
*/