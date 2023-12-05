export function getUserLoopingQuery(user?: string): string {
    const buildParams = () => {
        if (user) return `(where: {id: "${user?.toLowerCase()}"})`;
        return '';
    };
    return `
        {
            userLoopings ${buildParams()} {
                id
                depositedAssets
                depositedAmounts
                borrowedAssets
                borrowedAmounts
            }
        }
    `;
}
