import { screen } from '@testing-library/react';
import { CompaniesXSList } from "../../components/companies/companiesXS/CompaniesXSList.js";
import { expect } from "expect"
import { noop, asyncNoop, companyTypesTestList, createCompanyList, axiosNoop } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { userEvent } from '@testing-library/user-event'
import Sinon from "sinon";


const companyTestList = createCompanyList(5)

describe('company list XS', function () {
    it('displays correctly the test list', function () {
        render(
            <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                <CompaniesXSList
                    filteredCompaniesList={companyTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    changeActive={asyncNoop} activeCompany={companyTestList[0]}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        for (const company of companyTestList) {
            if (company.data.abbr) {
                expect(screen.getByText(company.data.name + ' (' + company.data.abbr + ')')).not.toBeNull()
            } else {
                expect(screen.getByText(company.data.name)).not.toBeNull()
            }
        }
    })

    it('displays correctly the empty list', function () {
        render(
            <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                <CompaniesXSList
                    filteredCompaniesList={companyTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    changeActive={asyncNoop} activeCompany={companyTestList[0]}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        expect(screen.findByText('Keine Unternehmen gefunden')).not.toBeNull()

    })

    it('calls callback function on click on list item', async function () {
        const user = userEvent.setup()
        const changeActiveSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                <CompaniesXSList
                    filteredCompaniesList={companyTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    changeActive={changeActiveSpy} activeCompany={companyTestList[0]}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(screen.getByText(companyTestList[2].data.name, { exact: false }))
        expect(changeActiveSpy.calledOnce).toBe(true)
    })
})