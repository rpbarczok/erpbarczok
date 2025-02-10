// import { Companytype } from "components/admin/companytypes/companytypes.jsx"
// import { DataWithMeta } from "components/forms.jsx"
// import { Company } from "./companies.jsx"
// import { Note, Notes } from "components/notifiers/notifiers.jsx"
// import { Button, ButtonGroup, Col, Form, Modal, Row } from "react-bootstrap"
// import { InputCompanies } from "./input.companies.jsx"
// import React, { MouseEvent, useState } from "react"
// import { client } from "utils/openapiclientaxios.js"
// import { removeBeforeLastDigits } from "utils/removeBeforeLastDigits.js"
// import { useNotifier } from "components/notifiers/useNotifier.js"

// interface ChangeFrameCompaniesComponent {
//     listCompanytypes: DataWithMeta<Companytype>[]
//     company: DataWithMeta<Company>
//     onChangeActive?: (active: number) => void
//     setIsCompanyChanged: React.Dispatch<React.SetStateAction<boolean>>
//     setIsNew?: React.Dispatch<React.SetStateAction<boolean>>
// }

// const ChangeFrameCompanies = ({ listCompanytypes, company, onChangeActive, setIsCompanyChanged, setIsNew }: ChangeFrameCompaniesComponent) => {

    

//     if (company.meta.location === 0) {
//         return (
//             <InputCompanies company={company} listCompanytypes={listCompanytypes} />
//         )
//     } else {
//         return (
//             <InputCompanies company={company} listCompanytypes={listCompanytypes} />
//         )
//     }

// }

// export default ChangeFrameCompanies