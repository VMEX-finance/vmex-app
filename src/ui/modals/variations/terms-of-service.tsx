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
            <li key={`tos-${id}-${i}`}>{x}</li>
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
                        <p>
                            These terms and conditions (these <Bold>“Terms”</Bold>) constitute a
                            binding legal agreement between each individual, entity, group or
                            association who views, interacts, links to or otherwise uses or derives
                            any benefit from the Site (as defined below) (<Bold>“Users”</Bold>) and
                            Volatile Labs Ltd., a British Virgin Islands business company (the
                            owner/operator of the Site) (collectively with its successors and
                            assigns, the <Bold>“Site Operator”</Bold>).
                        </p>
                        <p className="font-bold uppercase text-center">Summary</p>
                        <p>Among other things, the Terms and Conditions provide that you must:</p>
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
                        <p>
                            The above is only a partial summary. You should read the{' '}
                            <Bold>Terms and Conditions in their entirety</Bold>. In the event of any
                            conflict or consistency on between this summary and the Terms and
                            Conditions relating to any issue, the Terms and Conditions will be
                            determinative of the issue.
                        </p>
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
