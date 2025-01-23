import { Companytype } from "./companytypes.js"

const setDefaultValues = () => {
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

export default setDefaultValues
