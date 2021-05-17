/* This example requires Tailwind CSS v2.0+ */

import {format} from "date-fns";
import Link from "./generic/Link";

enum CompletionStatus {
    Complete,
    InProgress,
    Upcoming
}

type LaunchStep = {
    heading: string,
    items: string[],
    date?: Date,
    ctaLink?: { body: string, href: string },
    status: CompletionStatus
}
const steps: LaunchStep[] = [
    {
        heading: 'Intro Meeting',
        items: ["Go over Mira's platform."],
        date: new Date(2021, 9, 8),
        ctaLink: {body: "Mira's Slide Deck", href: "#"},
        status: CompletionStatus.Complete
    },
    {
        heading: 'AR Headset Demo',
        items: ["Demonstrate a live Mira Connect call from headset."],
        date: new Date(2021, 10, 11),
        ctaLink: {body: "Join Zoom 📞", href: "#"},
        status: CompletionStatus.InProgress
    },
    {
        heading: 'Use-Case Planning Workshop',
        items: ["Define problem and primary use-case Mira will be used for."],
        status: CompletionStatus.Upcoming
    },
    {
        heading: 'Pilot Package Purchase',
        items: ["Quote attached below"],
        status: CompletionStatus.Upcoming
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function LaunchRoadmap() {
    return <nav>
        <div className="flex justify-between">
            <h1 className="text-lg font-bold">Launch Roadmap</h1>
            <div className="flex gap-1 font-bold">
                <span className="text-gray-900">{steps.filter(step => step.status !== CompletionStatus.Upcoming).length}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-400">4</span>
            </div>
        </div>
        {/*<ol className="flex justify-around gap-x-5 px-11 items-center">*/}
        {/*    {*/}
        {/*        steps.map((step, stepIdx) =>*/}
        {/*            <div key={step.name}*/}
        {/*                 className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-40' : '', 'relative')}>*/}
        {/*                <ProgressStepperElement step={step} stepNum={stepIdx + 1}/>*/}
        {/*            </div>*/}
        {/*        )*/}
        {/*    }*/}
        {/*</ol>*/}
        <ul style={{gridTemplateRows: "repeat(5, auto)", gridAutoColumns: "1fr"}}
            // <ul style={{gridTemplateRows: "repeat(4, auto)", gridAutoColumns: "1fr"}}
            className="grid grid-flow-col justify-items-center gap-y-3 gap-x-5 py-5">
            {steps.map((step, stepIdx) => (
                <>


                    <div key={step.heading}>
                    {/*<div key={step.name} className="flex justify-center w-full">*/}
                        {/*className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>*/}
                        <LaunchStepCircle step={step} stepNum={stepIdx + 1}/>
                        {/*<div className="absolute left-96 text-green-300">*/}
                        {/*    hi*/}
                        {/*</div>*/}
                    </div>


                    <div className="text-gray-500 text-xs">
                        {step.date ? format(step.date, "MMM d") : "TBD"}
                    </div>
                    <div className="font-bold">{step.heading}</div>
                    <ul className="list-disc pl-7">
                        {
                            step.items.map((item) => <li>{item}</li>)
                        }
                    </ul>
                    <div className="text-center">
                        {
                            step.ctaLink && <Link
                                href={step.ctaLink.href}>
                                {step.ctaLink.body}
                            </Link>
                        }
                    </div>
                </>
            ))}
        </ul>
    </nav>;
}

function LaunchStepCircle({step, stepNum}: { step: LaunchStep, stepNum: number }) {
    switch (step.status) {
        case CompletionStatus.Complete:
            return <div>
                {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
                {/*    <div className="h-0.5 w-full bg-green-600"/>*/}
                {/*</div>*/}

                <div
                    className="relative w-16 h-16 flex items-center justify-center bg-white border-2 border-green-600 rounded-full"
                >
                    <span className="text-green-600 text-2xl">{stepNum}</span>
                </div>
            </div>;

        case CompletionStatus.InProgress:
            return <>
                {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
                {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
                {/*</div>*/}
                <div
                    className="relative w-16 h-16 flex items-center justify-center bg-green-600 rounded-full hover:bg-green-900"
                >
                    <span className="text-white text-2xl">{stepNum}</span>
                </div>
            </>;

        case CompletionStatus.Upcoming:
            return <>
                {/*<div className="absolute inset-0 flex items-center" aria-hidden="true">*/}
                {/*    <div className="h-0.5 w-full bg-gray-200"/>*/}
                {/*</div>*/}
                <div
                    className="group relative w-16 h-16 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full hover:border-gray-400"
                >
                    <span
                        className="bg-transparent rounded-full text-2xl group-hover:bg-gray-300">{stepNum}</span>
                </div>
            </>;
    }
}