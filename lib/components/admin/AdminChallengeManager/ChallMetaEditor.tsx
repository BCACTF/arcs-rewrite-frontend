import { CachedChall } from "cache/challs";
import { CachedSolveMeta } from "cache/solves";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ActionModal from "../ActionModal";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChallId, challIdToStr } from "cache/ids";
import useServerSidePropsRefetcher from "hooks/useServerSidePropsRefetcher";

interface ChallMetaEditorProps {
    challenge: CachedChall;
    solves: CachedSolveMeta[];
    exitChallMetaEditor: () => void;
}

const sendMetadataModifyReq = async (
    id: ChallId,
    name: string | null,
    desc: string | null,
    points: number | null,
    categories: string[] | null,
    tags: string[] | null,
    visible: boolean,
) => {
    const queryParams = new URLSearchParams();
    queryParams.set("id", challIdToStr(id));
    if (name) queryParams.set("name", name);
    if (desc) queryParams.set("desc", desc);
    if (points) queryParams.set("points", points.toString());
    if (categories) for (const category of categories) {
        queryParams.append("categories", category);
    }
    if (tags) for (const tag of tags) {
        queryParams.append("tags", tag);
    }
    queryParams.set("visible", visible.toString());

    const response = await fetch(`/api/admin/update-chall-metadata?${queryParams.toString()}`, { method: "PUT" });
    if (!response.ok) {
        const text = await response.text();
        alert(`Failed to update metadata for ${id}: ${text}`);
        return false;
    }
    return true;
};


type ReactMarkdownComponentStyles = Parameters<typeof ReactMarkdown>[0]["components"];

const components: ReactMarkdownComponentStyles = {
    a: ({ className, children, ...props}) => (
        <a {...props} className={`${className} text-blue-300 underline`}>{children}</a>
    ),
    link: ({ className, children, ...props}) => (
        <link {...props} className={`${className} text-blue-300 underline`}>{children}</link>
    ),
    h1: ({ className, children, ...props}) => <h1 {...props} className={`${className} text-3xl font-bold`}>{children}</h1>,
    h2: ({ className, children, ...props}) => <h2 {...props} className={`${className} text-2xl font-semibold`}>{children}</h2>,
    h3: ({ className, children, ...props}) => <h3 {...props} className={`${className} text-xl font-semibold`}>{children}</h3>,
    h4: ({ className, children, ...props}) => <h4 {...props} className={`${className} text-lg`}>{children}</h4>,
    h5: ({ className, children, ...props}) => <h5 {...props} className={`${className} text-lg`}>{children}</h5>,
    h6: ({ className, children, ...props}) => <h6 {...props} className={`${className} text-base`}>{children}</h6>,

    p: ({ className, children, ...props}) => (
        <p {...props} className={`${className} mb-3`}>{children}</p>
    ),

    ol: ({ className, children, ...props}) => (
        <ol {...props} className={`${className} text-base font-normal list-decimal pl-8 my-3`}>{children}</ol>
    ),
    hr: ({ className, children, ...props}) => (
        <hr {...props} className={`${className} my-3`}>{children}</hr>
    ),


    section: ({ className, children, ...props}) => (
        <section {...props} className={`${className} mt-5 text-xl font-semibold`}>{children}</section>
    )
};

