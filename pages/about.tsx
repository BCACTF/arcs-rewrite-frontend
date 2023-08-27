// Components
import WebsiteMeta from "components/WebsiteMeta";
import HeaderBanner from "components/HeaderBanner";
import Link from "next/link";

// Hooks


// Types
import React, { FC } from 'react';
import { Competition } from 'metadata/client';
import { Account } from "account/validation";

// Utils
import getCompetition from "metadata/client";
import getAccount from "account/validation";
import { wrapServerSideProps, pageLogger } from "logging";

interface AboutPageProps {
    metadata: Competition;
    account: Account | null;
}

const AboutPage: FC<AboutPageProps> = ({ metadata, account }) => {
    const pairs: [JSX.Element, JSX.Element][] = [
        [
            <>What is {metadata.name}?</>,
            <>{metadata.name} is a cybersecurity CTF competition targeted at middle and high schoolers. Inspired by other high-school CTFs like <Link className="underline text-about-link-color hover:text-about-link-hover-color transition" href="https://www.picoctf.org/">picoCTF</Link>, {metadata.name} is a collection of cybersecurity problems in categories like web exploitation, binary exploitation, cryptography, reverse engineering, and forensics. Like other CTFs, when your team solves a problem, you will find or receive a "flag" (a string of text in the form <code>bcactf&#123;example_flag&#125;</code>) which you will submit to the server to gain points.</>,
        ],
        [
            <>Can I compete in {metadata.name}?</>,
            <>Yes! The criteria for prize eligibility are on the <Link className="underline text-about-link-color hover:text-about-link-hover-color transition" href="/rules">rules page</Link>, but anyone anywhere can participate. There will be a global scoreboard and an additional board for eligible teams only.</>,
        ],
        [
            <>How do I join and participate?</>,
            <>To join, you must create an account on this website. Once you have an account, you can create a team or join an existing team. Once you have a team, you can start solving problems! You can find problems on the <Link className="underline text-about-link-color hover:text-about-link-hover-color transition" href="/play">play page</Link>. Once you solve a problem, you can submit the flag on the problem page to gain points. The team with the most points at the end of the competition wins!</>,
        ],
        [
            <>How difficult is {metadata.name}?</>,
            <>{metadata.name} has a wide range of problems across many difficulties. Everyone from fledgling CTF teams up to the best high school groups should find challenging problems at their skill level.</>,
        ],
        [
            <>How is it scored?</>,
            <>Each challenge is worth a set amount of points based on its difficulty. When your team solves a problem by submitting the correct flag, your team will get the amount of points specified by the problem. There is no penalty for incorrect submissions. The team with the highest score at the end of the contest wins; ties will be broken by the first team to reach their score; earlier is better.</>,
        ],
    ];

    const administrators: string[] = [
        "Krish Arora",
        "Skyler Calaman",
        "Zsofia Gordon",
        "Yusuf Sallam",
        "Andrew Theberge",
    ];

    const problemWriters: string[] = [
        "Krish Arora",
        "Zsofia Gordon",
	"Parth Jain",
	"Jacob Berger",
        "Andrew Theberge",
        "Marvin Mao",
        "Mudasir Ali",
        "Jeremy Lee",
        "Michael Middlezong",
        "Puhalenthi Ramesh",
        "Thomas Raskin",
        "Jack Crowley",
        "Tyler Hogan",
    ];

    administrators.sort((a, b) => a.split(" ").slice(-1)[0].localeCompare(b.split(" ").slice(-1)[0]));
    problemWriters.sort((a, b) => a.split(" ").slice(-1)[0].localeCompare(b.split(" ").slice(-1)[0]));

    return (
        <div className="flex flex-col h-screen">
            <WebsiteMeta metadata={metadata} pageName="Home" />
            <HeaderBanner account={account} meta={metadata} currPage={null} />
            <div className="flex flex-col sm:px-16">

                <span className="text-4xl font-bold text-center pt-3 text-about-header-color">About</span>

                <hr className="border border-b-about-divider-color w-3/5 mx-auto mt-4 mb-8"></hr>

                <span className="text-3xl font-semibold text-center pb-3 text-about-subheader-color">FAQ</span>
                {pairs.flatMap(([question, answer], idx) => [
                    <span className="text-xl font-semibold pb-3 about mt-4" key={`${idx}-question`}>{question}</span>,
                    <p className="mx-16" key={`${idx}-answer`}>{answer}</p>,
                ])}

                <hr className="border border-b-about-divider-color w-3/5 mx-auto mt-6 mb-6"></hr>
                <span className="text-3xl font-semibold text-center pb-3 text-about-subheader-color">About Us</span>
                <p className="mx-16">The Bergen County Academies CTF Club is a group of CTF enthusiasts at the Bergen County Academies high school. We created BCACTF 4.0 to share our love of CTFs with high schoolers everywhere. {metadata.name}'s student contributors are, in alphabetical order by last name:</p>
                <span className="text-xl font-semibold pb-3">Administrators</span>
                <ul className="list-[circle] mx-20 pb-8">
                    {administrators.map((name, idx) => <li key={idx}>{name}</li>)}
                </ul>
                <span className="text-xl font-semibold pb-3 faq-question faq-question">Problem Writers</span>
                <ul className="list-[circle] mx-20 pb-8">
                    {problemWriters.map((name, idx) => <li key={idx}>{name}</li>)}
                </ul>
                <hr className="border border-b-about-divider-color w-3/5 mx-auto mt-6 mb-6"></hr>
                <span className="text-3xl font-semibold text-center pb-3 text-about-subheader-color">Contact</span>
                <p className="mx-16">If you have any questions, comments, or concerns, please email us at <Link className="underline text-about-link-color hover:text-about-link-hover-color transition" href="mailto:contact@bcactf.com">contact@bcactf.com</Link>.</p>
                <p className="mx-16">Join our <Link className="underline text-about-link-color hover:text-about-link-hover-color transition" href="https://discord.gg/RtVAMUckK3">Discord server</Link> to find a team or have a chat.</p>
                <p className="mx-16 mb-4">Have fun!</p>
            </div>
        </div>
    )
}

export const getServerSideProps = wrapServerSideProps<AboutPageProps>(async function AboutSSP(context) {
    pageLogger.info`Received request for ${context.resolvedUrl}`;

    const props: AboutPageProps = {
        metadata: await getCompetition(),
        account: await getAccount(context),
    };
    return { props };
});

export default AboutPage;
