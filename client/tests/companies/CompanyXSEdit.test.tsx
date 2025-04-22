import { screen } from '@testing-library/react';
import { CompanyXSEdit } from "../../components/companies/companiesXS/CompanyXSEdit.js";
import { expect } from "expect"
import { noop, companyTypesTestList, createCompanyList, axiosNoop } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { userEvent } from '@testing-library/user-event'
import Sinon from "sinon";


const companyTestList = createCompanyList(5)

describe('company edit modal XS', function () {
    it('displays correctly the title of the company edit modal ', function () {

        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        // Assert
        expect(screen.getByText('Unternehmen bearbeiten'))
    })

    it('displays only "Schließen" with permission public', function () {
        render(
            <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        expect(screen.queryByText('Schließen')).not.toBeNull()
    })

    it('displays all buttons with permission public user', function () {
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        expect(screen.queryByText('Abbrechen')).not.toBeNull()
        expect(screen.queryByText('Rückgängig')).not.toBeNull()
        expect(screen.queryByText('Löschen')).not.toBeNull()
        expect(screen.queryByText('Speichern')).not.toBeNull()
    })

    it('calls the speichern callback when speichern is clicked when the company was changed', async function () {
        const user = userEvent.setup()
        const submitChangedCompanySpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[1]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={submitChangedCompanySpy}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(screen.getByText('Speichern'))
        expect(submitChangedCompanySpy.calledOnce).toBe(true)
    })

    it('calls not the speichern callback when speichern is clicked when the company was not changed', async function () {
        const user = userEvent.setup()
        const submitChangedCompanySpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={submitChangedCompanySpy}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(screen.getByText('Speichern'))
        expect(submitChangedCompanySpy.calledOnce).toBe(false)
    })

    it('calls the speichern callback when rückgängig is clicked when the company was changed', async function () {
        const user = userEvent.setup()
        const changedCompanySpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[1]} changedCompanyDispatch={changedCompanySpy}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(screen.getByText('Rückgängig'))
        expect(changedCompanySpy.calledOnce).toBe(true)
    })

    it('calls not the speichern callback when rückgängig is clicked when the company was not changed', async function () {
        const user = userEvent.setup()
        const changedCompanySpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={changedCompanySpy}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(screen.getByText('Rückgängig'))
        expect(changedCompanySpy.calledOnce).toBe(false)
    })

    it('calls the delete callback when löschen is clicked', async function () {
        const user = userEvent.setup()
        const deleteSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={noop}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={deleteSpy}
                />
            </PermissionContext.Provider >
        )

        await user.click(screen.getByText('Löschen'))
        expect(deleteSpy.calledOnce).toBe(true)
    })

    it('calls the close callback when abbrechen is clicked', async function () {
        const user = userEvent.setup()
        const closeSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSEdit
                    key={companyTestList[0].meta.location}
                    show={true} setShow={closeSpy}
                    companyTypesList={companyTypesTestList}
                    addEditNote={noop}
                    changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                    activeCompany={companyTestList[0]}
                    submitChangedCompany={axiosNoop}
                    deleteCompany={axiosNoop}
                />
            </PermissionContext.Provider >
        )

        await user.click(screen.getByText('Abbrechen'))
        expect(closeSpy.calledOnce).toBe(true)
    })
})