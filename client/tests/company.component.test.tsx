import { AddCompanyModal } from "../components/companies/CompanyAdd.js"
import { screen } from '@testing-library/react';
import { CompaniesSMList } from "../components/companies/companiesSM/CompaniesSMList.js";
import { CompaniesXSList } from "../components/companies/companiesXS/CompaniesXSList.js";
import { CompanySMEdit } from "../components/companies/companiesSM/CompanySMEdit.js";
import { CompanySMPage } from "../components/companies/companiesSM/CompanySMPage.js";
import { CompanySMSearch } from "../components/companies/companiesSM/CompanySMSearch.js";
import { CompanyXSEdit } from "../components/companies/companiesXS/CompanyXSEdit.js";
import { CompanyXSPage } from "../components/companies/companiesXS/CompanyXSPage.js";
import { CompanyXSSearch } from "../components/companies/companiesXS/CompanyXSSearch.js";
import { emptyCompany } from "components/companies/CompanyPageBasis.js";
import { expect } from "expect"
import { noop, asyncNoop,  companyTypesTestList, emptyList, createCompanyList } from "./utils/testdata.js";
import { PermissionContext } from "../utils/permissionContext.js"
import { render } from "./utils/contextWrapper.js"
import {userEvent} from '@testing-library/user-event'

const companyTestList = createCompanyList(5)

