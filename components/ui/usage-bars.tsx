import { Field, FieldLabel, FieldTitle } from "./field";
import { Progress } from "./progress";

function UsageBar({title, usage, ...props}: {title: string, usage: number}){
    return(
        <Field className="w-full max-w-sm">
            <FieldLabel >
                <span>{title}</span>
                <span className="ml-auto">{Math.floor(usage)}%</span>
            </FieldLabel>
            {(usage < 75) && <Progress value={usage} className="[&>div]:bg-emerald-400"/>}
            {(usage >= 75 && usage < 90) && <Progress value={usage} className="[&>div]:bg-amber-400"/>}
            {(usage >= 90) && <Progress value={usage} className="[&>div]:bg-red-400" />}
        </Field>
    )
}

export {UsageBar}