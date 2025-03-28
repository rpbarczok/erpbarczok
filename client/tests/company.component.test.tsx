import { PermissionContext } from "../utils/permissionContext.js"
import { render } from "./utils/contextWrapper.js"
import { AddCompanyModal } from "../components/companies/add.companies.js"
import { expect } from "expect"
import { cleanup, screen } from '@testing-library/react';
import { emptyCompany } from "components/companies/companies.js";
import { noop, asyncNoop, companyTestList, companyTestTypesList, emptyList } from "./utils/testdata.js";
import { SMFormCompanies } from "../components/companies/sm.form.companies.js";
import { XSFormCompanies } from "../components/companies/xs.form.companies.js";
import { XSEditCompanies } from "../components/companies/xs.edit.companies.js";
import { SMEditCompanies } from "../components/companies/sm.edit.companies.js";
import { XSListCompanies } from "../components/companies/xs.list.companies.js";
import { SMListCompanies } from "../components/companies/sm.list.companies.js";
import { SMSearchCompanies } from "../components/companies/sm.search.companies.js";
import { XSSearchCompanies } from "../components/companies/xs.search.companies.js";

afterEach(cleanup)

describe('Company Form Test', (): void => {
    const inputLabelList = ['Firma', 'Kürzel (max 3 Zeichen)', 'Art der Beziehung zum Unternehmen', 'Homepage']
    const permissionList = [['public'], ['public', 'user'], ['public', 'user', 'admin']]

    describe('Company Edit', (): void => {
        describe('company edit modal SM', (): void => {

            
            it('displays correctly all labels', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <SMEditCompanies
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
                        <SMEditCompanies
                            key={companyTestList[0].meta.location}
                            company={companyTestList[0]}
                            companyTypesList={companyTestTypesList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider >
                )

                for (const [key, value] of Object.entries(companyTestList[0].data)) {
                    expect(screen.getByDisplayValue(value)).not.toBeNull
                }

            })
        })

        describe('company edit modal XS', (): void => {
            it('displays correctly the title of the company edit modal ', (): void => {

                render(
                    <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                        <XSEditCompanies
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
                        <XSEditCompanies
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
                        <XSEditCompanies
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
                for (const [key, value] of Object.entries(companyTestList[0].data)) {
                    expect(screen.queryByDisplayValue(value)).not.toBeNull
                }
            })

            it('displays only "Schließen" with permission public', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <XSEditCompanies
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

                expect(screen.queryByText('Schließen')).not.toBeNull
            })

            it('displays all buttons with permission public user', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <XSEditCompanies
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

                expect(screen.queryByText('Abbrechen')).not.toBeNull
                expect(screen.queryByText('Rückgängig')).not.toBeNull
                expect(screen.queryByText('Löschen')).not.toBeNull
                expect(screen.queryByText('Speichern')).not.toBeNull
            })
        })
    })

    describe('Company List', (): void => {
        describe('Company List SM', (): void => {
            it('displays correctly the test list', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <SMListCompanies
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]} handleChangeActive={asyncNoop}
                        />
                    </PermissionContext.Provider >
                )

                for (const company of companyTestList) {
                    company.data.abbr
                        ? expect(screen.getByText(company.data.name + ' (' + company.data.abbr + ')')).not.toBeNull()
                        : expect(screen.getByText(company.data.name)).not.toBeNull()
                }

            })

            it('displays correctly the empty list', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <SMListCompanies
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]} handleChangeActive={asyncNoop}
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
                        <XSListCompanies
                            filteredCompanies={companyTestList}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                            handleChangeActive={asyncNoop} activeCompany={companyTestList[0]}
                            companyTypesList={companyTestTypesList}
                            setIsCompanyChanged={noop}
                            addEditNote={noop}
                        />
                    </PermissionContext.Provider >
                )

                for (const company of companyTestList) {
                    company.data.abbr
                        ? expect(screen.getByText(company.data.name + ' (' + company.data.abbr + ')')).not.toBeNull()
                        : expect(screen.getByText(company.data.name)).not.toBeNull()
                }

            })

            it('displays correctly the empty list', (): void => {
                render(
                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <XSListCompanies
                            filteredCompanies={emptyList}
                            changedCompany={emptyCompany} changedCompanyDispatch={noop}
                            handleChangeActive={asyncNoop} activeCompany={emptyCompany}
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
                    <SMSearchCompanies search={'test'} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByLabelText('Suche (Firma, Kürzel)')).not.toBeNull()
            expect(screen.getByDisplayValue('test')).not.toBeNull()
        })

        it('displays correctly the search input XS', (): void => {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <XSSearchCompanies search={'test'} setSearch={noop} />
                </PermissionContext.Provider>
            )

            expect(screen.getByDisplayValue('test')).not.toBeNull()
        })

        it('displays correctly the placeholder', (): void => {
            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <XSSearchCompanies search={''} setSearch={noop} />
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
                        handleChangeActive={noop}
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
                        handleChangeActive={noop}
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
                        handleChangeActive={noop}
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

    describe('Company Form Buttons', (): void => {
        describe('Company Form Buttons SM', (): void => {
            it('displays no buttons with permission public', (): void => {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <SMFormCompanies
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            handleChangeActive={noop}
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
                        <SMFormCompanies
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            handleChangeActive={noop}
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

        describe('Company Form Buttons XS', (): void => {
            it('displays no buttons with permission public', (): void => {
                render(

                    <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noop }}>
                        <XSFormCompanies
                            search={''} setSearch={noop}
                            filteredCompanies={companyTestList}
                            activeCompany={companyTestList[0]}
                            handleChangeActive={asyncNoop}
                            companyTypesList={companyTestTypesList}
                            setIsCompanyChanged={noop}
                            setIsNew={noop}
                            changedCompany={companyTestList[0]} changedCompanyDispatch={noop}
                        />
                    </PermissionContext.Provider>
                )

                expect(screen.queryByText('Hinzufügen')).toBeNull()
            })
        })

        it('displays all buttons with permission user', (): void => {
            render(

                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                    <XSFormCompanies
                        search={''} setSearch={noop}
                        filteredCompanies={companyTestList}
                        activeCompany={companyTestList[0]}
                        handleChangeActive={asyncNoop}
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