import { screen } from '@testing-library/react';
import { CompanyXSPage } from "../../components/companies/companiesXS/CompanyXSPage.js";
import { expect } from "expect"
import { noop, asyncNoop, companyTypesTestList, createCompanyList, axiosNoop } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"


const companyTestList = createCompanyList(5)

describe('Company Page Test', function () {


    describe('Company Page XS', function () {
        it('displays no buttons with permission public', function () {
            render(

                <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                    <CompanyXSPage
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
        })

        it('displays all buttons with permission user', function () {
            render(

                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <CompanyXSPage
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

            expect(screen.queryAllByText('Hinzufügen')).toHaveLength(1)
        })
    })

})