function ChallMetaEditor({ challenge, solves, exitChallMetaEditor }: ChallMetaEditorProps) {
    const [[modalAction, actionName], setModalAction] = useState<[null | (() => Promise<unknown>), string]>([null, ""]);
    const refreshProps = useServerSidePropsRefetcher();

    const [challName, setChallName] = useState("");
    const [challDesc, setChallDesc] = useState("");
    const [showingChallDescPreview, setShowingChallDescPreview] = useState(false);
    const [challPoints, setChallPoints] = useState<number | null>(null);
    const [challCategoryStr, setChallCategories] = useState("");
    const challCategories = useMemo(() => challCategoryStr.split(",").map(a => a.trim()).filter(a => a.length > 0), [challCategoryStr]);
    const [challVisible, setChallVisible] = useState(challenge.visible);

    const isChanged = useMemo(() => {
        const nameDiffer = challName !== "" &&  (challName !== challenge.clientSideMetadata.name);
        const descDiffers = challDesc !== "" && (challDesc !== challenge.clientSideMetadata.desc);
        const pointsDiffers = challPoints !== null && (challPoints !== challenge.clientSideMetadata.points);
        const visibleDiffers = challVisible !== challenge.visible;

        const primitivesDiffer = nameDiffer || descDiffers || pointsDiffers || visibleDiffers;


        const newCategoriesInOld = challCategories.every(category => challenge.clientSideMetadata.categories.includes(category));
        const oldCategoriesInNew = challenge.clientSideMetadata.categories.every(category => challCategories.includes(category));
        const categoriesDiffer = challCategoryStr !== "" && (!newCategoriesInOld || !oldCategoriesInNew);

        return primitivesDiffer || categoriesDiffer;
    }, [challName, challDesc, challPoints, challCategories, challVisible, challenge]);

    const descRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        const textarea = descRef.current;
        if (!textarea) return;

        textarea.style.height = "auto";
        const height = textarea.scrollHeight + 10;

        const actingHeight = Math.max(height, 40);
        textarea.style.height = `${actingHeight}px`;
    }, [descRef, descRef.current, challDesc]);

    return <>
        <div onClick={exitChallMetaEditor} className="fixed top-0 left-0 w-screen h-screen !my-0 bg-slate-900 opacity-50 z-40"/>
        <div className="
            fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40
            w-1/2 max-h-3/4 overflow-y-scroll rounded-xl
            bg-slate-700 
            flex flex-col align-middle items-center
            p-4">
            <h1 className="text-2xl text-center">Modify metadata for {challenge.clientSideMetadata.name}</h1>
            <br/>

            <label
                htmlFor="ChallNameInput"
                className="w-fit text-lg mb-2">
                Challenge Name
            </label>
            <div className="relative w-3/4">
                <span
                    onClick={() => setChallName(challenge.clientSideMetadata.name)}
                    className="absolute top-2 right-3 hover:opacity-100 opacity-10 transition-opacity cursor-pointer">
                    Fill
                </span>
                <input
                    placeholder={challenge.clientSideMetadata.name}
                    type="text"
                    className="
                        p-2 text-lg
                        bg-slate-800 border-4 border-slate-900 rounded-lg w-full"
                    name="ChallNameInput"
                    onChange={e => setChallName(e.target.value)} value={challName}/>
            </div>
            <br/>

            <label
                htmlFor="ChallDescInput"
                className="w-fit text-lg mb-2">
                Challenge Description
            </label>
            <div className="relative w-3/4">
                <span
                    onClick={() => setChallDesc(challenge.clientSideMetadata.desc)}
                    className="absolute top-2 right-3 hover:opacity-100 opacity-10 transition-opacity cursor-pointer">
                    Fill
                </span>
                <textarea
                    placeholder={challenge.clientSideMetadata.desc}
                    className="
                        p-2 text-md w-full
                        bg-slate-800 border-4 border-slate-900 rounded-lg
                        resize-none
                        h-10"
                    ref={descRef}
                    name="ChallDescInput"
                    onChange={e => setChallDesc(e.target.value)} value={challDesc}/>
            </div>

            <div className="relative pt-5 min-w-30" onClick={() => setShowingChallDescPreview(a => !a)}>
                <span className="absolute left-1/2 top-0 -translate-x-1/2">Preview (click to {showingChallDescPreview ? "hide" : "show"})</span>
                {showingChallDescPreview && <ReactMarkdown
                    components={components}
                    remarkPlugins={[remarkGfm]}>
                    {challDesc || challenge.clientSideMetadata.desc}
                </ReactMarkdown>}
            </div>
            <br/>

            <label
                htmlFor="ChallPointsInput"
                className="w-fit text-lg mb-2">
                Points
            </label>
            <div className="relative">
                <span
                    onClick={() => setChallPoints(challenge.clientSideMetadata.points)}
                    className="absolute top-2 right-3 hover:opacity-100 opacity-10 transition-opacity cursor-pointer">
                    Fill
                </span>
                <input
                    placeholder={challenge.clientSideMetadata.points.toString()}
                    type="text"
                    
                    className="
                        p-2 text-lg
                        bg-slate-800 border-4 border-slate-900 rounded-lg

                        [appearance:textfield]
                        [&::-webkit-outer-spin-button]:appearance-none
                        [&::-webkit-inner-spin-button]:appearance-none"
                    name="ChallPointsInput"
                    onChange={e => {
                        const number = parseInt(e.currentTarget.value);

                        if (e.currentTarget.value === "") setChallPoints(null);
                        else if (Number.isInteger(number)) setChallPoints(number);
                        else e.currentTarget.value = challPoints?.toString() || "";
                    }}
                    value={challPoints?.toString() || ""}/>
            </div>
            <br/>

            <label
                htmlFor="ChallCategoriesInput"
                className="w-fit text-lg mb-2">
                Categories
            </label>
            <div className="relative">
                <span
                    onClick={() => setChallCategories(challenge.clientSideMetadata.categories.join(", "))}
                    className="absolute top-2 right-3 hover:opacity-100 opacity-10 transition-opacity cursor-pointer">
                    Fill
                </span>
                <input
                    placeholder={challenge.clientSideMetadata.categories.join(", ")}
                    type="text"
                    className="
                        p-2 text-lg
                        bg-slate-800 border-4 border-slate-900 rounded-lg"
                    name="ChallCategoriesInput"
                    onChange={e => setChallCategories(e.target.value.toLowerCase())} value={challCategoryStr}/>
            </div>
            <span className="text-sm">Separate categories with commas</span>
            <span className="text-md mt-2">{challCategories.join(", ")}</span>
            <br/>

            <label
                htmlFor="ChallVisibleInput"
                className="w-fit text-lg mb-2">
                Visible
            </label>
            <div className="flex flex-col justify-center items-center">
                <input
                    type="checkbox"
                    className="
                        bg-slate-800 checked:bg-slate-600
                        border-4 border-slate-900
                        rounded-lg w-8 h-8
                        appearance-none relative
                        
                        after:absolute
                        after:border-b-3 after:border-r-3 after:w-2.5 after:h-4
                        after:rotate-45 after:translate-x-0 after:left-[0.45rem] after:top-[0.05rem]
                        after:opacity-0 checked:after:opacity-100"
                    name="ChallVisibleInput"
                    checked={challVisible}
                    onChange={e => setChallVisible(e.target.checked)} value={challName}/>
                <span
                    onClick={() => setChallVisible(challenge.visible)}
                    className="hover:opacity-100 opacity-10 transition-opacity cursor-pointer">
                    Reset
                </span>
            </div>
            <br/>

            <div className="w-2/3 min-w-44 flex flex-row space-x-3 mx-auto mb-4">
                <button
                    onClick={() => setModalAction([
                        async () => {
                            await sendMetadataModifyReq(challenge.id, challName, challDesc, challPoints, challCategories, null, challVisible);
                            refreshProps();
                        },
                        `update the metadata for ${challenge.clientSideMetadata.name}`,
                    ])}
                    disabled={!isChanged}
                    className="bg-red-900 font-bold p-1 rounded-md flex-grow w-1/4 disabled:opacity-50">
                    Update Metadata
                </button>
                <button
                    onClick={exitChallMetaEditor}
                    disabled={false}
                    className="bg-slate-800 p-1 rounded-md flex-grow w-1/4">
                    Cancel
                </button>
            </div>
        </div>

        <ActionModal {...{ actionName, modalAction, clearAction: () => setModalAction([null, ""]) }}/>
    </>;
}


export default ChallMetaEditor;
