import { useEffect, useState} from "react"

export function ListCompaniesXS({ search, activeCompany, onChangeActive, isNew, setIsNew, listCompanies } {

    const [listFiltered, setListFiltered] = useState<DataWithMeta<Company>[]>([])


    if (listFiltered.length === 0) {
        return (
            <ListGroup.Item className="standardDesign" key='none' active={false}>
                <Col xs={6}>
                    Keine Firmen gefunden!
                </Col>
                <Col xs={6}>

                </Col>
            </ListGroup.Item>
        )
    } else {
        return listFiltered.map((element) => {
            return (
                <ListGroup.Item className="standardDesign" key={element.meta.location} >
                    <Row>
                        <Col>
                            <span onClick={() => onChangeActive(element.meta.location)}>{element.data.name + (element.data.abbr ? " (" + element.data.abbr + ")" : "")}</span>
                        </Col>
                        <Col xs="auto">
                            <Button size="sm" variant='outline-primary' ><Pencil /></Button>
                        </Col>
                        <InputCompanies
                            key={String(newCompanyClick)}
                            listCompanyTypes={listCompanyTypes}
                            company={blandCompany}
                            setIsCompanyChanged={setIsCompanyChanged}
                            addEditNote={addEditNote}
                            setIsNew={setIsNew}
                            onChangeActive={handleChangeActive}
                            show={show} setShow={setShow}
                        />
                    </Row>


                </ListGroup.Item>
            )

        }
        )
    }