import { screen } from '@testing-library/react';
import { CompanySMPage } from "../../components/companies/companiesSM/CompanySMPage.js";
import { expect } from "expect"
import { noop, asyncNoop, companyTypesTestList, createCompanyList, axiosNoop } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"


const companyTestList = createCompanyList(5)

describe('Company Page SM', function () {

    it('displays no buttons with permission public', function () {
        render(

            <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                <CompanySMPage
                    search={''} setSearch={noop}
                    filteredCompaniesList={companyTestList}
                    activeCompany={companyTestList[0]}
                    changeActive={asyncNoop}
                    companyTypesList={companyTypesTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    submitChangedCompany={axiosNoop} submitNewCompany={axiosNoop} deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider>
        )

        expect(screen.queryByText('Hinzufügen')).toBeNull()
        expect(screen.queryByText('Löschen')).toBeNull()
        expect(screen.queryByText('Speichern')).toBeNull()
        expect(screen.queryByText('Rückgängig')).toBeNull()
    })

    it('displays all buttons with permission user', function () {
        render(

            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanySMPage
                    search={''} setSearch={noop}
                    filteredCompaniesList={companyTestList}
                    activeCompany={companyTestList[0]}
                    changeActive={asyncNoop}
                    companyTypesList={companyTypesTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    submitChangedCompany={axiosNoop} submitNewCompany={axiosNoop} deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider>
        )

        expect(screen.queryAllByText('Hinzufügen')).toHaveLength(2)
        expect(screen.queryAllByText('Löschen')).toHaveLength(2)
        expect(screen.queryAllByText('Speichern')).toHaveLength(1)
        expect(screen.queryAllByText('Rückgängig')).toHaveLength(1)

    })
})
