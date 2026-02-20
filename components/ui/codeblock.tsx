export default function Codeblock({children}: {children: React.ReactNode}){
    return(
            <pre className="bg-black text-neutral-200 overflow-auto max-w-80 p-2">
                <code>
                    {children}
                </code>
            </pre>
    )
}