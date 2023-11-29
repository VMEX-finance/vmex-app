import React, { useEffect } from 'react';
import { IDialogProps } from '../utils';
import { ModalFooter, ModalHeader } from '../subcomponents';
import { Button, Card } from '@/ui/components';
import { useDialogController, useLocalStorage } from '@/hooks';

const Bold = ({ children }: { children: React.ReactNode }) => (
    <span className="font-semibold">{children}</span>
);
const Italic = ({ children }: { children: React.ReactNode }) => (
    <span className="italic">{children}</span>
);
const Under = ({ children }: { children: React.ReactNode }) => (
    <span className="underline">{children}</span>
);
const UandI = ({ children }: { children: React.ReactNode }) => (
    <span className="underline italic">{children}</span>
);
const List = ({ list, type = 'num', id }: { list: string[]; type?: 'num' | 'dot'; id: string }) => (
    <ol className={`${type === 'num' ? 'list-decimal' : 'list-disc'} pl-4`}>
        {list.map((x, i) => (
            <li className="py-2" key={`tos-${id}-${i}`}>
                {x}
            </li>
        ))}
    </ol>
);

export const TermsOfServiceDialog: React.FC<IDialogProps> = ({
    name,
    isOpen,
    data,
    closeDialog,
}) => {
    const [hasAgreed, setHasAgreed] = useLocalStorage('terms-of-service-agree', false);

    useEffect(() => {
        if (hasAgreed && closeDialog) closeDialog('tos-dialog');
    }, [hasAgreed]);

    return (
        <>
            <ModalHeader dialog="tos-dialog" tabs={['Terms of Service']} />

            <div className="py-6 flex flex-col gap-4">
                <Card type="inner" className="max-h-[60vh]">
                    <div className="flex flex-col gap-3 leading-tight text-sm">
                        <p className="font-medium">
                            ATTENTION: USE OF THE LENDING PROTOCOL FUNCTIONS BY INDIVIDUALS OR
                            ENTITIES WHO ARE CURRENTLY OR ORDINARILY LOCATED OR RESIDENT IN THE
                            UNITED STATES IS STRICTLY PROHIBITED, REGARDLESS OF THE USER&apos;S IP
                            ADDRESS. UTILIZING A VIRTUAL PRIVATE NETWORK OR OTHER METHOD TO CONCEAL
                            A USER&apos;S UNITED STATES RESIDENCE IS ALSO STRICTLY PROHIBITED AND
                            MAY RESULT IN PERMANENT BLOCKING OF USE OF THE SITE IN CONNECTION WITH
                            BLOCKCHAIN ADDRESSES SUSPECTED OF BEING TIED TO A UNITED STATES
                            RESIDENCE OR PLACE OF BUSINESS.
                        </p>
                        <p className="py-2">
                            These terms and conditions (these <Bold>“Terms”</Bold>) constitute a
                            binding legal agreement between each individual, entity, group or
                            association who views, interacts, links to or otherwise uses or derives
                            any benefit from the Site (as defined below) (<Bold>“Users”</Bold>) and
                            Volatile Labs Ltd., a British Virgin Islands business company (the
                            owner/operator of the Site) (collectively with its successors and
                            assigns, the <Bold>“Site Operator”</Bold>).
                        </p>
                        <p className="font-bold uppercase text-center">Summary</p>
                        <p className="py-2">
                            Among other things, the Terms and Conditions provide that you must:
                        </p>
                        <List
                            id="summary"
                            list={[
                                'be at least eighteen years of age, of sound mental capacity and have all technical knowledge necessary or advisable to understand and evaluate the risks of the Site and the VMEX Protocol;',
                                `agree that the Site is provided for informational purposes only and is not directly or indirectly in
                                control of or capable of interacting with Ethereum Mainnet, altchains and related Blockchain
                                Systems or performing or effecting any transactions on your behalf;`,
                                `agree that the Site is only being provided as an aid to your own independent research and
                                evaluation of the VMEX Protocol and that no representation or warranty is being made as to the
                                accuracy or completeness of information on the Site;`,
                                `agree that the ability of the Site to connect with third-party wallet applications or devices is not an
                                endorsement or recommendation thereof by or on behalf of the Site Operator, and you must
                                assume all responsibility for selecting and evaluating and incurring the risks of any bugs, defects,
                                malfunctions or interruptions of any third-party wallet applications or devices you directly or
                                indirectly use in connection with the Site;`,
                                `comply with all applicable laws, rules and regulations;`,
                                `not be currently or ordinarily located or resident in (or incorporated or organized in) the United
                                States or an individual or entity subject to national or international sanctions under the laws of the
                                British Virgin Islands, United Kingdom or other applicable laws;`,
                                `not hold the Site Operator or any of its representatives or affiliates liable for any damages you
                                suffer in connection with your use of the Site or the VMEX Protocol;`,
                                `waive your right to initiate or participate in class actions relating to the Site; and`,
                                `resolve any disputes regarding the Site pursuant to binding, confidential arbitration and waive
                                your right to a jury trial in connection with such disputes.`,
                            ]}
                        />
                        <p className="py-2">
                            The above is only a partial summary. You should read the{' '}
                            <Bold>Terms and Conditions in their entirety</Bold>. In the event of any
                            conflict or consistency on between this summary and the Terms and
                            Conditions relating to any issue, the Terms and Conditions will be
                            determinative of the issue.
                        </p>
                        <h1 className="font-bold uppercase text-center">SITE OVERVIEW</h1>
                        <h2>I. About the Site</h2>
                        <p className="py-2">
                            The Site aggregates and publishes publicly available third-party
                            information about:
                        </p>
                        <List
                            id="about"
                            list={[
                                'the Ethereum Mainnet, Optimism Mainnet, Arbitrum Mainnet, Base Mainnet;',
                                'the VMEX Protocol;',
                                "tokens that exist and have been or may be made available for withdrawal or 'borrowing' by third parties known as 'lenders' or 'depositors' in connection with the VMEX Protocol;",
                                "third-party smart contract systems that act as 'borrowers' or 'lenders' in contract-to-contract (C2C) transactions;",
                                'the implied or express fair market prices of tokens, which may be denominated in terms of other tokens; and',
                                'transaction records relating to the VMEX Protocol.',
                            ]}
                        />
                        <p className="py-2">
                            The Site also offers interaction methods whereby the User can indicate a
                            transaction the User would like to perform in connection with the VMEX
                            Protocol (such as swapping one token for another).
                        </p>
                        <p className="py-2">
                            When used in this way, the Site can generate a draft transaction message
                            which the User can independently use in conjunction with a third-party
                            wallet application or device to conduct transactions on Ethereum Mainnet
                            or altchains.
                        </p>
                        <h2>II. About VMEX</h2>
                        <p className="py-2">
                            The VMEX Protocol is software source code freely licensed to the public,
                            which provides a decentralized &ldquo;lending&rdquo; protocol through
                            which tokens can be &lsquo;loaned&rsquo; and &lsquo;borrowed&rsquo;. The
                            VMEX Protocol that has been compiled to bytecode and permanently
                            associated with one or more specific public addresses on Ethereum
                            Mainnet.
                        </p>
                        <h2>III. Relationship to VMEX Protocol</h2>
                        <p className="py-2">
                            Using the VMEX Protocol, Ethereum Mainnet, Optimism Mainnet, Arbitrum
                            Mainnet, Base Mainnet, or the software that works on the VMEX Protocol
                            does not require use of the Site. The Site aggregates and publishes
                            publicly available information about the VMEX Protocol in a
                            user-friendly and convenient format. Such information is also
                            independently available from other sources—for example, a person may
                            directly review transaction history, account balances and the VMEX
                            Protocol on a compatible block explorer for Ethereum Mainnet or an
                            altchain.
                        </p>
                        <p className="py-2">
                            The Site Operator and the Site are not agents or intermediaries of the
                            User, do not store or have access to or control over any tokens, private
                            keys, passwords, accounts or other property of the User, and are not
                            capable of performing transactions or sending transaction messages on
                            behalf of the User. The Site does not hold and cannot purchase, sell, or
                            trade any tokens. All transactions relating to the VMEX Protocol are
                            effected and recorded solely through the interactions of the User with
                            the respective Validators, who are not under the control of or
                            affiliated with the Site Operator or the Site.
                        </p>

                        <h2>IV. Disclaimers and Disclosures</h2>
                        <p className="py-2">
                            Important disclaimers and disclosures regarding the subject material of
                            the Site can be found in Section 6. You should familiarize yourself with
                            these disclaimers and disclosures and conduct your own thorough due
                            diligence into the VMEX Protocol before using the Site.
                        </p>

                        <p className="font-bold uppercase text-center">Binding Provisions</p>
                        <p className="py-2">
                            <Bold>
                                1. <Under>Certain Defined Terms</Under>
                            </Bold>
                            <br />
                            The following are key terms used in these Terms:
                            <List
                                id="defined-terms"
                                type="dot"
                                list={[
                                    `Blockchain means a blockchain or distributed ledger technology or other similar technology.`,
                                    `Blockchain System means the combination of (i) a Blockchain; and (ii) a network of devices operating software clients or software applications that jointly or individually store, validate, process transactions with respect to, update, resolve forks with respect to and otherwise maintain, read from and write to such Blockchain.`,
                                    `Blockchain Tokens means virtual currencies, tokens and other units of account or mediums of exchange that are implemented on a Blockchain System.`,
                                    `$ETH means the Blockchain Tokens native to Ethereum Mainnet and the staking of which impacts which Ethereum Mainnet Nodes have the ability to propose and validate new blocks on the Ethereum Mainnet blockchain.`,
                                    `Ethereum Mainnet Nodes means, at each time, the internet-connected computers then running unaltered and correctly configured instances of the Ethereum Mainnet.`,
                                    `Ethereum Mainnet means, at each time, the canonical blockchain and virtual machine environment of the Ethereum Protocol 'mainnet', as recognized by at least a majority of the Ethereum Mainnet Nodes then being operated in good faith in the ordinary course of the network. As of the date of these Terms, the Ethereum Mainnet is the network associated with Chain ID ‘1' and Network ID ‘1'.`,
                                    `Ethereum Protocol means the most up-to-date production release of Ethereum Mainnet client software.`,
                                    `Ethereum Mainnet Validators means, at each time, the Ethereum Mainnet Nodes selected as a validator for Ethereum Mainnet at such time.`,
                                    `VMEX Protocol means, collectively, the VMEX Protocol, any network based on the VMEX Protocol, and any altchains based on the VMEX Protocol.`,
                                    `Site means the web site, web pages, web applications and information and software available at or accessible through the URL vmex.finance or any sub-URL of any such URL and any other VMEX-related website or web application maintained by the Site Operator.`,
                                ]}
                            />
                        </p>
                        <p className="py-2">
                            <Bold>
                                2.{' '}
                                <Under>Site Operator Discretion; Certain Risks of the Site</Under>
                            </Bold>
                            <br />
                            <span></span>
                            <p className="pl-4 pt-4">
                                Each User hereby acknowledges and agrees and consents to, and
                                assumes the risks of, the matters described in this Section 2.
                            </p>
                        </p>
                        <div className="pl-8">
                            <p className="py-2">
                                <Bold>a. Content</Bold>
                                <br />
                                Site Operator makes no representations or warranties as to the
                                quality, origin, or ownership of any content found on or available
                                through the Site. Site Operator shall not be liable for any errors,
                                misrepresentations, or omissions in, of, and about, the content, nor
                                for the availability of the content. Site Operator shall not be
                                liable for any losses, injuries, or damages from the purchase,
                                inability to purchase, display, or use of content.
                            </p>
                            <p className="py-2">
                                <Bold>b. Token Lists and Token Identification</Bold>
                                <br />
                                In providing information about tokens, the Site associates or
                                presumes the association of a token name, symbol or logo with a
                                specific smart contract deployed to one or more blockchain systems.
                                Users must not rely on the name, symbol or branding of a token on
                                the Site, but instead must examine the specific smart contract
                                associated with the name, symbol or branding and confirm that the
                                token accords with User&apos;s expectations.
                            </p>
                            <p className="py-2">
                                <Bold>c. User Responsibility for Accounts & Security</Bold>
                                <br />
                                Users are solely responsible for all matters relating to their
                                accounts, addresses and tokens and for ensuring that all uses
                                thereof comply fully with these Terms. The compatibility of the Site
                                with wallet applications and devices or other third-party
                                applications or devices is not intended as an endorsement or
                                recommendation thereof or a warranty, guarantee, promise or
                                assurance regarding the fitness or security thereof.
                            </p>
                            <p className="py-2">
                                <Bold>d. No Site Fees; Third-Party Fees Irreversible</Bold>
                                <br />
                                There are no fees or charges for use of the Site. Use of the VMEX
                                Protocol is subject to third-party transaction fees. The Site
                                Operator does not receive such fees and has no ability to reverse or
                                refund any amounts paid in error.
                            </p>
                            <p className="py-2">
                                <Bold>
                                    e. Site Operator Has No Business Plan and May Discontinue,
                                    Limit, Terminate or Refuse Support for the Site or any Smart
                                    Contracts, Tokens or Pools
                                </Bold>
                                <br />
                                The Site Operator assumes no duties, liabilities, obligations or
                                undertakings to continue operating or maintaining the availability
                                of the Site and may terminate or change the Site in any or all
                                respects at any time.
                            </p>
                            <p className="py-2">
                                <Bold>
                                    f. Site Operator May Deny or Limit Access on a Targeted Basis
                                </Bold>
                                <br />
                                The Site Operator reserves the right to terminate or limit any
                                person&apos;s User status or access to or use of the Site at any
                                time, without notice, as determined in the Site Operator&apos;s sole
                                and absolute discretion.
                            </p>
                            <p className="py-2">
                                <Bold>
                                    g. Site Operator May Cooperate with Investigations and Disclose
                                    Information
                                </Bold>
                                <br />
                                The Site Operator reserves the right to cooperate with any
                                governmental or law enforcement investigation or to disclose any
                                information it deems necessary to satisfy any applicable law,
                                regulation, legal process or governmental request.
                            </p>
                            <p className="py-2">
                                <Bold>h. No Regulatory Supervision</Bold>
                                <br />
                                The Site Operator and the Site are not registered or qualified with
                                or licensed by any government agency or financial regulatory
                                authority or organization.
                            </p>
                        </div>
                        <p className="py-2">
                            <Bold>
                                3. <Under>Intellectual Property Matters</Under>
                            </Bold>
                        </p>
                        <div className="pl-8">
                            <p className="py-2">
                                <Bold>a. License to Use Site</Bold>
                                <br />
                                Each User, subject to and conditioned upon such User&apos;s
                                eligibility under and acceptance of and adherence to these Terms, is
                                hereby granted a personal, revocable, non-exclusive,
                                non-transferable, non-sub-licensable license to view, access and use
                                the Site for the Permitted Uses in accordance with these Terms.
                            </p>
                            <p className="py-2">
                                <Bold>b. Site Code &amp; License</Bold>
                                <br />
                                The software code for the Site is available at
                                https://github.com/VMEX-finance and is licensed for use in
                                connection with the VMEX Protocol, Ethereum Mainnet and altchains.
                            </p>
                            <p className="py-2">
                                <Bold>c. Privacy Policy</Bold>
                                <br />
                                The Site Operator may directly or indirectly collect and temporarily
                                store personally identifiable information for operational purposes,
                                including for the purpose of identifying blockchain addresses or IP
                                addresses that may indicate use of the Site from prohibited
                                jurisdictions or by sanctioned persons or other Prohibited Uses. Any
                                such personal information collected will be processed in accordance
                                with the Privacy Policy available at https://docs.vmex.finance/.
                            </p>
                            <p className="py-2">
                                <Bold>d. VMEX Protocol</Bold>
                                <br />
                                The VMEX Protocol will be available in various repositories at
                                https://github.com/VMEX-finance, and will be subject to any licenses
                                set forth in each such repository, as applicable.
                            </p>
                        </div>
                        <p className="py-2">
                            <Bold>
                                4. <Under>Permitted &amp; Prohibited Uses</Under>
                            </Bold>
                        </p>
                        <div className="pl-8">
                            <p className="py-2">
                                <Bold>a. Permitted Uses</Bold>
                                <br />
                                The Site is available exclusively for use by technologically and
                                financially sophisticated persons who wish to use the Site for
                                informational purposes only as an aid to their own research, due
                                diligence and financial decision making. Users must independently
                                verify the accuracy of information used in transactions.
                            </p>
                            <p className="py-2">
                                <Bold>b. Prohibited Uses</Bold>
                                <br />
                                Each User must not, directly or indirectly, in connection with their
                                use of the Site:
                                <List
                                    id="prohibited-uses"
                                    list={[
                                        'utilize the Site other than for the Permitted Uses;',
                                        'utilize the Site at any time when any representation of User set forth in Section 5 is untrue or inaccurate;',
                                        'rely on the Site as a basis for or a source of advice concerning any financial decision making or transactions;',
                                        'employ any device, scheme or artifice to defraud, or otherwise materially mislead, any person;',
                                        'engage in any act, practice or course of business that operates or would operate as a fraud or deceit upon the Site Operator or any other person;',
                                        'violate, breach or fail to comply with any applicable provision of these Terms or any other terms of service, privacy policy, trading policy or other contract governing the use of the Site;',
                                        'engage or attempt to engage in or assist any hack of or attack on the Site or any wallet application or device, including any “sybil attack”, “DoS attack” or “griefing attack” or theft;',
                                        'commit any violation of applicable laws, rules or regulations;',
                                        'engage in or knowingly facilitate any “front-running”, “wash trading”, “pump and dump trading”, “ramping”, “cornering” or fraudulent, deceptive or manipulative trading activities;',
                                        'transact in securities, commodities futures, trading of commodities on a leveraged, margined or financed basis, binary options (including prediction-market transactions), real estate or real estate leases, equipment leases, debt financings, equity financings or other similar transactions;',
                                        'engage in token-based or other financings of a business, enterprise, venture, DAO, software development project or other initiative, including ICOs, IEOs, or other token-based fundraising events;',
                                        'engage in any act, practice or course of business that operates to circumvent any sanctions or export controls targeting the User or the country or territory where User is located.',
                                    ]}
                                />
                            </p>
                        </div>
                        <p className="py-2">
                            <Bold>
                                5. <Under>Representations and Warranties of Users</Under>
                            </Bold>
                        </p>
                        <p className="pl-4">
                            By using the Site, each User represents and warrants to Site Operator
                            that the following statements and information are accurate and complete
                            at all relevant times. In the event that any such statement or
                            information becomes untrue as to a User, User shall immediately cease
                            accessing and using the Site.
                        </p>
                        <div className="pl-8">
                            <p className="py-2">
                                <Bold>a. Adult Status; Capacity; Residence; Etc.</Bold>
                                <br />
                                If User is an individual, User is of legal age in the jurisdiction
                                in which User resides (and in any event is older than eighteen years
                                of age) and is of sound mind. If User is a business entity, User is
                                duly organized, validly existing and in good standing under the laws
                                of the jurisdiction in which it is organized.
                            </p>
                            <p className="py-2">
                                <Bold>b. Power and Authority</Bold>
                                <br />
                                User has all requisite capacity, power and authority to accept the
                                terms and conditions of these Terms and to carry out and perform its
                                obligations under these Terms. These Terms constitutes a legal,
                                valid and binding obligation of User enforceable against User in
                                accordance with its terms.
                            </p>
                            <p className="py-2">
                                <Bold>c. No Conflict; Compliance with Law</Bold>
                                <br />
                                User agreeing to these Term and using the Site does not constitute a
                                breach of any law applicable to User, or contract or agreement to
                                which User is a party or by which User is bound.
                            </p>
                            <p className="py-2">
                                <Bold>d. Absence of Sanctions</Bold>
                                <br />
                                User is not, (and, if User is an entity, User is not owned or
                                controlled by any other person who is), acting, directly or
                                indirectly, on behalf of any other person who is, located,
                                ordinarily resident, organized, established, or domiciled in the
                                United States or any country where use of the VMEX Protocol or
                                altchains or related activities is illegal, prohibited, or requires
                                a permit or license. User is not (and, if User is an entity, User is
                                not owned or controlled by any other person who is) acting, directly
                                or indirectly, on behalf of any other person who is: in
                                contravention of any applicable laws and regulations, including
                                anti-money laundering regulations or conventions; a terrorist or a
                                member of a terrorist organization; identified on, or operationally
                                based or domiciled in a country or territory that is included in,
                                any list of prohibited parties under any law or by any nation or
                                government, state or other political subdivision thereof, any entity
                                exercising legislative, judicial or administrative functions of or
                                pertaining to government such as the sanctions lists maintained by
                                the United Kingdom (as are extended to the British Virgin Islands by
                                statutory instrument), United Nations (whether through the Security
                                Council, or otherwise), the U.S. government (including the U.S.
                                Treasury Department&apos;s Specially Designated Nationals list and
                                Foreign Sanctions Evaders list), or the European Union (EU) or its
                                member states; a senior foreign political figure, any member of a
                                senior foreign political figure&apos;s immediate family or any close
                                associate of a senior foreign political figure unless the director
                                of the Foundation, after being specifically notified by the User in
                                writing that it is such a person, conduct further due diligence and
                                determines that the User shall be permitted to use the Site; or as
                                trustee, agent, representative or nominee for a foreign shell bank.
                                The tokens or other funds User uses to participate in the VMEX
                                Protocol or altchains are not derived from, and do not otherwise
                                represent the proceeds of, any activities done in violation or
                                contravention of any law.
                            </p>
                            <p className="py-2">
                                <Bold>e. Non-Reliance</Bold>
                                <br />
                                User is knowledgeable and experienced in using and evaluating
                                blockchain and related technologies and assets, including the VMEX
                                Protocol and its implementations, and has conducted its own
                                investigation and analysis of the VMEX Protocol and altchains.
                            </p>
                        </div>
                        <p className="py-2">
                            <Bold>
                                6. <Under>Risks, Disclaimers and Limitations of Liability</Under>
                            </Bold>
                        </p>
                        <p className="pl-4">
                            Each User hereby acknowledges and agrees and consents to, and assumes
                            the risks of, the matters described in this Section 6.
                        </p>
                        <div className="pl-8">
                            <p className="py-2">
                                <Bold>a. No Consequential, Incidental or Punitive Damages</Bold>
                                <br />
                                Notwithstanding anything to the contrary contained on the Site, in
                                these Terms, or in any other agreement or publication, Site Operator
                                shall not be liable to any person, whether in contract, tort
                                (including pursuant to any cause of action alleging negligence),
                                warranty or otherwise, for any economic or other damages to any User
                                or other person, including any special, incidental, consequential,
                                indirect, punitive or exemplary damages (including but not limited
                                to lost data, lost profits or savings, loss of business or other
                                economic loss) arising out of or related to these Terms, whether or
                                not Site Operator has been advised or knew of the possibility of
                                such damages, and regardless of the nature of the cause of action or
                                theory asserted.
                            </p>
                            <p className="py-2">
                                <Bold>b. Disclaimer of Representations</Bold>
                                <br />
                                The Site is being provided on an “AS IS” and “AS AVAILABLE” basis.
                                To the fullest extent permitted by law, Site Operator is not making,
                                and hereby disclaims, any and all information, statements,
                                omissions, representations and warranties, express or implied,
                                written or oral, equitable, legal or statutory, in connection with
                                the Site and the other matters contemplated by these Terms,
                                including any representations or warranties of title,
                                non-infringement, merchantability, usage, security, uptime,
                                reliability, suitability or fitness for any particular purpose,
                                workmanship or technical quality of any code or software used in or
                                relating to the Site. User acknowledges and agrees that use of the
                                Site is at the User&apos;s own risk.
                            </p>
                            <p className="py-2">
                                <Bold>
                                    c. No Responsibility for Tokens; No Guarantee of Uniqueness or
                                    IP
                                </Bold>
                                <br />
                                Site Operator has no responsibility for the tokens traded by Users
                                on the VMEX Protocol or altchains. Site Operator does not
                                investigate and cannot guarantee or warrant the authenticity,
                                originality, uniqueness, marketability, legality or value of any
                                token traded by Users on the VMEX Protocol or altchains, even if
                                information about such token is available on the Site.
                            </p>
                            <p className="py-2">
                                <Bold>d. No Proffesional Advice or Liability</Bold>
                                <br />
                                All information provided by or on behalf of Site Operator is for
                                informational purposes only and should not be construed as
                                professional, accounting or legal advice. Users should not take or
                                refrain from taking any action in reliance on any information
                                contained in these Terms or provided by or on behalf of Site
                                Operator. Before Users make any financial, legal, or other decisions
                                involving the Site, Users should seek independent professional
                                advice from persons licensed and qualified in the area for which
                                such advice would be appropriate.
                            </p>
                            <p className="py-2">
                                <Bold>e. Limited Survival Period for Claims</Bold>
                                <br />
                                Any claim or cause of action a User may have or acquire in
                                connection with the Site or any of the other matters contemplated by
                                these Terms shall survive for the shorter of, and may be brought
                                against Site Operator solely prior to: (a) the expiration of the
                                statute of limitations applicable thereto; and (b) the date that is
                                six months after the date on which the facts and circumstances
                                giving rise to such claim or cause of action first arose.
                            </p>
                            <p className="py-2">
                                <Bold>f. Third-Party Offerings and Content</Bold>
                                <br />
                                References, links or referrals to or connections with or reliance on
                                third-party resources, products, services or content, including
                                smart contracts developed or operated by third parties, may be
                                provided to Users in connection with the Site. In addition, third
                                parties may offer promotions related to the Site. Site Operator does
                                not endorse or assume any responsibility for any activities of or
                                resources, products, services, content or promotions owned,
                                controlled, operated or sponsored by third parties. If Users access
                                any such resources, products, services or content or participate in
                                any such promotions, Users do so solely at their own risk. Each User
                                hereby expressly waives and releases Site Operator from all
                                liability arising from User&apos;s use of any such resources,
                                products, services or content or participation in any such
                                promotions. User further acknowledges and agrees that Site Operator
                                shall not be responsible or liable, directly or indirectly, for any
                                damage or loss caused or alleged to be caused by or in connection
                                with use of or reliance on any such resources, products, services,
                                content or promotions from third parties.
                            </p>
                            <p className="py-2">
                                <Bold>g. Certain Uses and Risks of Blockchain Technology</Bold>
                                <br />
                                <div className="pl-4">
                                    <p className="py-2">
                                        i. Use of Blockchain Technology. Site Operator or third
                                        parties may utilize experimental cryptographic technologies
                                        and blockchain technologies, including tokens,
                                        cryptocurrencies, stablecoins, “smart contracts,” consensus
                                        algorithms, voting systems and distributed, decentralized or
                                        peer-to-peer networks or systems in connection with the Site
                                        or systems about which the Site provides information. Each
                                        User acknowledges and agrees that such technologies are
                                        novel, experimental, and speculative, and that therefore
                                        there is significant uncertainty regarding the operation and
                                        effects and risks thereof and the application of existing
                                        law thereto.
                                    </p>
                                    <p className="py-2">
                                        ii. Certain Risks of Blockchain Technology. The technologies
                                        relevant to the Site depend on public peer-to-peer networks
                                        such as Ethereum Mainnet and the altchains that are not
                                        under the control or influence of Site Operator and are
                                        subject to many risks and uncertainties. Such technologies
                                        include the VMEX Protocol, which Site Operator has no
                                        ability to change, other than ceasing to display information
                                        about certain “smart contracts” or adding information about
                                        new “smart contracts”. Users are solely responsible for the
                                        safekeeping of the private key associated with the
                                        blockchain address used in connection with the VMEX
                                        Protocol. Site Operator will not be able to restore or issue
                                        any refund in respect of property lost or frozen due to loss
                                        of private keys or otherwise. If a User is not able to spend
                                        or use tokens due to loss or theft of the corresponding
                                        private key or otherwise, a User will be unable to enjoy the
                                        benefits of such tokens.
                                    </p>
                                    <p className="py-2">
                                        iii. Certain Risks of Smart Contract Technology. Digital
                                        assets relevant to the Site depend on the VMEX Protocol or
                                        other smart contracts deployed to altchains or other
                                        blockchain systems, or on the Ethereum Mainnet, each of
                                        which may be coded or deployed by persons other than Site
                                        Operator. Ethereum Mainnet, altchains, and other Blockchain
                                        Systems, and, once deployed to a Blockchain System, the code
                                        of smart contracts, including the VMEX Protocl or
                                        implementations thereof, typically cannot be modified, or
                                        can only be modified in limited ways. In the event that the
                                        Ethereum Mainnet, altchains, VMEX Protocol or other smart
                                        contracts or blockchain systems are adversely affected by
                                        malfunctions, bugs, defects, malfunctions, hacking, theft,
                                        attacks, negligent coding or design choices, or changes to
                                        the applicable protocol rules, Users may be exposed to a
                                        risk of total loss and forfeiture of all relevant digital
                                        assets. Site Operator assumes no liability or responsibility
                                        for any of the foregoing matters.
                                    </p>
                                    <p className="py-2">
                                        iv. Asset Prices. The fiat-denominated prices and value in
                                        public markets of cryptocurrencies and tokens have
                                        historically been subject to dramatic fluctuations and may
                                        be highly volatile. As relatively new products and
                                        technologies, blockchain-based assets are not widely
                                        accepted as a means of payment for goods and services. A
                                        significant portion of demand for these assets is generated
                                        by speculators and investors seeking to profit from the
                                        short- or long-term holding of blockchain assets. The market
                                        value of any token may decline below the price for which a
                                        User acquires such asset through the Ethereum Mainnet,
                                        altchains or the VMEX Protocol or on any other system. User
                                        acknowledges and agrees that the costs and speeds of
                                        transacting with cryptographic and blockchain-based systems
                                        such as the Ethereum Mainnet, altchains and the VMEX
                                        Protocol are variable and may increase or decrease
                                        dramatically at any time, resulting in prolonged inability
                                        to access or use any tokens.
                                    </p>
                                    <p className="py-2">
                                        v. Regulatory Uncertainty. Blockchain technologies and
                                        digital assets are subject to many legal and regulatory
                                        uncertainties, and the Ethereum Mainnet, altchains, the VMEX
                                        Protocol or any tokens could be adversely impacted by one or
                                        more regulatory or legal inquiries, actions, suits,
                                        investigations, claims, fines or judgments, which could
                                        impede or limit the ability of User to continue the use and
                                        enjoyment of such assets and technologies.
                                    </p>
                                    <p className="py-2">
                                        vi. Cryptography Risks. Cryptography is a progressing field.
                                        Advances in code cracking or technical advances such as the
                                        development of quantum computers may present risks to
                                        Blockchain Systems, the Ethereum Mainnet, altchains, the
                                        VMEX Protocol or tokens, including the theft, loss or
                                        inaccessibility thereof.
                                    </p>
                                    <p className="py-2">
                                        vii. Fork Handling. Ethereum Mainnet, altchains, the the
                                        VMEX Protocol, and all tokens may be subject to “forks.”
                                        Forks occur when some or all persons running the software
                                        clients for a particular blockchain system adopt a new
                                        client or a new version of an existing client that: (i)
                                        changes the protocol rules in backwards-compatible or
                                        backwards-incompatible manner that affects which
                                        transactions can be added into later blocks, how later
                                        blocks are added to the blockchain, or other matters
                                        relating to the future operation of the protocol; or (ii)
                                        reorganizes or changes past blocks to alter the history of
                                        the blockchain. Some forks are “contentious” and thus may
                                        result in two or more persistent alternative versions of the
                                        protocol or blockchain, either of which may be viewed as or
                                        claimed to be the legitimate or genuine continuation of the
                                        original. Site Operator may not be able to anticipate,
                                        control or influence the occurrence or outcome of forks, and
                                        does not assume any risk, liability or obligation in
                                        connection therewith. Without limiting the generality of the
                                        foregoing, Site Operator does not assume any responsibility
                                        to notify a User of pending, threatened or completed forks.
                                        Site Operator will respond (or refrain from responding) to
                                        any forks in such manner as Site Operator determines in its
                                        sole and absolute discretion, and Site Operator shall not
                                        have any duty or obligation or liability to a User if such
                                        response (or lack of such response) acts to a User
                                        detriment. Without limiting the generality of the foregoing,
                                        Site Operator&apos;s possible and permissible responses to a
                                        fork may include: (i) honoring the Ethereum Mainnet,
                                        altchains, the VMEX Protocol and tokens on both chains;(ii)
                                        honoring the Ethereum Mainnet, altchains, the VMEX Protocol
                                        and tokens on only one of the chains; (iii) honoring the
                                        Ethereum Mainnet, altchains, the VMEX Protocol and tokens in
                                        different respects or to a different extent on both chains;
                                        or (iv) any other response or policy or procedure, as
                                        determined by Site Operator in its sole and absolute
                                        discretion. Each User assumes full responsibility to
                                        independently remain apprised of and informed about possible
                                        forks, and to manage the User&apos;s own interests and risks
                                        in connection therewith.
                                    </p>
                                    <p className="py-2">
                                        viii. Essential Third-Party Software Dependencies The
                                        Ethereum Mainnet, altchains, the VMEX Protocol and other
                                        relevant Blockchain Systems and smart contracts are public
                                        software utilities which are accessible directly through any
                                        compatible node or indirectly through any compatible
                                        “wallet” application (such as the web browser plugin
                                        MetaMask) which interacts with such a node. Interacting with
                                        the the VMEX Protocol does not require use of the Site, but
                                        the Site provides a convenient and user- friendly method of
                                        reading and displaying data from the the VMEX Protocol and
                                        generating standard transaction messages compatible with the
                                        the VMEX Protocol. Because the Site does not provide wallet
                                        software or nodes for the VMEX Protocol, such software
                                        constitutes an essential third-party or user dependency
                                        without which the VMEX Protocol cannot be utilized, and
                                        tokens cannot be traded or used. Furthermore, the site may
                                        utilize APIs, middleware and servers of Site Operator or
                                        third parties, and Site Operator does not guarantee the
                                        continued operation, maintenance, availability or security
                                        of any of the foregoing dependencies.
                                    </p>
                                </div>
                            </p>
                            <p className="py-2">
                                <Bold>h. Tax Issues</Bold>
                                <br />
                                The tax consequences of purchasing, selling, holding, transferring
                                or locking tokens or otherwise utilizing the VMEX Protocol are
                                uncertain, may vary by jurisdiction and may be adverse to a User.
                                Site Operator has undertaken no due diligence or investigation into
                                such tax consequences, assumes no obligation or liability to
                                optimize the tax consequences to any person and is not providing any
                                tax advice.
                            </p>
                            <p className="py-2">
                                <Bold>i. Legal Limitations on Disclaimers</Bold>
                                <br />
                                Some jurisdictions do not allow the exclusion of certain warranties
                                or the limitation or exclusion of certain liabilities and damages.
                                Accordingly, some of the disclaimers and limitations set forth in
                                these Terms may not apply in full to specific Users. The disclaimers
                                and limitations of liability provided in these terms shall apply to
                                the fullest extent permitted by applicable law.
                            </p>
                            <p className="py-2">
                                <Bold>j. Officers, Directors, Etc.</Bold>
                                <br />
                                All provisions of these Terms which disclaim or limit obligations or
                                liabilities of Site Operator shall also apply, mutatis mutandis, to
                                the officers, directors, secretary, supervisors, members, employees,
                                independent contractors, agents, stockholders, debtholders and
                                affiliates of Site Operator.
                            </p>
                            <p className="py-2">
                                <Bold>k. Indemnification</Bold>
                                <br />
                                All provisions of these Terms which disclaim or limit obligations or
                                liabilities of Site Operator shall also apply, mutatis mutandis, to
                                the officers, directors, secretary, supervisors, members, employees,
                                independent contractors, agents, stockholders, debtholders and
                                affiliates of Site Operator.
                            </p>
                        </div>
                        <p className="py-2">
                            <Bold>
                                7. <Under>Governing Law; Dispute Resolution</Under>
                            </Bold>
                        </p>
                        <div className="pl-8">
                            <p className="py-2">
                                <Bold>a. Governing Law</Bold>
                                <br />
                                These Terms shall be governed by and construed and interpreted in
                                accordance with the laws of the British Virgin Islands (irrespective
                                of the choice of laws principles) as to all matters, including
                                matters of validity, construction, effect, enforceability,
                                performance and remedies. Although the Site may be available in
                                other jurisdictions, each User hereby acknowledges and agrees that
                                such availability shall not be deemed to give rise to general or
                                specific personal jurisdiction over Site Operator in any forum
                                outside the British Virgin Islands.
                            </p>
                            <p className="py-2">
                                <Bold>b. SettlementNegotiations</Bold>
                                <br />
                                If a User has a potential legal dispute, claim or cause of action
                                against Site Operator, the User shall first (prior to initiating any
                                litigation proceedings) contact Site Operator by sending an email to
                                hello@vmex.finance describing the nature of the potential dispute,
                                claim or cause of action and providing all relevant documentation
                                and evidence thereof. User shall use commercially reasonable efforts
                                to negotiate a settlement of any such legal dispute, claim or cause
                                of action within 60 days of the delivery of such email. Any such
                                dispute, claim or cause of action that is not finally resolved by a
                                binding, written settlement agreement within such 60 days shall be
                                brought and resolved exclusively in accordance with the following
                                provisions of this Section 7.
                            </p>
                            <p className="py-2">
                                <Bold>c. Agreement to Binding, Exclusive Arbitration</Bold>
                            </p>
                            <br />
                            <div className="pl-4">
                                <p className="py-2">
                                    i. Mandatory Binding Arbitration. All disputes, controversies,
                                    claims, breaches and terminations directly or indirectly arising
                                    out of or in connection with or directly or indirectly relating
                                    to these Terms or any of the matters or transactions
                                    contemplated by these Terms (for the avoidance of doubt,
                                    including any claim seeking to invalidate, or alleging that, all
                                    or any part of these Terms is unenforceable, void or voidable)
                                    (such claims, disputes and controversies, collectively,
                                    “Disputes”) shall be resolved by confidential, binding
                                    arbitration to be seated in the British Virgin Islands in
                                    accordance with the laws of the British Virgin Islands
                                    (irrespective of the choice of laws principles) and conducted in
                                    the English language by a single arbitrator pursuant to the
                                    applicable rules of the American Arbitration Association
                                    International Centre for Dispute Resolution (the “Rules”). The
                                    arbitrator shall be appointed in accordance with the procedures
                                    set out in the Rules. The award or decision of the arbitrator
                                    shall be final and binding upon the parties and the parties
                                    expressly waive any right under the laws of any jurisdiction to
                                    appeal or otherwise challenge the award, ruling or decision of
                                    the arbitrator. The judgment of any award or decision may be
                                    entered in any court having competent jurisdiction to the extent
                                    necessary. No party hereto shall (or shall permit its
                                    representatives to) commence, continue or pursue any Dispute in
                                    any court; provided, however, that the Company shall be entitled
                                    to obtain an injunction or injunctions to prevent breaches of
                                    this provision and to enforce specifically the terms and
                                    provisions thereof, this being in addition to any other remedy
                                    to which the Company is entitled at law or in equity, and the
                                    parties hereto hereby waive the requirement of any posting of a
                                    bond or security for costs in connection with any such
                                    application for injunctive relief or specific performance.
                                </p>
                                <p className="py-2">
                                    ii. Waiver of Jury Trial. The parties hereby acknowledge,
                                    represent and warrant that they understand that:
                                </p>
                                <br />
                                <div className="pl-4">
                                    <p className="py-2">
                                        0. there is no judge or jury in arbitration, and, absent
                                        this mandatory provision, the parties may have the right to
                                        sue in court and have a jury trial concerning Disputes;
                                    </p>
                                    <br />
                                    <p className="py-2">
                                        1. in some instances, the costs of arbitration could exceed
                                        the costs of litigation;
                                    </p>
                                    <br />
                                    <p className="py-2">
                                        2. the right to discovery may be more limited in arbitration
                                        than in court; and
                                    </p>
                                    <br />
                                    <p className="py-2">
                                        3. court review of an arbitration award is limited. Each of
                                        the parties hereto hereby irrevocably waives any and all
                                        right to trial by jury in any action, suit or other legal
                                        proceeding arising out of or related to these Terms or the
                                        transactions contemplated hereby.
                                    </p>
                                    <br />
                                </div>
                                <p className="py-2">
                                    iii. Confidentiality of Arbitration. Except to the extent
                                    necessary to enforce their respective rights under these Terms
                                    or as otherwise required by applicable law or regulation, the
                                    parties undertake to maintain confidentiality as to the
                                    existence and events of the arbitration proceedings and as to
                                    all submissions, correspondence and evidence relating to the
                                    arbitration proceedings, save for disclosure to the relevant
                                    party&apos;s auditors, legal counsel or other advisors. This
                                    provision shall survive the termination of the arbitral
                                    proceedings.
                                </p>
                                <p className="py-2">
                                    iv. Court Jurisdiction. To the extent that any court is required
                                    to consider the enforceability of this Section 7.iii, to enforce
                                    any judgment of the arbitrator, then, without limiting this
                                    Section 7.iii or any other provision of this Agreement, the User
                                    (A) hereby irrevocably and unconditionally submits to the
                                    jurisdiction of the courts of the British Virgin Islands for
                                    such purpose; (B) agrees not to commence any suit, action or
                                    other proceeding arising in connection with or based upon this
                                    instrument or the matters contemplated by this instrument except
                                    before the courts of the British Virgin Islands, and (C) hereby
                                    waives, and agrees not to assert, by way of motion, as a
                                    defence, or otherwise, in any such suit, action or proceeding,
                                    any claim that it is not subject personally to the jurisdiction
                                    of the above- named courts, that its property is exempt or
                                    immune from attachment or execution, that the suit, action or
                                    proceeding is brought in an inconvenient forum, that the venue
                                    of the suit, action or proceeding is improper or that this
                                    instrument or the subject matter hereof or thereof may not be
                                    enforced in or by such court.
                                </p>
                            </div>
                            <p className="py-2">
                                <Bold>d. Class Action Waiver</Bold>
                                <br />
                                All Users hereby agree that any arbitration or other permitted
                                action with respect to any Dispute shall be conducted in their
                                individual capacities only and not as a class action or other
                                representative action, and the Users expressly waive their right to
                                file a class action or seek relief on a class basis.
                            </p>
                        </div>
                        <p className="py-2">
                            <Bold>
                                8. <Under>Governing Law; Dispute Resolution</Under>
                            </Bold>
                        </p>
                        <div className="pl-8">
                            <p className="py-2">
                                <Bold>a. Headings</Bold>
                                <br />
                                The headings and captions contained in these Terms are for
                                convenience of reference only, shall not be deemed to be a part of
                                these Terms and shall not be referred to in connection with the
                                construction or interpretation of these Terms.
                            </p>
                            <p className="py-2">
                                <Bold>b. Successors and Assigns</Bold>
                                <br />
                                These Terms shall inure to the benefit of Site Operator, the Users,
                                and their respective permitted successors, permitted assigns,
                                permitted transferees and permitted delegates and shall be binding
                                upon all of the foregoing persons and any person who may otherwise
                                succeed to any right, obligation or liability under these Terms by
                                operation of law or otherwise. A User shall not assign any of a User
                                rights or delegate any of a User liabilities or obligations under
                                these Terms to any other person without Site Operator&apos;s advance
                                written consent. Site Operator may freely assign, transfer or
                                delegate its rights, obligations and liabilities under these Terms
                                to the maximum extent permitted by applicable law.
                            </p>
                            <p className="py-2">
                                <Bold>c. Severability</Bold>
                                <br />
                                In the event that any provision of these Terms, or the application
                                of any such provision to any person or set of circumstances, shall
                                be determined by an arbitrator or court of competent jurisdiction to
                                be invalid, unlawful, void or unenforceable to any extent: (a) the
                                remainder of these Terms, and the application of such provision to
                                persons or circumstances other than those as to which it is
                                determined to be invalid, unlawful, void or unenforceable, shall not
                                be impaired or otherwise affected and shall continue to be valid and
                                enforceable to the fullest extent permitted by law; and (b) Site
                                Operator shall have the right to modify these Terms so as to effect
                                the original intent of the parties as closely as possible in an
                                acceptable manner in order that the transactions contemplated hereby
                                be consumed as originally contemplated to the fullest extent
                                possible.
                            </p>
                            <p className="py-2">
                                <Bold>d. ForceMajeure</Bold>
                                <br />
                                Site Operator shall not incur any liability or penalty for not
                                performing any act or fulfilling any duty or obligation hereunder or
                                in connection with the matters contemplated hereby by reason of any
                                occurrence that is not within its control (including any provision
                                of any present or future law or regulation or any act of any
                                governmental authority, any act of God or war or terrorism, any
                                epidemic or pandemic, or the unavailability, disruption or
                                malfunction of the Internet, the World Wide Web or any other
                                electronic network, the Ethereum Mainnet or altchains or VMEX
                                Protocol or any aspect thereof, or any consensus attack, or hack, or
                                denial-of-service or other attack on the foregoing or any aspect
                                thereof, or on the other software, networks and infrastructure that
                                enables Site Operator to provide the Site), it being understood that
                                Site Operator shall use commercially reasonable efforts, consistent
                                with accepted practices in the industries in which Site Operator
                                operates, as applicable, to resume performance as soon as reasonably
                                practicable under the circumstances.
                            </p>
                            <p className="py-2">
                                <Bold>e. Amendments and Modifications</Bold>
                                <br />
                                These Terms may only be amended, modified, altered or supplemented
                                by or with the written consent of Site Operator. Site Operator
                                reserves, the right, in its sole and absolute discretion, to amend,
                                modify, alter or supplement these Terms from time to time. The most
                                current version of these Terms will be posted on the Site. Any
                                changes or modifications will be effective immediately upon the
                                modified Agreement being posted to the Site. A User shall be
                                responsible for reviewing and becoming familiar with any such
                                modifications.Each User hereby waives any right such User may have
                                to receive specific notice of such changes or modifications. Use of
                                the Site by a User after any modification of these Terms constitutes
                                the User&apos;s acceptance of the modified terms and conditions. If
                                a User does not agree to any such modifications, the User must
                                immediately stop using the Site.
                            </p>
                            <p className="py-2">
                                <Bold>f. No Implied Waivers</Bold>
                                <br />
                                No failure or delay on the part of Site Operator in the exercise of
                                any power, right, privilege or remedy under these Terms shall
                                operate as a waiver of such power, right, privilege or remedy; and
                                no single or partial exercise of any such power, right, privilege or
                                remedy shall preclude any other or further exercise thereof or of
                                any other power, right, privilege or remedy. Site Operator shall not
                                be deemed to have waived any claim arising out of these Terms, or
                                any power, right, privilege or remedy under these Terms, unless the
                                waiver of such claim, power, right, privilege or remedy is expressly
                                set forth in a written instrument duly executed and delivered on
                                behalf of Site Operator, and any such waiver shall not be applicable
                                or have any effect except in the specific instance in which it is
                                given.
                            </p>
                            <p className="py-2">
                                <Bold>g. EntireAgreement</Bold>
                                <br />
                                These Terms constitutes the entire agreement between the parties
                                relating to the subject matter hereof and supersede all prior or
                                contemporaneous agreements and understandings, both written and
                                oral, between the parties with respect to the subject matter hereof.
                            </p>
                            <p className="py-2">
                                <Bold>h. Rules of Interpretation</Bold>
                                <br />
                                <div className="pl-4">
                                    <p className="py-2">
                                        i. “hereof,” “herein,” “hereunder,” “hereby” and words of
                                        similar import will, unless otherwise stated, be construed
                                        to refer to these Terms as a whole and not to any particular
                                        provision of these Terms;
                                    </p>
                                    <p className="py-2">
                                        ii. “include(s)” and “including” shall be construed to be
                                        followed by the words “without limitation”;
                                    </p>
                                    <p className="py-2">
                                        iii. “or” shall be construed to be the “inclusive or” rather
                                        than “exclusive or” unless the context requires otherwise;
                                    </p>
                                    <p className="py-2">
                                        iv. any rule of construction to the effect that ambiguities
                                        are to be resolved against the drafting party shall not be
                                        applied in the construction or interpretation of these
                                        Terms;
                                    </p>
                                    <p className="py-2">
                                        v. section titles, captions and headings are for convenience
                                        of reference only and have no legal or contractual effect;
                                    </p>
                                    <p className="py-2">
                                        vi. whenever the context requires: the singular number shall
                                        include the plural, and vice versa; the masculine gender
                                        shall include the feminine and neuter genders; the feminine
                                        gender shall include the masculine and neuter genders; and
                                        the neuter gender shall include the masculine and feminine
                                        genders; and
                                    </p>
                                    <p className="py-2">
                                        vii. except as otherwise indicated, all references in these
                                        Terms to “Sections,” “clauses,” etc., are intended to refer
                                        to sections, clauses, etc. of these Terms.
                                    </p>
                                </div>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <ModalFooter>
                <Button type="accent" disabled={false} onClick={() => setHasAgreed(true)}>
                    I Agree
                </Button>
            </ModalFooter>
        </>
    );
};
