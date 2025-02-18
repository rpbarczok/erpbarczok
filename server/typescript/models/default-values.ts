import { Companytype } from "./companytypes.js"

export const setDefaultValues = () => {
    Companytype.bulkCreate([
        {
            name: "Kunde"
        },
        {
            name: "Lieferant"
        },
        {
            name: "Spediteur"
        },
        {
            name: "Sonstige"
        }
    ])
}
