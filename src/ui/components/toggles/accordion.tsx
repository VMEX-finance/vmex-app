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
};

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => {
    const { isDark } = React.useContext(ThemeContext);

    return <MuiAccordionSummary {...props} />;
})(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper': {
        transform: 'rotate(-90deg)',
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(0deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
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
            className={`border-t ${isDark ? 'border-neutral-800' : 'border-neutral-300'}`}
        >
            <AccordionSummary
                expandIcon={
                    noIcon ? (
                        <></>
                    ) : (
                        <RiArrowDropDownLine fontSize="30px" color={isDark ? '#f5f5f5' : 'gray'} />
                    )
                }
                aria-controls={`${title}-content`}
                id={`${title}-header`}
                className={`${className || ''} ${
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
                className={isDark ? '!bg-brand-black !text-neutral-200' : '!bg-neutral-100'}
            >
                {details}
            </AccordionDetails>
        </Accordion>
    );
}
