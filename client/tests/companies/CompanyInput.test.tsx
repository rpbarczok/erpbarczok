import { screen } from '@testing-library/react';
import { expect } from "expect"
import { noop, companyTypesTestList, createCompanyList } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { userEvent } from '@testing-library/user-event'
import { CompanyInput } from "components/companies/CompanyInput.js";
import Sinon from "sinon";


const companyTestList = createCompanyList(5)



describe('Company Input', function () {
    
    const inputLabelList = ['Firma', 'Kürzel (max 3 Zeichen)', 'Art der Beziehung zum Unternehmen', 'Homepage']

    it('displays correctly all labels', function () {
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyInput
                    key={companyTestList[0].meta.location}
                    companyTypesList={companyTypesTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                />
            </PermissionContext.Provider >
        )

        for (const inputLabel of inputLabelList) {
            expect(screen.getByLabelText(inputLabel)).not.toBeNull()
        }

    })

    it('displays correctly all inputs when active company exists', function () {
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyInput
                    key={companyTestList[0].meta.location}
                    companyTypesList={companyTypesTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                />
            </PermissionContext.Provider >
        )
        for (const value of Object.values(companyTestList[0].data)) {
            expect(screen.getByDisplayValue(value as string)).not.toBeNull()
        }
    })

    it('calls change callback when something is typed in with user permission', async function () {
        const user = userEvent.setup()
        const changedCompanyDispatchSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyInput
                    key={companyTestList[0].meta.location}
                    companyTypesList={companyTypesTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={changedCompanyDispatchSpy}
                />
            </PermissionContext.Provider >
        )

        await user.type(screen.getByLabelText('Firma'), 's')

        expect(changedCompanyDispatchSpy.calledOnce).toBe(true)

    })

    it('does not call change callback when something is typed in with guest permission', async function () {
        const user = userEvent.setup()
        const changedCompanyDispatchSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                <CompanyInput
                    key={companyTestList[0].meta.location}
                    companyTypesList={companyTypesTestList}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={changedCompanyDispatchSpy}
                />
            </PermissionContext.Provider >
        )

        await user.type(screen.getByLabelText('Firma'), 's')

        expect(changedCompanyDispatchSpy.calledOnce).toBe(false)

    })

})