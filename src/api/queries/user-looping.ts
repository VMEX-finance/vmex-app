export function getUserLoopingQuery(user: string): string {
    const queryString = `
        {
            userLoopings(where: {id: "${user.toLowerCase()}"}) {
                id
                depositedAssets
                depositedAmounts
                borrowedAssets
                borrowedAmounts
            }
        }
    `;
    return queryString;
}
