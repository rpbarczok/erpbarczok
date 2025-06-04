import { CompanyType } from './companyTypes.js'
import { Company } from './companies.js'
import { Field } from './fields.js'
import { AddressType } from './addressTypes.js'
import { Country } from './countries.js'
import { Address } from './addresses.js'

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
    if (fields.length === 0) {
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
    const addressTypes = await AddressType.findAll()
    if (addressTypes.length === 0) {
        await AddressType.bulkCreate([
            {
                name: 'Unternehmensadresse'
            },
            {
                name: 'Lieferadresse'
            },
            {
                name: 'Rechnungsadresse'
            }
        ])
    }
    const countries = await Country.findAll()
    if (countries.length === 0) {
        await Country.bulkCreate([
            {
                name: 'Deutschland',
                abbr: 'DEU',
                isEU: true,
            },
            {
                name: 'Italien',
                abbr: 'ITA',
                isEU: true,
            },
            {
                name: 'Peru',
                abbr: 'PER',
                isEU: false,
            }
        ])
    }
    const companies = await Company.findAll()
    if ( companies.length === 0 ) {
        if (process.env.NODE_ENV !== 'test') {
            const addressesNew = [
                {
                    street: 'Im Schweinestall 1',
                    city: 'Schweinfurt',
                    po: '97421',
                    countryId: 1,
                    addressTypeId: 1
                },
                {
                    street: 'Via Porcile 1',
                    city: 'Vercelli',
                    po: '13100',
                    countryId: 2,
                    addressTypeId: 1
                },
                {
                    street: 'Im Schweinestall 2',
                    city: 'Schweinfurt',
                    po: '97421',
                    countryId: 1,
                    addressTypeId: 1
                },
                {
                    street: 'Am Kontoreck 5',
                    city: 'Hamburg',
                    po: '20106',
                    countryId: 1,
                    addressTypeId: 1
                },
                {
                    street: 'Sul Ghiacciaio',
                    city: 'Bozen',
                    po: '39100',
                    countryId: 2,
                    addressTypeId: 1
                },
                {
                    street: 'La Manucuerna 78a',
                    city: 'Cusco',
                    po: '08211',
                    countryId: 3,
                    addressTypeId: 1
                }
            ]
            const companiesNew = [
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
                    www: 'www.haselnuesse-schnell-da.org',
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
            ]
            for (let i = 0; i < 6; i++) {
                const company = await Company.create(companiesNew[i])
                const address = await Address.create(addressesNew[i])
                await company.addAddress(address)
            }
        }
    }
}
