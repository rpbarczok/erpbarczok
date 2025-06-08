import { AddCompanyModal } from "../../components/companies/CompanyAddModal.js"
import { screen } from '@testing-library/react';
import { emptyCompany } from "components/companies/CompanyPage.js";
import { expect } from "expect"
import { noop, companyTypesTestList, axiosNoop, defaultCompanyWithMeta } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { userEvent } from "@testing-library/user-event";
import Sinon from "sinon";

const inputLabelList = ['Firma', 'Kürzel (max 3 Zeichen)', 'Art der Beziehung zum Unternehmen', 'Homepage']

describe('Company Add Modal', function () {

    it('displays correctly the title', function () {

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <AddCompanyModal
                    changedCompany={emptyCompany}
                    addEditNote={noop}
                    show={true}
                    setShow={noop}
                    newCompanyClick={0}
                    changedCompanyDispatch={noop}
                    companyTypesList={companyTypesTestList}
                    submitNewCompany={axiosNoop}
                />
            </PermissionContext.Provider>
        )

        // Assert
        expect(screen.getByText('Neues Unternehmen hinzufügen'))
    })

    it('displays correctly the input label', function () {

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <AddCompanyModal
                    changedCompany={emptyCompany}
                    addEditNote={noop}
                    show={true}
                    setShow={noop}
                    newCompanyClick={0}
                    changedCompanyDispatch={noop}
                    companyTypesList={companyTypesTestList}
                    submitNewCompany={axiosNoop}
                />
            </PermissionContext.Provider>
        )

        // Assert
        for (const inputLabel of inputLabelList) {
            expect(screen.getByLabelText(inputLabel)).not.toBeNull()
        }
    })

    it('displays correctly the Buttons', function () {

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <AddCompanyModal
                    changedCompany={emptyCompany}
                    addEditNote={noop}
                    show={true}
                    setShow={noop}
                    newCompanyClick={0}
                    changedCompanyDispatch={noop}
                    companyTypesList={companyTypesTestList}
                    submitNewCompany={axiosNoop}
                />
            </PermissionContext.Provider>
        )

        // Assert

        expect(screen.getByText('Abbrechen')).not.toBeNull()
        expect(screen.getByText('Speichern')).not.toBeNull()
    })


    it('calls the exit callback when clicked on abbrechen', async function () {

        const user = userEvent.setup()
        const setShowSpy = Sinon.spy()

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <AddCompanyModal
                    changedCompany={emptyCompany}
                    addEditNote={noop}
                    show={true}
                    setShow={setShowSpy}
                    newCompanyClick={0}
                    changedCompanyDispatch={noop}
                    companyTypesList={companyTypesTestList}
                    submitNewCompany={axiosNoop}
                />
            </PermissionContext.Provider>
        )

        await user.click(screen.getByText('Abbrechen'))

        expect(setShowSpy.calledOnce).toBe(true)

    })


    it('does not call the save callback when clicked on speichern when not company is entered', async function () {

        const user = userEvent.setup()
        const submitSpy = Sinon.spy()

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <AddCompanyModal
                    changedCompany={emptyCompany}
                    addEditNote={noop}
                    show={true}
                    setShow={noop}
                    newCompanyClick={0}
                    changedCompanyDispatch={noop}
                    companyTypesList={companyTypesTestList}
                    submitNewCompany={submitSpy}
                />
            </PermissionContext.Provider>
        )

        await user.click(screen.getByText('Speichern'))

        expect(submitSpy.calledOnce).toBe(false)
    })

    it('calls the save callback when clicked on speichern when new company is entered', async function () {

        const user = userEvent.setup()
        const submitSpy = Sinon.spy()

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <AddCompanyModal
                    changedCompany={defaultCompanyWithMeta}
                    addEditNote={noop}
                    show={true}
                    setShow={noop}
                    newCompanyClick={0}
                    changedCompanyDispatch={noop}
                    companyTypesList={companyTypesTestList}
                    submitNewCompany={submitSpy}
                />
            </PermissionContext.Provider>
        )

        await user.click(screen.getByText('Speichern'))

        expect(submitSpy.calledOnce).toBe(true)
    })

})