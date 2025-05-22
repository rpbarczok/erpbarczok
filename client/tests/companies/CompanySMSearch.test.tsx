import { screen } from '@testing-library/react';
import { CompanySMSearch } from "../../components/companies/companiesSM/CompanySMSearch.js";
import { expect } from "expect"
import { noop } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { userEvent } from '@testing-library/user-event'
import Sinon from "sinon";

describe('Company Search SM', function () {
    it('displays correctly the search input SM', function () {
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanySMSearch search={'test'} setSearch={noop} />
            </PermissionContext.Provider>
        )

        expect(screen.getByLabelText('Suche (Firma, Kürzel)')).not.toBeNull()
        expect(screen.getByDisplayValue('test')).not.toBeNull()
    })


    it('calls the change callback on input', async function () {
        const user = userEvent.setup()
        const setSearchSpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanySMSearch search={''} setSearch={setSearchSpy} />
            </PermissionContext.Provider>
        )

        await user.type(screen.getByLabelText('Suche (Firma, Kürzel)'), 'a')
        expect(setSearchSpy.calledOnce).toBe(true)
    })
})