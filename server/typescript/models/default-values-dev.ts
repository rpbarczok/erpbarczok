import { Company } from "./companies.js"

export const setDefaultValuesDev = async () => {
    const companies = await Company.findAll()
    if (companies.length === 0) {
        Company.bulkCreate([
            {
                name: "Hannes Frischling Haselnusspalast",
                abbr: "HFH",
                www: "www.haselnuesse-sind-gesund.org",
                companyTypeId: 1
            },
            {
                name: "Hannes Frischling Haselnüsse",
                abbr: "HFG",
                www: "www.haselnuesse-frisch-vom-baum.org",
                companyTypeId: 2
            },
            {
                name: "Hannes Frischling Transport",
                abbr: "HFT",
                www: "www.haselnuesse-schnell-da-org.org",
                companyTypeId: 3
            }
        ])
    }

}