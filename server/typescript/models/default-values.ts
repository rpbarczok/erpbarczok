import { CompanyType } from './companyTypes.js'
import { Company } from './companies.js'
import { Field } from './fields.js'

export const setDefaultValues = async () => {
    const companyTypes = await CompanyType.findAll()
    if (companyTypes.length === 0) {
        await CompanyType.bulkCreate([
            {
                name: 'Kunde'
            },
            {
                name: 'Lieferant'
            },
            {
                name: 'Spediteur'
            },
            {
                name: 'Sonstige'
            }
        ])
    }
    const fields = await Field.findAll()
    if (fields.length===0) {
        await Field.bulkCreate([
            {
                name: 'Lebensmittel'
            },
            {
                name: 'Automobile'
            },
            {
                name: 'Recht'
            }
        ])
    }
    if (process.env.NODE_ENV !== 'test') {
        const companies = await Company.findAll()
        if (companies.length === 0) {
            await Company.bulkCreate([
                {
                    name: 'Hannes Frischling Haselnusspalast',
                    abbr: 'HFH',
                    www: 'www.haselnuesse-sind-gesund.org',
                    companyTypeId: 1
                },
                {
                    name: 'Hannes Frischling Haselnüsse',
                    abbr: 'HFG',
                    www: 'www.haselnuesse-frisch-vom-baum.org',
                    companyTypeId: 2
                },
                {
                    name: 'Hannes Frischling Transport',
                    abbr: 'HFT',
                    www: 'www.haselnuesse-schnell-da-org.org',
                    companyTypeId: 3
                },
                {
                    name: 'Emils Kreuzfahrten',
                    abbr: 'EKF',
                    www: 'www.piratenleben.org',
                    companyTypeId: 1
                },
                {
                    name: 'Schienentransport Mammut',
                    abbr: 'STM',
                    www: 'www.alpenroute.org',
                    companyTypeId: 3
                },
                {
                    name: 'Pedro Lamas Erdnussfarm',
                    abbr: 'PEF',
                    www: 'www.erdnussbaeume.org',
                    companyTypeId: 2
                }
            ])
        }
    }

}
