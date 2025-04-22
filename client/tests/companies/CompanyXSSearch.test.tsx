import { screen } from '@testing-library/react';
import { CompanyXSSearch } from "../../components/companies/companiesXS/CompanyXSSearch.js";
import { expect } from "expect"
import { noop } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { userEvent } from '@testing-library/user-event'
import Sinon from "sinon";

describe('Company XS Search', function () {

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

    it('calls the change callback on input', async function () {
        const user = userEvent.setup()
        const setSearchSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyXSSearch search={''} setSearch={setSearchSpy} />
            </PermissionContext.Provider>
        )

        await user.type(screen.getByPlaceholderText('Suche (Firma, Kürzel)'), 'a')
        expect(setSearchSpy.calledOnce).toBe(true)
    })
})