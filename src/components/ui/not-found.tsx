import { BadgeQuestionMarkIcon } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "./empty";

export default function NotFoundComponent() {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <BadgeQuestionMarkIcon/>
                </EmptyMedia>
                <EmptyTitle>Given page was not found!</EmptyTitle>
                <EmptyDescription>Unfortunately this page has not been found, if you were redirected here from a different location. Please report it.</EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}