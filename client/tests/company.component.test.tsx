import { PermissionContext } from "utils/permissionContext.js"
import { render } from "./utils/contextWrapper.js"
import { AddCompanyModal } from "components/companies/add.companies.js"
import { expect } from "expect"
import { cleanup, screen } from '@testing-library/react';
import { emptyCompany } from "components/companies/companies.js";
import { noob, companyList, companyTypesList } from "./utils/testdata.js";
import { SMFormCompanies } from "components/companies/sm.form.companies.js";
import { XSFormCompanies } from "components/companies/xs.form.companies.js";
import { XSEditCompanies } from "components/companies/xs.edit.companies.js";

afterEach(cleanup)

describe('Company Form Test', (): void => {
    const inputLabelList = ['Firma', 'Kürzel (max 3 Zeichen)', 'Art der Beziehung zum Unternehmen', 'Homepage']
    const permissionList = [['public'], ['public', 'user'], ['public', 'user', 'admin']]

    describe('Company View All Permissions', (): void => {

        it(`displays correctly the company form, general view small`, async (): Promise<void> => {
            render(

                <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noob }}>
                    <SMFormCompanies
                        search={''} setSearch={noob}
                        filteredCompanies={companyList}
                        activeCompany={companyList[0]}
                        handleChangeActive={noob}
                        companyTypesList={companyTypesList}
                        setIsCompanyChanged={noob}
                        setIsNew={noob}
                        changedCompany={companyList[0]} changedCompanyDispatch={noob}
                    />
                </PermissionContext.Provider>
            )

            expect(screen.getByText('Stammdaten: Kunden, Lieferanten, Spediteure')).not.toBeNull()

            expect(screen.getByLabelText('Suche (Firma, Kürzel)')).not.toBeNull()

            for (const inputLabel of inputLabelList) {
                expect(screen.getByLabelText(inputLabel)).not.toBeNull()
            }
            for (const company of companyList) {
                company.data.abbr
                    ? expect(screen.getByText(company.data.name + ' (' + company.data.abbr + ')')).not.toBeNull()
                    : expect(screen.getByText(company.data.name)).not.toBeNull()
            }
            for (const [key, value] of Object.entries(companyList[0].data)) {
                expect(screen.getByDisplayValue(value)).not.toBeNull
            }
        })

        it(`displays correctly the company form,  general extra small`, async (): Promise<void> => {
            render(

                <PermissionContext.Provider value={{ permissions: ['public'], setPermissions: noob }}>
                    <XSFormCompanies
                        search={''} setSearch={noob}
                        filteredCompanies={companyList}
                        activeCompany={companyList[0]}
                        handleChangeActive={noob}
                        companyTypesList={companyTypesList}
                        setIsCompanyChanged={noob}
                        setIsNew={noob}
                        changedCompany={companyList[0]} changedCompanyDispatch={noob}
                    />
                </PermissionContext.Provider>
            )

            expect(screen.getByText('Stammdaten: Kunden, Lieferanten, Spediteure')).not.toBeNull()
            expect(screen.getByPlaceholderText('Suche (Firma, Kürzel)')).not.toBeNull()
            for (const company of companyList) {
                company.data.abbr
                    ? expect(screen.getByText(company.data.name + ' (' + company.data.abbr + ')')).not.toBeNull()
                    : expect(screen.getByText(company.data.name)).not.toBeNull()
            }
        })

        it(`displays correctly the company edit modal `, async (): Promise<void> => {

            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noob }}>
                    <XSEditCompanies
                        show={true} setShow={noob}
                        companyTypesList={companyTypesList}
                        addEditNote={noob}
                        setIsCompanyChanged={noob}
                        changedCompany={companyList[0]} changedCompanyDispatch={noob}
                        activeCompany={companyList[0]} />
                </PermissionContext.Provider >
            )

            // Assert
            expect(screen.getByText('Unternehmen bearbeiten'))

            for (const inputLabel of inputLabelList) {
                expect(screen.queryByLabelText(inputLabel)).not.toBeNull()
            }

            for (const [key, value] of Object.entries(companyList[0].data)) {
                expect(screen.queryByDisplayValue(value)).not.toBeNull
            }
        })

        it('displays correctly the company add modal', async (): Promise<void> => {

            render(
                <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noob }}>
                    <AddCompanyModal
                        changedCompany={emptyCompany}
                        handleChangeActive={noob}
                        addEditNote={noob}
                        setIsCompanyChanged={noob}
                        setIsNew={noob}
                        show={true}
                        setShow={noob}
                        newCompanyClick={0}
                        changedCompanyDispatch={noob}
                        companyTypesList={companyTypesList} />
                </PermissionContext.Provider>
            )

            // Assert
            expect(screen.getByText('Neues Unternehmen hinzufügen'))


            for (const inputLabel of inputLabelList) {
                expect(screen.getByLabelText(inputLabel)).not.toBeNull()
            }

            expect(screen.getByText('Abbrechen')).not.toBeNull()
            expect(screen.getByText('Speichern')).not.toBeNull()
        })

    })

    for (const permission of permissionList) {

        describe(`display company form, with permission ${permission.join(', ')}`, (): void => {

            it(`displays correctly the buttons on the company form small with permission ${permission.join(', ')}`, async (): Promise<void> => {

                render(

                    <PermissionContext.Provider value={{ permissions: permission, setPermissions: noob }}>
                        <SMFormCompanies
                            search={''} setSearch={noob}
                            filteredCompanies={companyList}
                            activeCompany={companyList[0]}
                            handleChangeActive={noob}
                            companyTypesList={companyTypesList}
                            setIsCompanyChanged={noob}
                            setIsNew={noob}
                            changedCompany={companyList[0]} changedCompanyDispatch={noob}
                        />
                    </PermissionContext.Provider>
                )

                if (permission.length === 1 && !permission.includes('user') && !permission.includes('admin')) {
                    expect(screen.queryByText('Hinzufügen')).toBeNull()
                    expect(screen.queryByText('Löschen')).toBeNull()
                    expect(screen.queryByText('Speichern')).toBeNull()
                    expect(screen.queryByText('Rückgängig')).toBeNull()
                    expect(screen.queryByText('Abbrechen')).toBeNull()

                }

                if (permission.length === 2 && !permission.includes('user')) {
                    expect(screen.queryAllByText('Hinzufügen')).toHaveLength(2)

                    expect(screen.queryAllByText('Löschen')).toHaveLength(2)

                    expect(screen.queryAllByText('Speichern')).toHaveLength(1)

                    expect(screen.queryAllByText('Rückgängig')).toHaveLength(1)

                    expect(screen.queryAllByText('Abbrechen')).toHaveLength(0)
                }
            })

            it(`displays correctly the buttons on the company form extra small with permission ${permission.join(', ')}`, async (): Promise<void> => {

                render(

                    <PermissionContext.Provider value={{ permissions: permission, setPermissions: noob }}>
                        <SMFormCompanies
                            search={''} setSearch={noob}
                            filteredCompanies={companyList}
                            activeCompany={companyList[0]}
                            handleChangeActive={noob}
                            companyTypesList={companyTypesList}
                            setIsCompanyChanged={noob}
                            setIsNew={noob}
                            changedCompany={companyList[0]} changedCompanyDispatch={noob}
                        />
                    </PermissionContext.Provider>
                )

                if (permission.length === 1 && !permission.includes('user') && !permission.includes('admin')) {
                    expect(screen.queryByText('Hinzufügen')).toBeNull()

                }

                if (permission.length === 2 && !permission.includes('user')) {
                    expect(screen.queryAllByText('Hinzufügen')).toHaveLength(1)
                }
            })

            it(`displays correctly the edit modal on the company form with permission ${permission.join(', ')}`, async (): Promise<void> => {

                render(
                    <PermissionContext.Provider value={{ permissions: permission, setPermissions: noob }}>
                        <XSEditCompanies
                            show={true} setShow={noob}
                            companyTypesList={companyTypesList}
                            addEditNote={noob}
                            setIsCompanyChanged={noob}
                            changedCompany={companyList[0]} changedCompanyDispatch={noob}
                            activeCompany={companyList[0]} />
                    </PermissionContext.Provider>
                )

                // Assert
                expect(screen.getByText('Unternehmen bearbeiten'))

                for (const inputLabel of inputLabelList) {
                    expect(screen.queryByLabelText(inputLabel)).not.toBeNull()
                }

                for (const [key, value] of Object.entries(companyList[0].data)) {
                    expect(screen.queryByDisplayValue(value)).not.toBeNull
                }
            })
        })

    }
})















