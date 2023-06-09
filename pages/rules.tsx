// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner from "components/HeaderBanner";

// Hooks


// Types
import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Competition } from 'metadata/client';

// Utils
import getCompetition from "metadata/client";
import getAccount, { Account } from "account/validation";
import { wrapServerSideProps, pageLogger } from "logging";
import Link from "next/link";

interface RulePageProps {
    metadata: Competition;
    account: Account | null;
}

const RulePage: FC<RulePageProps> = ({ metadata, account }) => {
    return (
        <div className="flex flex-col h-screen">
            <WebsiteMeta metadata={metadata} pageName="Home"/>
            <HeaderBanner account={account} meta={metadata} currPage={null} />
            <div className="flex flex-col sm:px-16">

                <span className="text-4xl font-bold text-center pt-3 text-rules-header-color">Event Rules</span>
            
                <hr className="border border-b-rules-divider-color w-3/5 mx-auto mt-4 mb-8"></hr>

                <span className="text-3xl font-semibold text-center pb-3 text-rules-subheader-color">Eligibility</span>
                <p className="mx-16">Any team of up to five people can participate in {metadata.name}. However, for a team to be eligible to receive prizes, all team members must live in the U.S.A. and be attending a middle or high school or be home-schooled. There will be a separate scoreboard for eligible teams, but anyone from around the world is invited to participate and will be eligible for CTFtime points.</p>

                <hr className="border border-b-rules-divider-color w-3/5 mx-auto mt-6 mb-6"></hr>

                <span className="text-3xl font-semibold text-center text-rules-subheader-color pb-3">Rules</span>
                <ol className="list-decimal mx-20">
                    <li>You can use any software, tool, or internet resource to solve the CTF challenges (subject to the restrictions below).</li>
                    <li>While you can ask anyone for help with technical assistance on preexisting software, you cannot collaborate with anyone outside your team on solutions to challenges.</li>
                    <li>A BCACTF team can have up to five people.</li>
                    <li>Each team member must have their own account and all team members must be registered to the same team.</li>
                    <li>No flag, solution, or hint sharing between teams. Also, do not accept any hints or guidance from anyone besides BCACTF staff.</li>
                    <li>Do not attack our infrastructure for any purpose other than solving challenges, and do not attack other teams.</li>
                    <li>You may submit multiple times if your flags are incorrect, but do not brute-force guess flags.</li>
                    <li>We reserve the right to require verification from top teams before prize distribution, including photo identification and problem write-ups.</li>
                    <li>We reserve the right to take any administrative action (including but not limited to disqualification) if necessary. All decisions by BCACTF administration are final.</li>
                    <li>Have fun!</li>
                </ol>

                <hr className="border border-b-rules-divider-color w-3/5 mx-auto mt-6 mb-6"></hr>

                <span className="text-3xl font-semibold text-center text-rules-subheader-color pb-3">Prizes</span>
                <span className="text-xl font-semibold text-center pb-3">Information Coming Soon</span>
                {/* <p className="text-md mx-16 pb-4">The top ten eligible teams will receive prizes out of a pool of <strong>$3000 USD</strong> courtesy of <Link className="underline text-rules-link-color hover:text-rules-link-hover-color transition" href="https://www.trailofbits.com/">Trail of Bits</Link> and <Link className="underline text-rules-link-color hover:text-rules-link-hover-color transition" href="https://www.digitalocean.com">DigitalOcean</Link>. The distribution is as follows:</p> */}
                {/* <p className="text-md mx-16 pb-4">The top ten eligible teams will receive prizes out of a pool of <strong>$3000 USD</strong> courtesy of <Link className="underline text-rules-link-color hover:text-rules-link-hover-color transition" href="https://www.trailofbits.com/">Trail of Bits</Link> and <Link className="underline text-rules-link-color hover:text-rules-link-hover-color transition" href="https://www.digitalocean.com">DigitalOcean</Link>. The distribution is as follows:</p>
                <ul className="list-[circle] mx-20 pb-8">
                    <li>First place: $500 and $250 DO Credits</li>
                    <li>Second place: $250 and $250 DO Credits</li>
                    <li>Third place: $125 and $250 DO Credits</li>
                    <li>Fourth place: $75 and $250 DO Credits</li>
                    <li>Fifth place: $50 and $250 DO Credits</li>
                    <li>Sixth place: $250 DO Credits</li>
                    <li>Seventh to Tenth place: $125 DO Credits</li>
                </ul> */}

            </div>
        </div>
    )
}

export const getServerSideProps = wrapServerSideProps<RulePageProps>(async function RulesSSP(context) {
    pageLogger.info`Received request for ${context.resolvedUrl}`;

    const props: RulePageProps = {
        metadata: await getCompetition(),
        account: await getAccount(context),
    };
    return { props };
});

export default RulePage;
