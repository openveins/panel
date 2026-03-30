import { Field, FieldLabel } from "./field";
import { Progress } from "./progress";

function getUsage(usage: number): string {
    if(usage < 60) return "low"
    else if(usage >=60 && usage <= 80) return "mid"
    else if(usage >80) return "high";
    return "low";
}

export default function UsageBars({title, usage}: {title: string, usage: number}){
    
    
    return(
        <Field className="flex flex-col gap-2 ">
            <FieldLabel>
                <p className="text-xs">{title}</p>
                <p className="ml-auto">{usage}%</p>
            </FieldLabel>
            <Progress value={usage} data-usage-value={getUsage(usage)} className="data-[usage-value='low']:[&>div]:bg-emerald-400 data-[usage-value='mid']:[&>div]:bg-amber-300 data-[usage-value='high']:[&>div]:bg-rose-500"/>
        </Field>
    )
}