import { AddCompanyModal } from "../components/companies/CompanyAdd.js"
import { cleanup, screen } from '@testing-library/react';
import { CompaniesSMList } from "../components/companies/CompaniesSMList.js";
import { CompaniesXSList } from "../components/companies/CompaniesXSList.js";
import { CompanySMEdit } from "../components/companies/CompanySMEdit.js";
import { CompanySMPage } from "../components/companies/CompanySMPage.js";
import { CompanySMSearch } from "../components/companies/CompanySMSearch.js";
import { CompanyXSEdit } from "../components/companies/CompanyXSEdit.js";
import { CompanyXSPage } from "../components/companies/CompanyXSPage.js";
import { CompanyXSSearch } from "../components/companies/CompanyXSSearch.js";
import { emptyCompany } from "components/companies/CompanyPageBasis.js";
import { expect } from "expect"
import { noop, asyncNoop, companyTestList, companyTestTypesList, emptyList } from "./utils/testdata.js";
import { PermissionContext } from "../utils/permissionContext.js"
import { render } from "./utils/contextWrapper.js"

afterEach(cleanup)

describe('Company Page Test', (): void => {
    const inputLabelList = ['Firma', 'Kürzel (max 3 Zeichen)', 'Art der Beziehung zum Unternehmen', 'Homepage']

    describe('Company Edit', (): void => {
        describe('company edit modal SM', (): void => {

            it('displays correctly all labels', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanySMEdit
                            key={companyTestList[0].meta.location}
                            company={companyTestList[0]}
                            companyTypesList={companyTestTypesList}
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

            it('displays correctly all inputs when active company exists', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanySMEdit
                            key={companyTestList[0].meta.location}
                            company={companyTestList[0]}
                            companyTypesList={companyTestTypesList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider >
                )

                for (const value of Object.values(companyTestList[0].data)) {
                    expect(screen.getByDisplayValue(value)).not.toBeNull()
                }

            })
        })

        describe('company edit modal XS', (): void => {
            it('displays correctly the title of the company edit modal ', (): void => {

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTestTypesList}
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

            it('displays correctly the labels of the company edit modal', (): void => {

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTestTypesList}
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

            it('displays correctly input values of the company edit modal', (): void => {

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTestTypesList}
                            addEditNote={noop}
                            setIsCompanyChanged={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            activeCompany={companyTestList[0]}
                        />
                    </PermissionContext.Provider >
                )

                // Assert
                for (const value of Object.values(companyTestList[0].data)) {
                    expect(screen.queryByDisplayValue(value)).not.toBeNull()
                }
            })

            it('displays only "Schließen" with permission public', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTestTypesList}
                            addEditNote={noop}
                            setIsCompanyChanged={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            activeCompany={companyTestList[0]}
                        />
                    </PermissionContext.Provider >
                )

                expect(screen.queryByText('Schließen')).not.toBeNull()
            })

            it('displays all buttons with permission public user', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSEdit
                            key={companyTestList[0].meta.location}
                            show={true} setShow={noop}
                            companyTypesList={companyTestTypesList}
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

    describe('Company List', (): void => {
        describe('Company List SM', (): void => {
            it('displays correctly the test list', (): void => {
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

            it('displays correctly the empty list', (): void => {
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

        describe('company list XS', (): void => {
            it('displays correctly the test list', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompaniesXSList
                            filteredCompanies={companyTestList}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            changeActive={asyncNoop} activeCompany={companyTestList[0]}
                            companyTypesList={companyTestTypesList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                        />
                    </PermissionContext.Provider >
                )

                for (const company of companyTestList) {
                    if(company.data.abbr)  {
                        expect(screen.getByText(company.data.name + ' (' + company.data.abbr + ')')).not.toBeNull()
                     } else {
                        expect(screen.getByText(company.data.name)).not.toBeNull()}
                     } 
            })

            it('displays correctly the empty list', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompaniesXSList
                            filteredCompanies={emptyList}
                            changedCompany={emptyCompany} changedCompanyDispatch={noop}
                            changeActive={asyncNoop} activeCompany={emptyCompany}
                            companyTypesList={companyTestTypesList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                        />
                    </PermissionContext.Provider >
                )

                expect(screen.findByText('Keine Unternehmen gefunden')).not.toBeNull()

            })
        })
    })

    describe('Company Search', (): void => {
        it('displays correctly the search input SM', (): void => {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <CompanySMSearch search={'test'} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByLabelText('Suche (Firma, Kürzel)')).not.toBeNull()
            expect(screen.getByDisplayValue('test')).not.toBeNull()
        })

        it('displays correctly the search input XS', (): void => {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <CompanyXSSearch search={'test'} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByDisplayValue('test')).not.toBeNull()
        })

        it('displays correctly the placeholder', (): void => {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <CompanyXSSearch search={''} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByPlaceholderText('Suche (Firma, Kürzel)')).not.toBeNull()
        })
    })

    describe('Company Add Modal', (): void => {

        it('displays correctly the title', async (): Promise<void> => {

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
                        companyTypesList={companyTestTypesList} />
                </PermissionContext.Provider>
            )

            // Assert
            expect(screen.getByText('Neues Unternehmen hinzufügen'))
        })

        it('displays correctly the input label', async (): Promise<void> => {

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
                        companyTypesList={companyTestTypesList} />
                </PermissionContext.Provider>
            )

            // Assert
            for (const inputLabel of inputLabelList) {
                expect(screen.getByLabelText(inputLabel)).not.toBeNull()
            }
        })

        it('displays correctly the Buttons', async (): Promise<void> => {

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
                        companyTypesList={companyTestTypesList} />
                </PermissionContext.Provider>
            )

            // Assert

            expect(screen.getByText('Abbrechen')).not.toBeNull()
            expect(screen.getByText('Speichern')).not.toBeNull()
        })
    })

    describe('Company Page Buttons', (): void => {
        describe('Company Page Buttons SM', (): void => {
            it('displays no buttons with permission public', (): void => {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompanySMPage
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={noop}
                            companyTypesList={companyTestTypesList}
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

            it('displays all buttons with permission user', (): void => {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanySMPage
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={noop}
                            companyTypesList={companyTestTypesList}
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

        describe('Company Page Buttons XS', (): void => {
            it('displays no buttons with permission public', (): void => {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <CompanyXSPage
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={asyncNoop}
                            companyTypesList={companyTestTypesList}
                            setIsCompanyChanged={noop}
                            setIsNew={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider>
                )

                expect(screen.queryByText('Hinzufügen')).toBeNull()
            })

            it('displays all buttons with permission user', (): void => {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <CompanyXSPage
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            changeActive={asyncNoop}
                            companyTypesList={companyTestTypesList}
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