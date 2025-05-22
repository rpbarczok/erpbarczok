import { screen } from '@testing-library/react';
import { CompanySMEdit } from "../../components/companies/companiesSM/CompanySMEdit.js";
import { expect } from "expect"
import { noop, companyTypesTestList, axiosNoop, createCompanyList } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { userEvent } from '@testing-library/user-event'
import Sinon from "sinon";

const companyTestList = createCompanyList(5)

describe('Company SM Edit', function () {

    it('calls the onClick callback when clicking on "Speichern" button when company is changed', async function () {

        const user = userEvent.setup()
        const submitSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanySMEdit
                    key={companyTestList[0].meta.location}
                    company={companyTestList[0]}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[1]} changedCompanyDispatch={noop}
                    submitChangedCompany={submitSpy}
                />
            </PermissionContext.Provider >
        )

        await user.click(await screen.findByLabelText('Änderung der Firmendaten abspeichern'))
        expect(submitSpy.calledOnce).toBe(true)
    })

    it('does not call the onClick callback when clicking on "Speichern" button when company is not changed', async function () {

        const user = userEvent.setup()
        const submitSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanySMEdit
                    key={companyTestList[0].meta.location}
                    company={companyTestList[0]}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    submitChangedCompany={submitSpy}
                />
            </PermissionContext.Provider >
        )

        await user.click(await screen.findByLabelText('Änderung der Firmendaten abspeichern'))
        expect(submitSpy.calledOnce).toBe(false)
    })

    it('calls correctly the onClick callback when clicking on "Rückgängig" button when company was changed', async function () {

        const user = userEvent.setup()
        const undoSpy = Sinon.spy()

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanySMEdit
                    key={companyTestList[0].meta.location}
                    company={companyTestList[0]}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[1]} changedCompanyDispatch={undoSpy}
                    submitChangedCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(await screen.findByLabelText('Änderung der Firmendaten rückgängig machen'))
        expect(undoSpy.calledOnce).toBe(true)
    })


    it('does not call the onClick callback when clicking on "Rückgängig" button when company was changed', async function () {

        const user = userEvent.setup()
        const undoSpy = Sinon.spy()

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanySMEdit
                    key={companyTestList[0].meta.location}
                    company={companyTestList[0]}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={undoSpy}
                    submitChangedCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(await screen.findByLabelText('Änderung der Firmendaten rückgängig machen'))
        expect(undoSpy.calledOnce).toBe(false)
    })
})