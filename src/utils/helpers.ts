export function truncateAddress(s: string) {
    return `${s.slice(0, 3)}...${s.slice(-4)}`;
}

export const inputMediator = (s: string) => {
    return s.replace(/^0*(?=[1-9])|(^0*(?=0.))/, '');
};

export const determineRatingColor = (s: string) => {
    switch (s.toLowerCase()) {
        case 'a+':
            return '#00DD3E';
        case 'a':
            return '#61DD00';
        case 'a-':
            return '#89DD00';
        case 'b+':
            return '#A4DD00';
        case 'b':
            return '#D9DD00';
        case 'b-':
            return '#DDAC00';
        case 'c+':
            return '#FF7A00';
        case 'c':
            return '#FF1F00';
        case 'd':
            return '';
        case 'f':
            return '';
        default:
            return '';
    }
};