describe('Company Page Test', function () {

    const inputLabelList = ['Firma', 'Kürzel (max 3 Zeichen)', 'Art der Beziehung zum Unternehmen', 'Homepage']
    

    describe('Company Edit', function () {
        describe('company edit modal SM', function () {

            it('displays correctly all labels', function () {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanySMEdit
                            key={companyTestList[0].meta.location}
                            company={companyTestList[0]}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
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
                        <CompanySMEdit
                            key={companyTestList[0].meta.location}
                            company={companyTestList[0]}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider >
                )

                for (const value of Object.values(companyTestList[0].data)) {
                    expect(screen.getByDisplayValue(value as string)).not.toBeNull()
                }

            })

            it('calls correctly the onClick callback when clicking on "Speichern" button', async function() {

                const user = userEvent.setup()
                
                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanySMEdit
                            key={companyTestList[0].meta.location}
                            company={companyTestList[0]}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider >
                )

                await user.click(await screen.findByLabelText('Änderung der Firmendaten abspeichern'))
            })

            it('calls correctly the onClick callback when clicking on "Rückgängig" button', async function() {
                
                const user = userEvent.setup()

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanySMEdit
                            key={companyTestList[0].meta.location}
                            company={companyTestList[0]}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider >
                )

                await user.click(await screen.findByLabelText('Änderung der Firmendaten rückgängig machen'))
            })
        })

        describe('company edit modal XS', function () {
            it('displays correctly the title of the company edit modal ', function () {

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTypesTestList}
                            addEditNote={noop}
                            setIsCompanyChanged={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            activeCompany={companyTestList[0]}
                        />
                    </PermissionContext.Provider >
                )

                // Assert
                expect(screen.getByText('Unternehmen bearbeiten'))
            })

            it('displays correctly the labels of the company edit modal', function () {

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTypesTestList}
                            addEditNote={noop}
                            setIsCompanyChanged={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            activeCompany={companyTestList[0]}
                        />
                    </PermissionContext.Provider >
                )

                // Assert
                for (const inputLabel of inputLabelList) {
                    expect(screen.queryByLabelText(inputLabel)).not.toBeNull()
                }
            })

            it('displays correctly input values of the company edit modal', function () {

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTypesTestList}
                            addEditNote={noop}
                            setIsCompanyChanged={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            activeCompany={companyTestList[0]}
                        />
                    </PermissionContext.Provider >
                )

                // Assert
                for (const value of Object.values(companyTestList[0].data)) {
                    expect(screen.queryByDisplayValue(value as string)).not.toBeNull()
                }
            })

            it('displays only "Schließen" with permission public', function () {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTypesTestList}
                            addEditNote={noop}
                            setIsCompanyChanged={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            activeCompany={companyTestList[0]}
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
                            setIsCompanyChanged={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            activeCompany={companyTestList[0]}
                        />
                    </PermissionContext.Provider >
                )

                expect(screen.queryByText('Abbrechen')).not.toBeNull()
                expect(screen.queryByText('Rückgängig')).not.toBeNull()
                expect(screen.queryByText('Löschen')).not.toBeNull()
                expect(screen.queryByText('Speichern')).not.toBeNull()
            })
        })
    })

    describe('Company List', function () {
        describe('Company List SM', function () {
            it('displays correctly the test list', function () {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompaniesSMList
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]} changeActive={asyncNoop}
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
                        <CompaniesSMList
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]} changeActive={asyncNoop}
                        />
                    </PermissionContext.Provider >
                )

                expect(screen.findByText('Keine Unternehmen gefunden')).not.toBeNull()

            })
        })

        describe('company list XS', function () {
            it('displays correctly the test list', function () {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompaniesXSList
                            filteredCompanies={companyTestList}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            changeActive={asyncNoop} activeCompany={companyTestList[0]}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
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
                            filteredCompanies={emptyList}
                            changedCompany={emptyCompany} changedCompanyDispatch={noop}
                            changeActive={asyncNoop} activeCompany={emptyCompany}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                        />
                    </PermissionContext.Provider >
                )

                expect(screen.findByText('Keine Unternehmen gefunden')).not.toBeNull()

            })
        })
    })

    describe('Company Search', function () {
        it('displays correctly the search input SM', function () {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <CompanySMSearch search={'test'} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByLabelText('Suche (Firma, Kürzel)')).not.toBeNull()
            expect(screen.getByDisplayValue('test')).not.toBeNull()
        })

        it('displays correctly the search input XS', function () {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <CompanyXSSearch search={'test'} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByDisplayValue('test')).not.toBeNull()
        })

        it('displays correctly the placeholder', function () {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <CompanyXSSearch search={''} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByPlaceholderText('Suche (Firma, Kürzel)')).not.toBeNull()
        })
    })

    describe('Company Add Modal', function () {

        it('displays correctly the title', function () {

            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <AddCompanyModal
                        changedCompany={emptyCompany}
                        changeActive={noop}
                        addEditNote={noop}
                        setIsCompanyChanged={noop}
                        setIsNew={noop}
                        show={true}
                        setShow={noop}
                        newCompanyClick={0}
                        changedCompanyDispatch={noop}
                        companyTypesList={companyTypesTestList} />
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
                        changeActive={noop}
                        addEditNote={noop}
                        setIsCompanyChanged={noop}
                        setIsNew={noop}
                        show={true}
                        setShow={noop}
                        newCompanyClick={0}
                        changedCompanyDispatch={noop}
                        companyTypesList={companyTypesTestList} />
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
                        changeActive={noop}
                        addEditNote={noop}
                        setIsCompanyChanged={noop}
                        setIsNew={noop}
                        show={true}
                        setShow={noop}
                        newCompanyClick={0}
                        changedCompanyDispatch={noop}
                        companyTypesList={companyTypesTestList} />
                </PermissionContext.Provider>
            )

            // Assert

            expect(screen.getByText('Abbrechen')).not.toBeNull()
            expect(screen.getByText('Speichern')).not.toBeNull()
        })
    })

    describe('Company Page Buttons', function () {
        describe('Company Page Buttons SM', function () {
            it('displays no buttons with permission public', function () {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompanySMPage
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={noop}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            setIsNew={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
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
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={noop}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            setIsNew={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider>
                )

                expect(screen.queryAllByText('Hinzufügen')).toHaveLength(2)
                expect(screen.queryAllByText('Löschen')).toHaveLength(2)
                expect(screen.queryAllByText('Speichern')).toHaveLength(1)
                expect(screen.queryAllByText('Rückgängig')).toHaveLength(1)

            })
        })

        describe('Company Page Buttons XS', function () {
            it('displays no buttons with permission public', function () {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompanyXSPage
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={asyncNoop}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            setIsNew={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
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
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={asyncNoop}
                            companyTypesList={companyTypesTestList}
                            setIsCompanyChanged={noop}
                            setIsNew={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider>
                )

                expect(screen.queryAllByText('Hinzufügen')).toHaveLength(1)
            })
        })

    })

})