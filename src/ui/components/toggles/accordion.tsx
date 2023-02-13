import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { ThemeContext } from '../../../store/theme';
import { RiArrowDropDownLine } from 'react-icons/ri';

type IAccordionProps = {
    title: string;
    summary: React.ReactNode;
    details: React.ReactNode;
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

    return (
        <MuiAccordionSummary
            expandIcon={<RiArrowDropDownLine fontSize="30px" color={isDark ? '#f5f5f5' : 'gray'} />}
            {...props}
        />
    );
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

export function DefaultAccordion({ title, summary, details }: IAccordionProps) {
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
                aria-controls={`${title}-content`}
                id={`${title}-header`}
                className={`${
                    isDark
                        ? '!bg-brand-black !text-neutral-200 hover:!bg-neutral-900'
                        : '!bg-neutral-100 hover:!bg-neutral-200'
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