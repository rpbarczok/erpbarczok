import { Company } from "components/companies/CompanyPage.js";
import { DataWithMeta } from "components/Pages.js";
import { FunctionComponent, useEffect, useState } from "react";
import { ListGroup } from 'react-bootstrap'
import { useAuth } from "react-oidc-context";
import { useContextThrowUndefined } from "utils/contextUndefined.js";
import { LoadingContext } from "utils/loadingContext.js";
import { apiClient } from "utils/openAPIClientAxios.js";
import { PermissionContext, updateUserPermissions } from "utils/permissionContext.js";
import { removeStringBeforeLastDigits } from "utils/removeStringBeforeLastDigits.js";

export interface Address {
    'street': string
    'addition'?: string
    'po': string
    'city': string
    addressType: string
    country: string
}

interface AddressListComponent {
    activeCompany: DataWithMeta<Company>
}


export const AddressList: FunctionComponent<AddressListComponent> = ({ activeCompany }) => {
    const auth = useAuth()
    const token = auth.user?.access_token
    const { setIsLoading } = useContextThrowUndefined(LoadingContext)
    const [addressList, setAddressList] = useState<DataWithMeta<Address>[]>([])
    const { permissions, setPermissions } = useContextThrowUndefined(PermissionContext)

    useEffect(() => {

        async function getAddressesByCompany() {
            if (token) {
                setIsLoading(true)

                try {
                    const client = await apiClient
                    const result = await client.getAddresses(activeCompany.meta.location, null, { headers: { 'Authorization': `Bearer ${token}` } })
                    setIsLoading(false)
                    const newList = result.data.map(row => {
                        const newRow: DataWithMeta<Address> = {
                            meta: {
                                location: Number(removeStringBeforeLastDigits(row.meta.location)),
                                etag: row.meta.etag
                            },
                            data: row.data
                        }
                        return newRow
                    })
                    setAddressList(newList)
                    if (typeof result.headers.permissions === 'string') {
                        updateUserPermissions(result.headers.permissions, permissions, setPermissions)
                    } else {
                        throw new Error("Permission header must be type 'string'")
                    }
                } catch (error) {
                    setIsLoading(false)
                    throw Error(`Error while loading addresses: ${error instanceof Error ? error.message : String(error)}`)
                }
            }
        }

        void getAddressesByCompany()

    }, []

    )

    const list = () => {
        if (addressList.length === 0) {
            return (
                <p>Keine Adresse gefunden</p>
            )
        } else {
            addressList.map((element) => {
                return (
                    <ListGroup.Item  key={element.meta.location} >
                        {element.data.addressType}
                    </ListGroup.Item>
                )
            })


        }
    }

    return (
        <ListGroup className='scrollBox d-none d-sm-block' style={{ marginTop: '10px' }} id='address-list' >
            {list()}
        </ListGroup >
    )
}