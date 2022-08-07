import React from "react";

type Tranch = [string, unknown][];

function useLoanAssetForm(availableTranches: any) {
    const [tranches, updateTranches] = React.useState<[string, unknown][]>([]);
    React.useEffect(() => {
        let tranches = Object.entries(availableTranches)
        updateTranches(tranches)
    }, [])


    return tranches
}
export {

}