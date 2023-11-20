import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ThemeContext } from '@/store';
import { RiArrowDropDownLine } from 'react-icons/ri';

type IAccordionProps = {
    title: string;
    summary: React.ReactNode;
    details: React.ReactNode;
    noIcon?: boolean;
    className?: string;
    customHover?: string;
    wrapperClass?: string;
    detailsClass?: string;
    disabled?: boolean;
};

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&:before': {
        display: 'none',
    },
    '& .MuiButtonBase-root': {
        padding: '0 16px 0 0',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => {
    const { isDark } = React.useContext(ThemeContext);

    return <MuiAccordionSummary {...props} style={{ opacity: '100' }} />;
})(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(-90deg)',
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(0deg)',
    },
    '& .MuiAccordionSummary-content': {
        margin: '0',
        padding: '0.5rem 0',
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export function DefaultAccordion({
    title,
    summary,
    details,
    noIcon,
    className,
    customHover,
    wrapperClass,
    detailsClass,
    disabled,
}: IAccordionProps) {
    const [expanded, setExpanded] = React.useState<string | false>('');
    const { isDark } = React.useContext(ThemeContext);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <Accordion
            expanded={expanded === title}
            onChange={handleChange(title)}
            className={`${wrapperClass || ''} !shadow-none border-t ${
                isDark ? 'border-neutral-800' : 'border-neutral-300'
            }`}
            disableGutters
        >
            <AccordionSummary
                expandIcon={
                    noIcon ? (
                        <></>
                    ) : (
                        <RiArrowDropDownLine fontSize="20px" color={isDark ? '#f5f5f5' : 'gray'} />
                    )
                }
                disabled={disabled}
                aria-controls={`${title}-content`}
                id={`${title}-header`}
                className={`${className || ''} !min-h-0 !h-auto !py-0 ${
                    isDark
                        ? `!bg-brand-black !text-neutral-200 ${
                              customHover ? customHover : 'hover:!bg-neutral-900'
                          }`
                        : `!bg-neutral-100 ${customHover ? customHover : 'hover:!bg-neutral-200'}`
                }`}
            >
                {summary}
            </AccordionSummary>
            <AccordionDetails
                className={`${detailsClass || ''} ${
                    isDark ? '!bg-brand-black !text-neutral-200' : '!bg-neutral-100'
                }`}
            >
                {details}
            </AccordionDetails>
        </Accordion>
    );
}
