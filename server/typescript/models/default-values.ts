import { Company } from "./companies.js"
import { CompanyType } from "./companyTypes.js"
import { setDefaultValuesDev } from "./default-values-dev.js"
import { Field } from "./fields.js"

export const setDefaultValues = async () => {
    const companyTypes = await CompanyType.findAll()
    if (companyTypes.length === 0) {
        CompanyType.bulkCreate([
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
    const fields = await Field.findAll()
    if (fields.length===0) {
        Field.bulkCreate([
            {
                name: "Lebensmittel"
            },
            {
                name: "Automobile"
            },
            {
                name: "Recht"
            }
        ])
    }
    if (process.env.NODE_ENV === "development") {
        await setDefaultValuesDev()
    }
}
