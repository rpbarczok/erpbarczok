import { screen } from '@testing-library/react';
import { expect } from "expect"
import { noop } from "../utils/testdata.js";
import { PermissionContext } from "../../utils/permissionContext.js"
import { render } from "../utils/contextWrapper.js"
import { CompanyDelete } from 'components/companies/CompanyDelete.js';
import { userEvent } from '@testing-library/user-event';
import Sinon from 'sinon';


describe('Company Delete Test', function () {

    it('Calls delete callback when clicked on Delete button', async function () {
        const user = userEvent.setup()
        const deleteCompanySpy = Sinon.spy()
        render(
            <PermissionContext.Provider value={{ permissions: ['public', 'user'], setPermissions: noop }}>
                <CompanyDelete
                    addNote={noop}
                    setShow={noop}
                    deleteCompany={deleteCompanySpy}
                />
            </PermissionContext.Provider>
        )

        await user.click(screen.getByText('Löschen'))

        expect(deleteCompanySpy.calledOnce).toBe(true)

    })

})