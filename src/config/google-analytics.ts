import ReactGA from 'react-ga';

const useAnalyticsEventTracker = (category = 'Overview') => {
    const eventTracker = (action = '', label = '') => {
        ReactGA.event({ category, action, label });
    };
    return eventTracker;
};
export { useAnalyticsEventTracker };
